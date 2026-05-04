import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data } = await locals.supabase.from('accounts').select('*').order('created_at');
	return { accounts: data ?? [], userId: locals.user!.id };
};
