import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Split, Participant, CreateSplitInput } from '@/types';
import { nanoid } from 'nanoid';

const supabase = createClient();

export function useSplit() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSplits = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setSplits([]);
        return;
      }

      const { data, error } = await supabase
        .from('splits')
        .select('*, participants(*)')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSplits(data as Split[]);
      }
    } catch (err) {
      console.error('Failed to fetch splits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isMounted) {
          if (isMounted) setSplits([]);
          return;
        }
        const { data, error } = await supabase
          .from('splits')
          .select('*, participants(*)')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });
        if (!error && data && isMounted) setSplits(data as Split[]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const getSplit = async (id: string) => {
    const { data, error } = await supabase
      .from('splits')
      .select('*, participants(*), profiles!splits_creator_id_fkey(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Failed to get split:', error);
      return null;
    }
    return data;
  };

  const createSplit = async (input: CreateSplitInput) => {
    const { data: { user } } = await supabase.auth.getUser();

    // Ensure profile exists — only update UPI ID if explicitly provided
    if (user) {
      const profileUpdates: Record<string, unknown> = {
        id: user.id,
        name: input.collector_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Organizer',
        email: user.email || '',
      };
      if (input.collector_upi_id) {
        profileUpdates.upi_id = input.collector_upi_id;
      }
      await supabase.from('profiles').upsert(profileUpdates, { onConflict: 'id' });
    }

    const shareSlug = nanoid(8);

    // 1. Create Split
    const { data: splitData, error: splitError } = await supabase
      .from('splits')
      .insert({
        title: input.title,
        description: input.description || null,
        total_amount: input.total_amount,
        split_type: input.split_type,
        category: input.category || 'Other',
        collector_upi_id: input.collector_upi_id || null,
        collector_name: input.collector_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Organizer',
        creator_id: user?.id || null,
        share_slug: shareSlug,
        is_settled: false
      })
      .select()
      .single();

    if (splitError || !splitData) throw splitError;

    // 2. Create Participants — mark creator (self) as has_paid: true
    const participantsToInsert = input.participants.map(p => ({
      split_id: splitData.id,
      name: p.name,
      amount_owed: p.amount_owed,
      has_paid: p.name === input.collector_name, // Creator is already "paid" (they paid the bill)
      paid_at: p.name === input.collector_name ? new Date().toISOString() : null,
      marked_paid_by: p.name === input.collector_name ? 'collector' as const : null,
    }));

    const { error: partError } = await supabase
      .from('participants')
      .insert(participantsToInsert);
      
    if (partError) {
      // Rollback: delete the orphaned split
      await supabase.from('splits').delete().eq('id', splitData.id);
      throw partError;
    }

    // 3. Update Friends (background, with error handling) — exclude self
    if (user) {
      const updateFriends = async () => {
        const { data: existingFriends } = await supabase
          .from('friends')
          .select('*')
          .eq('user_id', user.id);
          
        const existingNames = new Set(existingFriends?.map((f: { name: string }) => f.name) || []);
        
        for (const p of input.participants) {
          // Skip the creator — don't add self as a friend
          if (p.name === input.collector_name) continue;
          
          if (existingNames.has(p.name)) {
            const friend = existingFriends?.find((f: { name: string }) => f.name === p.name);
            if (friend) {
              await supabase.from('friends').update({
                times_used: (friend.times_used || 0) + 1,
                last_used_at: new Date().toISOString()
              }).eq('id', friend.id);
            }
          } else {
            await supabase.from('friends').insert({
              user_id: user.id,
              name: p.name,
              times_used: 1,
              last_used_at: new Date().toISOString()
            });
          }
        }
      };
      
      // Handle the promise properly
      updateFriends().catch(err =>
        console.error('Background friends update failed:', err)
      );
    }

    return splitData;
  };

  const updateSplit = async (id: string, updates: Partial<Split>) => {
    const { data, error } = await supabase
      .from('splits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Update split error:', error);
      throw error;
    }
    if (data) {
      setSplits(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    }
    return data;
  };

  const deleteSplit = async (id: string) => {
    const { error } = await supabase
      .from('splits')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete split error:', error);
      throw error;
    }
    setSplits(prev => prev.filter(s => s.id !== id));
    return true;
  };

  return { splits, loading, createSplit, getSplit, updateSplit, deleteSplit, fetchSplits };
}
