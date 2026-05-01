<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	const TYPE_ICONS: Record<string, string> = {
		checking: '🏦',
		savings: '🏛️',
		crypto: '₿',
		investment: '📈',
		cash: '💵',
		other: '💼'
	};

	type Account = {
		id: string;
		name: string;
		type: string;
		balance: number;
		currency: string;
		include_in_total: boolean;
		color: string | null;
	};

	let { account, onEdit }: { account: Account; onEdit?: (a: Account) => void } = $props();

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: account.currency }).format(n);
</script>

<button
	type="button"
	onclick={() => onEdit?.(account)}
	class="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]
         bg-[var(--color-surface)] p-4 text-left shadow-sm transition-colors hover:border-[var(--color-primary-200)]"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-lg"
		style="background-color: {account.color ?? 'oklch(0.93 0.05 264)'}22;"
	>
		{TYPE_ICONS[account.type] ?? '💼'}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{account.name}</p>
		<p class="text-xs text-[var(--color-neutral)] capitalize">
			{account.type} · {account.currency}
			{#if !account.include_in_total}
				· <span class="text-[var(--color-debt)]">excluded from total</span>
			{/if}
		</p>
	</div>
	<div class="flex items-center gap-1">
		<p class="text-sm font-semibold tabular-nums">{fmt(account.balance)}</p>
		<ChevronRight size={14} class="text-[var(--color-neutral)]" />
	</div>
</button>
