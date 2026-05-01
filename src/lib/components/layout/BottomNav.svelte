<!-- Fixed bottom navigation bar for mobile-first layout -->
<script lang="ts">
	import { page } from '$app/stores';
	import { Home, CreditCard, Receipt, TrendingUp, Users, BarChart2 } from 'lucide-svelte';

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/accounts', label: 'Accounts', icon: CreditCard },
		{ href: '/expenses', label: 'Expenses', icon: Receipt },
		{ href: '/income', label: 'Income', icon: TrendingUp },
		{ href: '/debt', label: 'Debt', icon: Users },
		{ href: '/forecast', label: 'Forecast', icon: BarChart2 }
	] as const;

	const { url } = $derived($page);
</script>

<nav
	class="safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-50 flex h-[var(--bottom-nav-height)]
         items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-surface)]
         px-1"
>
	{#each navItems as item (item.href)}
		{@const active = url.pathname === item.href}
		<a
			href={item.href}
			class="flex flex-1 flex-col items-center gap-0.5 rounded-[var(--radius-md)] px-1 py-1.5
             transition-colors duration-150
             {active
				? 'text-[var(--color-primary-500)]'
				: 'text-[var(--color-neutral)] hover:text-[var(--color-primary-400)]'}"
		>
			<item.icon size={20} stroke-width={active ? 2.5 : 1.75} />
			<span class="text-[10px] leading-none font-medium">{item.label}</span>
		</a>
	{/each}
</nav>
