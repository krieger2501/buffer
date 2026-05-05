<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import IncomeRow from '$lib/components/income/IncomeRow.svelte';
	import BottomSheet from '$lib/components/layout/BottomSheet.svelte';
	import { Plus } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();
	type Income = (typeof data.incomeItems)[number];

	let showForm = $state(false);
	let editing = $state<Income | null>(null);
	let form = $state({
		name: '',
		amount: '',
		recurrence: 'monthly',
		day_of_month: '',
		expected_date: '',
		received: false
	});

	const recurrences = ['once', 'weekly', 'biweekly', 'monthly', 'yearly'];
	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

	const monthlyTotal = $derived(
		data.incomeItems
			.filter((i: Income) => i.recurrence === 'monthly')
			.reduce((s: number, i: Income) => s + i.amount, 0)
	);
	const receivedTotal = $derived(
		data.incomeItems
			.filter((i: Income) => i.received)
			.reduce((s: number, i: Income) => s + i.amount, 0)
	);

	function openNew() {
		editing = null;
		form = {
			name: '',
			amount: '',
			recurrence: 'monthly',
			day_of_month: '',
			expected_date: '',
			received: false
		};
		showForm = true;
	}

	function openEdit(income: Income) {
		editing = income;
		form = {
			name: income.name,
			amount: String(income.amount),
			recurrence: income.recurrence,
			day_of_month: income.day_of_month ?? '',
			expected_date: income.expected_date ?? '',
			received: income.received
		};
		showForm = true;
	}

	async function save() {
		const payload = {
			name: form.name,
			amount: parseFloat(form.amount) || 0,
			recurrence: form.recurrence,
			day_of_month: form.recurrence !== 'once' ? form.day_of_month || null : null,
			expected_date: form.recurrence === 'once' ? form.expected_date || null : null,
			received: form.received
		};
		if (editing) {
			await supabase.from('income').update(payload).eq('id', editing.id);
		} else {
			await supabase.from('income').insert({ ...payload, user_id: data.userId });
		}
		showForm = false;
		await invalidateAll();
	}

	async function remove(id: string) {
		if (!confirm('Delete this income?')) return;
		await supabase.from('income').delete().eq('id', id);
		await invalidateAll();
	}
</script>

<div class="pb-6">
	<div class="px-4 pt-4">
		<PageHeader title="Income">
			{#snippet actions()}
				<button
					type="button"
					onclick={openNew}
					class="flex items-center gap-1 rounded-md bg-income px-3 py-1.5 text-xs font-medium text-white"
				>
					<Plus size={14} /> Add
				</button>
			{/snippet}
		</PageHeader>
	</div>

	<div class="mx-4 mb-4 grid grid-cols-2 gap-3">
		<div class="rounded-lg border border-border bg-surface px-4 py-3">
			<p class="text-xs text-neutral">Monthly expected</p>
			<p class="mt-0.5 text-sm font-semibold text-income tabular-nums">
				{fmt(monthlyTotal)}
			</p>
		</div>
		<div class="rounded-lg border border-border bg-surface px-4 py-3">
			<p class="text-xs text-neutral">Received</p>
			<p class="mt-0.5 text-sm font-semibold text-income tabular-nums">
				{fmt(receivedTotal)}
			</p>
		</div>
	</div>

	<div class="space-y-2 px-4">
		{#each data.incomeItems as income (income.id)}
			<div class="relative">
				<IncomeRow {income} onEdit={openEdit} />
				<button
					type="button"
					onclick={() => remove(income.id)}
					class="absolute top-1/2 right-14 -translate-y-1/2 rounded p-1 text-xs text-neutral hover:text-expense"
					aria-label="Delete">✕</button
				>
			</div>
		{/each}
		{#if data.incomeItems.length === 0}
			<div class="rounded-xl border border-dashed border-border p-8 text-center">
				<p class="text-sm text-neutral">No income tracked yet. Tap "Add" to create one.</p>
			</div>
		{/if}
	</div>
</div>

{#if showForm}
	<BottomSheet bind:open={showForm} title={editing ? 'Edit Income' : 'New Income'}>
		<div class="space-y-3">
			<div>
				<label for="inc-name" class="mb-1 block text-xs font-medium text-neutral">Name</label>
				<input id="inc-name" bind:value={form.name} class="input" placeholder="e.g. Salary" />
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="inc-amount" class="mb-1 block text-xs font-medium text-neutral">Amount</label>
					<input
						id="inc-amount"
						bind:value={form.amount}
						type="number"
						step="0.01"
						class="input"
						placeholder="0.00"
					/>
				</div>
				<div>
					<label for="inc-recurrence" class="mb-1 block text-xs font-medium text-neutral"
						>Recurrence</label
					>
					<select id="inc-recurrence" bind:value={form.recurrence} class="input">
						{#each recurrences as r (r)}<option value={r}>{r}</option>{/each}
					</select>
				</div>
			</div>
			<div>
				{#if form.recurrence === 'once'}
					<label for="inc-exp-date" class="mb-1 block text-xs font-medium text-neutral"
						>Expected date (optional)</label
					>
					<input id="inc-exp-date" bind:value={form.expected_date} type="date" class="input" />
				{:else}
					<label for="inc-dom" class="mb-1 block text-xs font-medium text-neutral"
						>Day of month</label
					>
					<select id="inc-dom" bind:value={form.day_of_month} class="input">
						<option value="">— select —</option>
						{#each Array.from({ length: 28 }, (_, i) => i + 1) as d (d)}
							<option value={String(d)}>{d}.</option>
						{/each}
						<option value="last_working">Last working day</option>
						<option value="second_last_working">2nd-last working day</option>
					</select>
				{/if}
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input bind:checked={form.received} type="checkbox" class="h-4 w-4 rounded" />
				Already received
			</label>
		</div>
		<button
			type="submit"
			onclick={save}
			class="mt-5 w-full rounded-lg bg-income py-3 text-sm font-semibold text-white"
		>
			{editing ? 'Save Changes' : 'Create Income'}
		</button>
	</BottomSheet>
{/if}

<style>
	.input {
		width: 100%;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		outline: none;
	}
	.input:focus {
		border-color: var(--color-income);
	}
</style>
