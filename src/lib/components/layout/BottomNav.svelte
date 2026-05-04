<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Home, CreditCard, Receipt, TrendingUp, Users, BarChart2 } from 'lucide-svelte';
	import { supabase } from '$lib/supabaseClient';

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/accounts', label: 'Accounts', icon: CreditCard },
		{ href: '/expenses', label: 'Expenses', icon: Receipt },
		{ href: '/income', label: 'Income', icon: TrendingUp },
		{ href: '/debt', label: 'Debt', icon: Users },
		{ href: '/forecast', label: 'Forecast', icon: BarChart2 }
	] as const;

	const { url } = $derived($page);

	async function signOut() {
		await supabase.auth.signOut();
		goto('/login');
	}
</script>

<nav
	class="fixed right-0 bottom-0 left-0 z-50 flex h-[var(--bottom-nav-height)] items-center
	       justify-around border-t border-border bg-surface/95 px-1 backdrop-blur-md"
	style="padding-bottom: env(safe-area-inset-bottom);"
>
	{#each navItems as item (item.href)}
		{@const active = url.pathname === item.href}
		<a
			href={item.href}
			class="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5
			       transition-colors duration-150
			       {active ? 'text-primary-500' : 'text-neutral hover:text-primary-400'}"
		>
			{#if active}
				<span class="absolute top-1 h-1 w-5 rounded-full bg-primary-500/20"></span>
			{/if}
			<item.icon size={20} stroke-width={active ? 2.5 : 1.75} />
			<span class="text-[10px] leading-none font-medium">{item.label}</span>
		</a>
	{/each}

	<button
		type="button"
		onclick={signOut}
		class="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5
		       text-neutral transition-colors duration-150 hover:text-primary-400"
		aria-label="Sign out"
	>
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
		<span class="text-[10px] leading-none font-medium">Sign out</span>
	</button>
</nav>
