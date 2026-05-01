<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import IncomeRow from '$lib/components/income/IncomeRow.svelte';
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
		form = { name: '', amount: '', recurrence: 'monthly', expected_date: '', received: false };
		showForm = true;
	}

	function openEdit(income: Income) {
		editing = income;
		form = {
			name: income.name,
			amount: String(income.amount),
			recurrence: income.recurrence,
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
			expected_date: form.expected_date || null,
			received: form.received
		};
		if (editing) {
			await supabase.from('income').update(payload).eq('id', editing.id);
		} else {
			await supabase.from('income').insert(payload);
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
					class="flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-income)] px-3 py-1.5 text-xs font-medium text-white"
				>
					<Plus size={14} /> Add
				</button>
			{/snippet}
		</PageHeader>
	</div>

	<div class="mx-4 mb-4 grid grid-cols-2 gap-3">
		<div
			class="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
		>
			<p class="text-xs text-[var(--color-neutral)]">Monthly expected</p>
			<p class="mt-0.5 text-sm font-semibold text-[var(--color-income)] tabular-nums">
				{fmt(monthlyTotal)}
			</p>
		</div>
		<div
			class="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
		>
			<p class="text-xs text-[var(--color-neutral)]">Received</p>
			<p class="mt-0.5 text-sm font-semibold text-[var(--color-income)] tabular-nums">
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
					class="absolute top-1/2 right-14 -translate-y-1/2 rounded p-1 text-xs text-[var(--color-neutral)] hover:text-[var(--color-expense)]"
					aria-label="Delete">✕</button
				>
			</div>
		{/each}
		{#if data.incomeItems.length === 0}
			<div
				class="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-8 text-center"
			>
				<p class="text-sm text-[var(--color-neutral)]">
					No income tracked yet. Tap "Add" to create one.
				</p>
			</div>
		{/if}
	</div>
</div>

{#if showForm}
	<div
		class="fixed inset-0 z-50 flex flex-col justify-end bg-black/30"
		role="dialog"
		aria-modal="true"
	>
		<div class="rounded-t-[var(--radius-2xl)] bg-[var(--color-surface)] px-4 pt-5 pb-8">
			<div class="mb-5 flex items-center justify-between">
				<h2 class="text-base font-semibold">{editing ? 'Edit Income' : 'New Income'}</h2>
				<button type="button" onclick={() => (showForm = false)} class="text-[var(--color-neutral)]"
					>✕</button
				>
			</div>
			<div class="space-y-3">
				<div>
					<label for="inc-name" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
						>Name</label
					>
					<input id="inc-name" bind:value={form.name} class="input" placeholder="e.g. Salary" />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label
							for="inc-amount"
							class="mb-1 block text-xs font-medium text-[var(--color-neutral)]">Amount</label
						>
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
						<label
							for="inc-recurrence"
							class="mb-1 block text-xs font-medium text-[var(--color-neutral)]">Recurrence</label
						>
						<select id="inc-recurrence" bind:value={form.recurrence} class="input">
							{#each recurrences as r (r)}<option value={r}>{r}</option>{/each}
						</select>
					</div>
				</div>
				<div>
					<label
						for="inc-exp-date"
						class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
						>Expected date (optional)</label
					>
					<input id="inc-exp-date" bind:value={form.expected_date} type="date" class="input" />
				</div>
				<label class="flex items-center gap-2 text-sm">
					<input bind:checked={form.received} type="checkbox" class="h-4 w-4 rounded" />
					Already received
				</label>
			</div>
			<button
				type="submit"
				onclick={save}
				class="mt-5 w-full rounded-[var(--radius-lg)] bg-[var(--color-income)] py-3 text-sm font-semibold text-white"
			>
				{editing ? 'Save Changes' : 'Create Income'}
			</button>
		</div>
	</div>
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
