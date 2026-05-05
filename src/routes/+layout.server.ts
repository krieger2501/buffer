import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let settings = null;
	if (locals.user) {
		const { data } = await locals.supabase
			.from('user_settings')
			.select('*')
			.eq('user_id', locals.user.id)
			.maybeSingle();
		settings = data;
	}

	return {
		user: locals.user,
		settings: {
			displayName: settings?.display_name ?? null,
			currency: settings?.currency ?? 'EUR',
			weekStartDay: settings?.week_start_day ?? 'monday'
		}
	};
};
