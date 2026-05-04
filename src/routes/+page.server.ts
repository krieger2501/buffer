import type { PageServerLoad } from './$types';
import type { UpcomingEvent } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const [{ data: accounts }, { data: expenses }, { data: incomeItems }, { data: debts }] =
		await Promise.all([
			locals.supabase.from('accounts').select('*').order('created_at'),
			locals.supabase.from('expenses').select('*').order('created_at'),
			locals.supabase.from('income').select('*').order('created_at'),
			locals.supabase.from('debts').select('*').order('created_at')
		]);

	const accountList = accounts ?? [];
	const expenseList = expenses ?? [];
	const incomeList = incomeItems ?? [];
	const debtList = debts ?? [];

	const monthlyExpenses = expenseList
		.filter((e) => e.active && e.recurrence === 'monthly')
		.reduce((s: number, e: { amount: number }) => s + e.amount, 0);

	const monthlyIncome = incomeList
		.filter((i) => i.recurrence === 'monthly')
		.reduce((s: number, i: { amount: number }) => s + i.amount, 0);

	const now = new Date();
	const in30 = new Date(now);
	in30.setDate(in30.getDate() + 30);

	const upcoming: UpcomingEvent[] = [
		...expenseList
			.filter(
				(e: { due_date: string | null; amount: number; name: string }) =>
					e.due_date && new Date(e.due_date) >= now && new Date(e.due_date) <= in30
			)
			.map((e: { id: string; name: string; amount: number; due_date: string }) => ({
				id: e.id,
				label: e.name,
				amount: e.amount,
				date: e.due_date,
				type: 'expense' as const
			})),
		...incomeList
			.filter(
				(i: { expected_date: string | null }) =>
					i.expected_date && new Date(i.expected_date) >= now && new Date(i.expected_date) <= in30
			)
			.map((i: { id: string; name: string; amount: number; expected_date: string }) => ({
				id: i.id,
				label: i.name,
				amount: i.amount,
				date: i.expected_date,
				type: 'income' as const
			})),
		...debtList
			.filter(
				(d: { paid: boolean; due_date: string | null }) =>
					!d.paid && d.due_date && new Date(d.due_date) >= now && new Date(d.due_date) <= in30
			)
			.map((d: { id: string; counterparty: string; amount: number; due_date: string }) => ({
				id: d.id,
				label: d.counterparty,
				amount: d.amount,
				date: d.due_date,
				type: 'debt' as const
			}))
	].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return {
		accounts: accountList,
		expenses: expenseList,
		incomeItems: incomeList,
		monthlyExpenses,
		monthlyIncome,
		upcoming
	};
};
