import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [{ data: accounts }, { data: expenses }, { data: incomeItems }, { data: debts }] =
		await Promise.all([
			locals.supabase.from('accounts').select('*').order('created_at'),
			locals.supabase.from('expenses').select('*').order('created_at'),
			locals.supabase.from('income').select('*').order('created_at'),
			locals.supabase.from('debts').select('*').order('created_at')
		]);
	return {
		accounts: accounts ?? [],
		expenses: expenses ?? [],
		incomeItems: incomeItems ?? [],
		debts: debts ?? []
	};
};
