import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Friend } from '@/types';

const supabase = createClient();

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isMounted) {
          if (isMounted) setFriends([]);
          return;
        }
        const { data, error } = await supabase
          .from('friends')
          .select('*')
          .eq('user_id', user.id)
          .order('last_used_at', { ascending: false });
        if (!error && data && isMounted) setFriends(data);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFriends([]);
        return;
      }
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });
      if (!error && data) setFriends(data);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFriend = async (name: string, phone?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('friends')
      .insert({
        user_id: user.id,
        name,
        phone,
        times_used: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Add friend error:', error);
      return null;
    }
    if (data) {
      setFriends(prev => [data, ...prev]);
      return data;
    }
    return null;
  };

  const updateFriend = async (id: string, updates: Partial<Friend>) => {
    const { data, error } = await supabase
      .from('friends')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update friend error:', error);
      return null;
    }
    if (data) {
      setFriends(prev => prev.map(f => f.id === id ? data : f));
      return data;
    }
    return null;
  };

  const deleteFriend = async (id: string) => {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete friend error:', error);
      return false;
    }
    setFriends(prev => prev.filter(f => f.id !== id));
    return true;
  };

  const searchFriends = (query: string) => {
    if (!query) return friends;
    const lowerQuery = query.toLowerCase();
    return friends.filter(f => 
      f.name.toLowerCase().includes(lowerQuery) || 
      (f.phone && f.phone.includes(query))
    );
  };

  return { friends, loading, addFriend, updateFriend, deleteFriend, searchFriends, fetchFriends };
}
