-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  upi_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create friends table
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  times_used INT NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their friends." ON friends FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert friends." ON friends FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their friends." ON friends FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their friends." ON friends FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_friends_user_id ON friends(user_id);

-- Create splits table
CREATE TABLE splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_amount DECIMAL(12,2) NOT NULL,
  split_type TEXT NOT NULL CHECK (split_type IN ('equal', 'exact', 'percentage')),
  category TEXT,
  collector_upi_id TEXT,
  collector_name TEXT,
  share_slug TEXT NOT NULL UNIQUE,
  is_settled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE splits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view their splits." ON splits FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Anyone can view splits by share_slug." ON splits FOR SELECT USING (true);
CREATE POLICY "Creators can insert splits." ON splits FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their splits." ON splits FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their splits." ON splits FOR DELETE USING (auth.uid() = creator_id);

CREATE INDEX idx_splits_share_slug ON splits(share_slug);

-- Create participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount_owed DECIMAL(12,2) NOT NULL,
  has_paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  marked_paid_by TEXT CHECK (marked_paid_by IN ('self', 'collector') OR marked_paid_by IS NULL),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view participants of a split." ON participants FOR SELECT USING (true);
CREATE POLICY "Creators can insert participants." ON participants FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT creator_id FROM splits WHERE id = split_id)
);
CREATE POLICY "Anyone can update participants to mark paid." ON participants FOR UPDATE USING (true);
CREATE POLICY "Creators can delete participants." ON participants FOR DELETE USING (
  auth.uid() IN (SELECT creator_id FROM splits WHERE id = split_id)
);

-- Enable realtime for participants
ALTER PUBLICATION supabase_realtime ADD TABLE participants;

-- Create ledger_entries table
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
  counterparty_name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  settled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their ledger." ON ledger_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert ledger entries." ON ledger_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their ledger." ON ledger_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their ledger." ON ledger_entries FOR DELETE USING (auth.uid() = user_id);
