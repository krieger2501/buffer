<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { supabase } from '$lib/supabaseClient';
	import { Settings, LogOut } from 'lucide-svelte';
	import type { User } from '@supabase/supabase-js';

	let { user }: { user: User } = $props();

	let open = $state(false);

	const name = $derived(
		user.user_metadata?.display_name ||
			user.user_metadata?.full_name ||
			user.user_metadata?.name ||
			user.email?.split('@')[0] ||
			'Account'
	);

	const avatarUrl = $derived(user.user_metadata?.avatar_url as string | undefined);

	const initials = $derived(
		name
			.split(' ')
			.slice(0, 2)
			.map((w: string) => w[0]?.toUpperCase() ?? '')
			.join('')
	);

	const provider = $derived(user.app_metadata?.provider as string | undefined);

	const currentPath = $derived(page.url.pathname as string);

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	async function signOut() {
		close();
		await supabase.auth.signOut();
		goto('/login');
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class="relative">
	<!-- Trigger -->
	<button
		type="button"
		onclick={toggle}
		aria-label="Account menu"
		aria-expanded={open}
		class="relative flex size-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
	>
		{#if avatarUrl}
			<img src={avatarUrl} alt={name} class="size-9 rounded-full object-cover ring-2 ring-border" />
		{:else}
			<span
				class="flex size-9 items-center justify-center rounded-full bg-primary-100 text-[13px] font-semibold text-primary-600 ring-2 ring-border"
			>
				{initials}
			</span>
		{/if}

		<!-- Provider badge -->
		{#if provider === 'google' || provider === 'apple'}
			<span
				class="absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full bg-surface ring-1 ring-border"
				aria-hidden="true"
			>
				{#if provider === 'google'}
					<svg viewBox="0 0 24 24" class="size-2.5" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" class="size-2.5" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
							fill="#000"
						/>
					</svg>
				{/if}
			</span>
		{/if}
	</button>

	<!-- Dropdown -->
	{#if open}
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 z-40"
			onclick={close}
			aria-label="Close menu"
			tabindex="-1"
		></button>

		<div
			class="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
			role="menu"
		>
			<!-- User info header -->
			<div class="flex items-center gap-3 px-4 py-3">
				{#if avatarUrl}
					<img src={avatarUrl} alt={name} class="size-10 rounded-full object-cover" />
				{:else}
					<span
						class="flex size-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600"
					>
						{initials}
					</span>
				{/if}
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold">{name}</p>
					<p class="truncate text-[11px] text-neutral">{user.email}</p>
				</div>
			</div>

			<div class="h-px bg-border"></div>

			<!-- Settings -->
			<a
				href="/settings"
				onclick={close}
				class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-surface-muted {currentPath ===
				'/settings'
					? 'font-medium text-primary-500'
					: ''}"
				role="menuitem"
			>
				<Settings size={16} stroke-width={1.75} />
				Settings
			</a>

			<div class="h-px bg-border"></div>

			<!-- Sign out -->
			<button
				type="button"
				onclick={signOut}
				class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-expense transition-colors hover:bg-surface-muted"
				role="menuitem"
			>
				<LogOut size={16} stroke-width={1.75} />
				Sign out
			</button>
		</div>
	{/if}
</div>
