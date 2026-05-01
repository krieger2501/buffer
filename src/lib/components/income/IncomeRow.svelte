<script lang="ts">
	import { ChevronRight, CheckCircle } from 'lucide-svelte';

	type Income = {
		id: string;
		name: string;
		amount: number;
		recurrence: string;
		expected_date: string | null;
		received: boolean;
	};
	let { income, onEdit }: { income: Income; onEdit?: (i: Income) => void } = $props();

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
</script>

<button
	type="button"
	onclick={() => onEdit?.(income)}
	class="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]
         bg-[var(--color-surface)] p-4 text-left shadow-sm transition-colors hover:border-[var(--color-income)]/30"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-lg"
		style="background-color: var(--color-income)18;"
	>
		{income.received ? '✅' : '⏳'}
	</div>
	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{income.name}</p>
		<p class="text-xs text-[var(--color-neutral)] capitalize">
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
		<p class="text-sm font-semibold text-[var(--color-income)] tabular-nums">
			{fmt(income.amount)}
		</p>
		<ChevronRight size={14} class="text-[var(--color-neutral)]" />
	</div>
</button>
