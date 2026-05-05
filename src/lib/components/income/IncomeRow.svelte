<script lang="ts">
	import { ChevronRight, CheckCircle } from 'lucide-svelte';
	import { formatCurrency } from '$lib/utils';

	type Income = {
		id: string;
		name: string;
		amount: number;
		recurrence: string;
		expected_date: string | null;
		received: boolean;
	};
	let { income, onEdit }: { income: Income; onEdit?: (i: Income) => void } = $props();

	const fmt = (n: number) => formatCurrency(n);
</script>

<button
	type="button"
	onclick={() => onEdit?.(income)}
	class="flex w-full items-center gap-3 rounded-lg border border-border
         bg-surface p-4 text-left shadow-sm transition-colors hover:border-income/30"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg"
		style="background-color: var(--color-income)18;"
	>
		{income.received ? '✅' : '⏳'}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{income.name}</p>
		<p class="text-xs text-neutral capitalize">
			{income.recurrence}
			{#if income.expected_date}
				· due {new Date(income.expected_date).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'short'
				})}{/if}
		</p>
	</div>
	<div class="flex items-center gap-1">
		{#if income.received}
			<CheckCircle size={14} style="color: var(--color-income);" />
		{/if}
		<p class="text-sm font-semibold text-income tabular-nums">
			{fmt(income.amount)}
		</p>
		<ChevronRight size={14} class="text-neutral" />
	</div>
</button>
