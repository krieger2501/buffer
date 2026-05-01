<script lang="ts">
	const TYPE_ICONS: Record<string, string> = {
		checking: '🏦',
		savings: '🏛️',
		crypto: '₿',
		investment: '📈',
		cash: '💵',
		other: '💼'
	};

	let {
		account
	}: {
		account: {
			id: string;
			name: string;
			type: string;
			balance: number;
			currency: string;
			include_in_total: boolean;
			color: string | null;
		};
	} = $props();

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: account.currency }).format(n);
</script>

<div
	class="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]
         bg-[var(--color-surface)] p-4 shadow-sm"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-lg"
		style="background-color: {account.color ?? 'oklch(0.93 0.05 264)'}22;"
	>
		{TYPE_ICONS[account.type] ?? '💼'}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{account.name}</p>
		<p class="text-xs text-[var(--color-neutral)] capitalize">{account.type}</p>
	</div>
	<div class="text-right">
		<p class="text-sm font-semibold tabular-nums">{fmt(account.balance)}</p>
		{#if !account.include_in_total}
			<p class="text-[10px] text-[var(--color-neutral)]">excluded</p>
		{/if}
	</div>
</div>
