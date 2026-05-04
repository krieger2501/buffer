import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data } = await locals.supabase.from('expenses').select('*').order('created_at');
	return { expenses: data ?? [], userId: locals.user!.id };
};
