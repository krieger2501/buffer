<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	type Debt = {
		id: string;
		direction: string;
		counterparty: string;
		amount: number;
		paid: boolean;
		due_date: string | null;
	};
	let { debt, onEdit }: { debt: Debt; onEdit?: (d: Debt) => void } = $props();

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
</script>

<button
	type="button"
	onclick={() => onEdit?.(debt)}
	class="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]
         bg-[var(--color-surface)] p-4 text-left shadow-sm transition-colors
         hover:border-[var(--color-debt)]/30 {debt.paid ? 'opacity-50' : ''}"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
		style="background-color: var(--color-debt)18; color: var(--color-debt);"
	>
		{debt.direction === 'owe' ? 'OUT' : 'IN'}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{debt.counterparty}</p>
		<p class="text-xs text-[var(--color-neutral)]">
			{debt.direction === 'owe' ? 'I owe' : 'Owed to me'}
			{#if debt.due_date}
				· due {new Date(debt.due_date).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'short'
				})}{/if}
			{#if debt.paid}
				· <span style="color: var(--color-income);">paid</span>{/if}
		</p>
	</div>
	<div class="flex items-center gap-1">
		<p class="text-sm font-semibold tabular-nums" style="color: var(--color-debt);">
			{fmt(debt.amount)}
		</p>
		<ChevronRight size={14} class="text-[var(--color-neutral)]" />
	</div>
</button>
