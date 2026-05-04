import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data } = await locals.supabase.from('income').select('*').order('created_at');
	return { incomeItems: data ?? [], userId: locals.user!.id };
};
