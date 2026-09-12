import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Participant } from '@/types';

const supabase = createClient();

export function useRealtimeParticipants(splitId: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!splitId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('split_id', splitId);
      
      if (!error && data && isMounted) {
        setParticipants(data);
      }
      if (isMounted) setLoading(false);
    };

    fetchParticipants();

    const channel = supabase
      .channel(`public:participants:split_id=eq.${splitId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'participants',
          filter: `split_id=eq.${splitId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          const updatedParticipant = payload.new as unknown as Participant;
          setParticipants((prev) =>
            prev.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p))
          );
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [splitId]);

  return { participants, loading };
}
