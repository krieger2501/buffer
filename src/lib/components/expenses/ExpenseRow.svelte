<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { formatCurrency } from '$lib/utils';

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
	let {
		expense,
		once = false,
		onEdit
	}: { expense: Expense; once?: boolean; onEdit?: (e: Expense) => void } = $props();

	const isPaid = $derived(once && !expense.active);
	const fmt = (n: number) => formatCurrency(n);
</script>

<button
	type="button"
	onclick={() => onEdit?.(expense)}
	class="flex w-full items-center gap-3 rounded-lg border bg-surface p-4 text-left shadow-sm transition-colors
	       {once
		? 'border-dashed border-border hover:border-expense/40'
		: 'border-border hover:border-expense/30'}
	       {isPaid ? 'opacity-60' : ''}"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg"
		style="background-color: var(--color-expense)18;"
	>
		{once ? (isPaid ? '✅' : '🗓️') : (CATEGORY_ICONS[expense.category] ?? '📌')}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium {isPaid ? 'line-through' : ''}">{expense.name}</p>
		<p class="text-xs text-neutral capitalize">
			{#if once}
				{#if expense.due_date}
					due {new Date(expense.due_date).toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'short'
					})}
				{:else}
					one-time
				{/if}
				{#if isPaid}<span class="text-income"> · paid</span>{/if}
			{:else}
				{expense.category} · {expense.recurrence}
				{#if !expense.active}<span> · paused</span>{/if}
			{/if}
		</p>
	</div>
	<div class="flex items-center gap-1">
		<p class="text-sm font-semibold text-expense tabular-nums">
			{fmt(expense.amount)}
		</p>
		<ChevronRight size={14} class="text-neutral" />
	</div>
</button>
