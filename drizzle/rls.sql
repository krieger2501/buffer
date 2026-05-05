-- Run this in Supabase → SQL Editor after applying the Drizzle migration.
-- Idempotent: safe to re-run at any time.

-- ── grant table-level privileges to Supabase roles ───────────────────────────
GRANT ALL ON accounts      TO authenticated, service_role;
GRANT ALL ON expenses      TO authenticated, service_role;
GRANT ALL ON income        TO authenticated, service_role;
GRANT ALL ON debts         TO authenticated, service_role;
GRANT ALL ON user_settings TO authenticated, service_role;

-- ── accounts ─────────────────────────────────────────────────────────────────
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'accounts' AND policyname = 'accounts: own rows only'
  ) THEN
    CREATE POLICY "accounts: own rows only"
      ON accounts FOR ALL
      TO authenticated
      USING  (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── expenses ──────────────────────────────────────────────────────────────────
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'expenses: own rows only'
  ) THEN
    CREATE POLICY "expenses: own rows only"
      ON expenses FOR ALL
      TO authenticated
      USING  (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── income ────────────────────────────────────────────────────────────────────
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'income' AND policyname = 'income: own rows only'
  ) THEN
    CREATE POLICY "income: own rows only"
      ON income FOR ALL
      TO authenticated
      USING  (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── debts ─────────────────────────────────────────────────────────────────────
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'debts' AND policyname = 'debts: own rows only'
  ) THEN
    CREATE POLICY "debts: own rows only"
      ON debts FOR ALL
      TO authenticated
      USING  (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- ── user_settings ─────────────────────────────────────────────────────────────
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'user_settings: own row only'
  ) THEN
    CREATE POLICY "user_settings: own row only"
      ON user_settings FOR ALL
      TO authenticated
      USING  (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;
