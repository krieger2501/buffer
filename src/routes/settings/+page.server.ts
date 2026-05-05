import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data } = await locals.supabase
		.from('user_settings')
		.select('*')
		.eq('user_id', locals.user!.id)
		.maybeSingle();

	return {
		displayName: data?.display_name ?? '',
		currency: data?.currency ?? 'EUR',
		weekStartDay: data?.week_start_day ?? 'monday'
	};
};

export const actions: Actions = {
	save: async ({ locals, request }) => {
		const form = await request.formData();
		const displayName = (form.get('displayName') as string).trim();
		const currency = form.get('currency') as string;
		const weekStartDay = form.get('weekStartDay') as string;

		const { error } = await locals.supabase.from('user_settings').upsert({
			user_id: locals.user!.id,
			display_name: displayName || null,
			currency,
			week_start_day: weekStartDay,
			updated_at: new Date().toISOString()
		});

		if (error) return fail(500, { error: error.message });

		return { success: true };
	}
};
