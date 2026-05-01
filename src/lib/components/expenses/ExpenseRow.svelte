<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	const CATEGORY_ICONS: Record<string, string> = {
		housing: '🏠',
		utilities: '⚡',
		subscription: '🔄',
		insurance: '🛡️',
		food: '🍽️',
		transport: '🚌',
		other: '📌'
	};

	type Expense = {
		id: string;
		name: string;
		category: string;
		amount: number;
		recurrence: string;
		due_date: string | null;
		active: boolean;
	};
	let { expense, onEdit }: { expense: Expense; onEdit?: (e: Expense) => void } = $props();

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
</script>

<button
	type="button"
	onclick={() => onEdit?.(expense)}
	class="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]
         bg-[var(--color-surface)] p-4 text-left shadow-sm transition-colors hover:border-[var(--color-expense)]/30
         {!expense.active ? 'opacity-50' : ''}"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-lg"
		style="background-color: var(--color-expense)18;"
	>
		{CATEGORY_ICONS[expense.category] ?? '📌'}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{expense.name}</p>
		<p class="text-xs text-[var(--color-neutral)] capitalize">
			{expense.category} · {expense.recurrence}
			{#if !expense.active}<span> · paused</span>{/if}
		</p>
	</div>
	<div class="flex items-center gap-1">
		<p class="text-sm font-semibold text-[var(--color-expense)] tabular-nums">
			{fmt(expense.amount)}
		</p>
		<ChevronRight size={14} class="text-[var(--color-neutral)]" />
	</div>
</button>
