import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = ({ locals }) => {
	const meta = locals.user?.user_metadata ?? {};
	return {
		displayName: (meta.display_name as string) ?? '',
		currency: (meta.currency as string) ?? 'EUR',
		weekStartDay: (meta.week_start_day as string) ?? 'monday'
	};
};

export const actions: Actions = {
	save: async ({ locals, request }) => {
		const form = await request.formData();
		const displayName = form.get('displayName') as string;
		const currency = form.get('currency') as string;
		const weekStartDay = form.get('weekStartDay') as string;

		const { error } = await locals.supabase.auth.updateUser({
			data: { display_name: displayName, currency, week_start_day: weekStartDay }
		});

		if (error) return fail(500, { error: error.message });

		return { success: true };
	}
};
