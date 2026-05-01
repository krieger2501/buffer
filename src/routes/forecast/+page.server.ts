import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const [{ data: accounts }, { data: expenses }, { data: incomeItems }, { data: debts }] =
		await Promise.all([
			supabase.from('accounts').select('*').order('created_at'),
			supabase.from('expenses').select('*').order('created_at'),
			supabase.from('income').select('*').order('created_at'),
			supabase.from('debts').select('*').order('created_at')
		]);
	return {
		accounts: accounts ?? [],
		expenses: expenses ?? [],
		incomeItems: incomeItems ?? [],
		debts: debts ?? []
	};
};
