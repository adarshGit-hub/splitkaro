export interface Profile {
  id: string
  name: string
  email: string
  avatar_url: string | null
  upi_id: string | null
  created_at: string
}

export interface Friend {
  id: string
  user_id: string
  name: string
  phone: string | null
  times_used: number
  last_used_at: string
  created_at: string
}

export interface Split {
  id: string
  creator_id: string
  title: string
  description: string | null
  total_amount: number
  split_type: 'equal' | 'exact' | 'percentage'
  category: string | null
  collector_upi_id: string | null
  collector_name: string | null
  share_slug: string
  is_settled: boolean
  created_at: string
  updated_at: string
  participants?: Participant[]
}

export interface Participant {
  id: string
  split_id: string
  name: string
  amount_owed: number
  has_paid: boolean
  paid_at: string | null
  marked_paid_by: 'self' | 'collector' | null
  created_at: string
}

export interface LedgerEntry {
  id: string
  user_id: string
  split_id: string
  counterparty_name: string
  amount: number
  settled: boolean
  created_at: string
}

export interface CreateSplitInput {
  title: string
  description?: string
  total_amount: number
  split_type: 'equal' | 'exact' | 'percentage'
  category?: string
  collector_upi_id?: string
  collector_name?: string
  participants: {
    name: string
    amount_owed: number
  }[]
}
