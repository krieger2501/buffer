-- Run this in Supabase → SQL Editor after applying the Drizzle migration.
-- Enables RLS and creates per-user policies on all four tables.

-- ── accounts ─────────────────────────────────────────────────────────────────
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accounts: own rows only"
  ON accounts FOR ALL
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── expenses ──────────────────────────────────────────────────────────────────
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses: own rows only"
  ON expenses FOR ALL
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── income ────────────────────────────────────────────────────────────────────
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

CREATE POLICY "income: own rows only"
  ON income FOR ALL
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── debts ─────────────────────────────────────────────────────────────────────
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "debts: own rows only"
  ON debts FOR ALL
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
