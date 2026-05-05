<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ExpenseRow from '$lib/components/expenses/ExpenseRow.svelte';
	import BottomSheet from '$lib/components/layout/BottomSheet.svelte';
	import { Plus } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();
	type Expense = (typeof data.expenses)[number];

	let showForm = $state(false);
	let editing = $state<Expense | null>(null);
	let form = $state({
		name: '',
		category: 'other',
		amount: '',
		recurrence: 'monthly',
		day_of_month: '',
		due_date: '',
		active: true
	});

	const categories = [
		'housing',
		'utilities',
		'subscription',
		'insurance',
		'food',
		'transport',
		'other'
	];
	const recurrences = ['once', 'weekly', 'monthly', 'quarterly', 'yearly'];
	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

	const monthlyTotal = $derived(
		data.expenses
			.filter((e: Expense) => e.active && e.recurrence === 'monthly')
			.reduce((s: number, e: Expense) => s + e.amount, 0)
	);

	function openNew() {
		editing = null;
		form = {
			name: '',
			category: 'other',
			amount: '',
			recurrence: 'monthly',
			day_of_month: '',
			due_date: '',
			active: true
		};
		showForm = true;
	}

	function openEdit(expense: Expense) {
		editing = expense;
		form = {
			name: expense.name,
			category: expense.category,
			amount: String(expense.amount),
			recurrence: expense.recurrence,
			day_of_month: expense.day_of_month ?? '',
			due_date: expense.due_date ?? '',
			active: expense.active
		};
		showForm = true;
	}

	async function save() {
		const payload = {
			name: form.name,
			category: form.category,
			amount: parseFloat(form.amount) || 0,
			recurrence: form.recurrence,
			day_of_month: form.recurrence !== 'once' ? form.day_of_month || null : null,
			due_date: form.recurrence === 'once' ? form.due_date || null : null,
			active: form.active
		};
		if (editing) {
			await supabase.from('expenses').update(payload).eq('id', editing.id);
		} else {
			await supabase.from('expenses').insert({ ...payload, user_id: data.userId });
		}
		showForm = false;
		await invalidateAll();
	}

	async function remove(id: string) {
		if (!confirm('Delete this expense?')) return;
		await supabase.from('expenses').delete().eq('id', id);
		await invalidateAll();
	}
</script>

<div class="pb-6">
	<div class="px-4 pt-4">
		<PageHeader title="Expenses">
			{#snippet actions()}
				<button
					type="button"
					onclick={openNew}
					class="flex items-center gap-1 rounded-md bg-expense px-3 py-1.5 text-xs font-medium text-white"
				>
					<Plus size={14} /> Add
				</button>
			{/snippet}
		</PageHeader>
	</div>

	<div class="mx-4 mb-4 rounded-lg border border-border bg-surface px-4 py-3">
		<div class="flex justify-between text-sm">
			<span class="text-neutral">Monthly total</span>
			<span class="font-semibold text-expense tabular-nums">{fmt(monthlyTotal)}</span>
		</div>
	</div>

	<div class="space-y-2 px-4">
		{#each data.expenses as expense (expense.id)}
			<div class="relative">
				<ExpenseRow {expense} onEdit={openEdit} />
				<button
					type="button"
					onclick={() => remove(expense.id)}
					class="absolute top-1/2 right-14 -translate-y-1/2 rounded p-1 text-xs text-neutral hover:text-expense"
					aria-label="Delete">✕</button
				>
			</div>
		{/each}
		{#if data.expenses.length === 0}
			<div class="rounded-xl border border-dashed border-border p-8 text-center">
				<p class="text-sm text-neutral">No expenses yet. Tap "Add" to create one.</p>
			</div>
		{/if}
	</div>
</div>

{#if showForm}
	<BottomSheet bind:open={showForm} title={editing ? 'Edit Expense' : 'New Expense'}>
		<div class="space-y-3">
			<div>
				<label for="exp-name" class="mb-1 block text-xs font-medium text-neutral">Name</label>
				<input id="exp-name" bind:value={form.name} class="input" placeholder="e.g. Netflix" />
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="exp-category" class="mb-1 block text-xs font-medium text-neutral"
						>Category</label
					>
					<select id="exp-category" bind:value={form.category} class="input">
						{#each categories as c (c)}<option value={c}>{c}</option>{/each}
					</select>
				</div>
				<div>
					<label for="exp-recurrence" class="mb-1 block text-xs font-medium text-neutral"
						>Recurrence</label
					>
					<select id="exp-recurrence" bind:value={form.recurrence} class="input">
						{#each recurrences as r (r)}<option value={r}>{r}</option>{/each}
					</select>
				</div>
			</div>
			<div>
				<label for="exp-amount" class="mb-1 block text-xs font-medium text-neutral">Amount</label>
				<input
					id="exp-amount"
					bind:value={form.amount}
					type="number"
					step="0.01"
					class="input"
					placeholder="0.00"
				/>
			</div>
			<div>
				{#if form.recurrence === 'once'}
					<label for="exp-due" class="mb-1 block text-xs font-medium text-neutral"
						>Due date (optional)</label
					>
					<input id="exp-due" bind:value={form.due_date} type="date" class="input" />
				{:else}
					<label for="exp-dom" class="mb-1 block text-xs font-medium text-neutral"
						>Day of month</label
					>
					<select id="exp-dom" bind:value={form.day_of_month} class="input">
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
				<input bind:checked={form.active} type="checkbox" class="h-4 w-4 rounded" />
				Active
			</label>
		</div>
		<button
			type="submit"
			onclick={save}
			class="mt-5 w-full rounded-lg bg-expense py-3 text-sm font-semibold text-white"
		>
			{editing ? 'Save Changes' : 'Create Expense'}
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
		border-color: var(--color-expense);
	}
</style>
