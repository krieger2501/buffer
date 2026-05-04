import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data } = await locals.supabase.from('debts').select('*').order('created_at');
	return { debts: data ?? [], userId: locals.user!.id };
};
