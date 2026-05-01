import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const { data } = await supabase.from('debts').select('*').order('created_at');
	return { debts: data ?? [] };
};
