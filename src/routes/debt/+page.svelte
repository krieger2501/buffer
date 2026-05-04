<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DebtCard from '$lib/components/debt/DebtCard.svelte';
	import BottomSheet from '$lib/components/layout/BottomSheet.svelte';
	import { Plus } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();
	type Debt = (typeof data.debts)[number];

	let showForm = $state(false);
	let editing = $state<Debt | null>(null);
	let form = $state({
		direction: 'owe',
		counterparty: '',
		amount: '',
		due_date: '',
		paid: false,
		notes: ''
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

	const totalOwe = $derived(
		data.debts
			.filter((d: Debt) => d.direction === 'owe' && !d.paid)
			.reduce((s: number, d: Debt) => s + d.amount, 0)
	);
	const totalOwed = $derived(
		data.debts
			.filter((d: Debt) => d.direction === 'owed' && !d.paid)
			.reduce((s: number, d: Debt) => s + d.amount, 0)
	);
	const oweDebts = $derived(data.debts.filter((d: Debt) => d.direction === 'owe'));
	const owedDebts = $derived(data.debts.filter((d: Debt) => d.direction === 'owed'));

	function openNew() {
		editing = null;
		form = { direction: 'owe', counterparty: '', amount: '', due_date: '', paid: false, notes: '' };
		showForm = true;
	}

	function openEdit(debt: Debt) {
		editing = debt;
		form = {
			direction: debt.direction,
			counterparty: debt.counterparty,
			amount: String(debt.amount),
			due_date: debt.due_date ?? '',
			paid: debt.paid,
			notes: debt.notes ?? ''
		};
		showForm = true;
	}

	async function save() {
		const payload = {
			direction: form.direction,
			counterparty: form.counterparty,
			amount: parseFloat(form.amount) || 0,
			due_date: form.due_date || null,
			paid: form.paid,
			notes: form.notes || null
		};
		if (editing) {
			await supabase.from('debts').update(payload).eq('id', editing.id);
		} else {
			await supabase.from('debts').insert(payload);
		}
		showForm = false;
		await invalidateAll();
	}

	async function remove(id: string) {
		if (!confirm('Delete this debt?')) return;
		await supabase.from('debts').delete().eq('id', id);
		await invalidateAll();
	}
</script>

<div class="pb-6">
	<div class="px-4 pt-4">
		<PageHeader title="Debt Tracker">
			{#snippet actions()}
				<button
					type="button"
					onclick={openNew}
					class="flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-debt)] px-3 py-1.5 text-xs font-medium text-white"
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
			<p class="text-xs text-[var(--color-neutral)]">I owe</p>
			<p class="mt-0.5 text-sm font-semibold text-[var(--color-expense)] tabular-nums">
				{fmt(totalOwe)}
			</p>
		</div>
		<div
			class="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
		>
			<p class="text-xs text-[var(--color-neutral)]">Owed to me</p>
			<p class="mt-0.5 text-sm font-semibold text-[var(--color-income)] tabular-nums">
				{fmt(totalOwed)}
			</p>
		</div>
	</div>

	{#if oweDebts.length > 0}
		<p
			class="mb-2 px-4 text-xs font-semibold tracking-widest text-[var(--color-neutral)] uppercase"
		>
			I Owe
		</p>
		<div class="mb-4 space-y-2 px-4">
			{#each oweDebts as debt (debt.id)}
				<div class="relative">
					<DebtCard {debt} onEdit={openEdit} />
					<button
						type="button"
						onclick={() => remove(debt.id)}
						class="absolute top-1/2 right-14 -translate-y-1/2 rounded p-1 text-xs text-[var(--color-neutral)] hover:text-[var(--color-expense)]"
						aria-label="Delete">✕</button
					>
				</div>
			{/each}
		</div>
	{/if}

	{#if owedDebts.length > 0}
		<p
			class="mb-2 px-4 text-xs font-semibold tracking-widest text-[var(--color-neutral)] uppercase"
		>
			Owed to Me
		</p>
		<div class="space-y-2 px-4">
			{#each owedDebts as debt (debt.id)}
				<div class="relative">
					<DebtCard {debt} onEdit={openEdit} />
					<button
						type="button"
						onclick={() => remove(debt.id)}
						class="absolute top-1/2 right-14 -translate-y-1/2 rounded p-1 text-xs text-[var(--color-neutral)] hover:text-[var(--color-expense)]"
						aria-label="Delete">✕</button
					>
				</div>
			{/each}
		</div>
	{/if}

	{#if data.debts.length === 0}
		<div
			class="mx-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-8 text-center"
		>
			<p class="text-sm text-[var(--color-neutral)]">No debts tracked. Tap "Add" to create one.</p>
		</div>
	{/if}
</div>

{#if showForm}
	<BottomSheet bind:open={showForm} title={editing ? 'Edit Debt' : 'New Debt'}>
		<div class="space-y-3">
			<div>
				<label
					for="dbt-direction"
					class="mb-1 block text-xs font-medium text-[var(--color-neutral)]">Direction</label
				>
				<select id="dbt-direction" bind:value={form.direction} class="input">
					<option value="owe">I owe them</option>
					<option value="owed">They owe me</option>
				</select>
			</div>
			<div>
				<label
					for="dbt-counterparty"
					class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
					>Person / entity</label
				>
				<input
					id="dbt-counterparty"
					bind:value={form.counterparty}
					class="input"
					placeholder="e.g. Alex"
				/>
			</div>
			<div>
				<label for="dbt-amount" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
					>Amount</label
				>
				<input
					id="dbt-amount"
					bind:value={form.amount}
					type="number"
					step="0.01"
					class="input"
					placeholder="0.00"
				/>
			</div>
			<div>
				<label for="dbt-due" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
					>Due date (optional)</label
				>
				<input id="dbt-due" bind:value={form.due_date} type="date" class="input" />
			</div>
			<div>
				<label for="dbt-notes" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
					>Notes (optional)</label
				>
				<input
					id="dbt-notes"
					bind:value={form.notes}
					class="input"
					placeholder="e.g. dinner split"
				/>
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input bind:checked={form.paid} type="checkbox" class="h-4 w-4 rounded" />
				Settled / paid
			</label>
		</div>
		<button
			type="submit"
			onclick={save}
			class="mt-5 w-full rounded-[var(--radius-lg)] bg-[var(--color-debt)] py-3 text-sm font-semibold text-white"
		>
			{editing ? 'Save Changes' : 'Create Debt'}
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
		border-color: var(--color-debt);
	}
</style>
