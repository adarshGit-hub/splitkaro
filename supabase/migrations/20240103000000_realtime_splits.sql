-- Enable realtime for splits table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'splits'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE splits;
  END IF;
END $$;
