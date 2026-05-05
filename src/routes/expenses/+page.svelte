<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ExpenseRow from '$lib/components/expenses/ExpenseRow.svelte';
	import BottomSheet from '$lib/components/layout/BottomSheet.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import { Plus } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();
	type Expense = (typeof data.expenses)[number] & { starting_month?: string | null };

	let showForm = $state(false);
	let editing = $state<Expense | null>(null);
	let confirmDelete = $state(false);
	let form = $state({
		name: '',
		category: 'other',
		amount: '',
		recurrence: 'monthly',
		day_of_month: '',
		due_date: '',
		starting_month: '',
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
	const recurrences = [
		'once',
		'weekly',
		'biweekly',
		'monthly',
		'quarterly',
		'half-yearly',
		'yearly'
	];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const fmt = (n: number) =>
		new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n);

	const needsMonth = $derived(['quarterly', 'half-yearly', 'yearly'].includes(form.recurrence));
	const isOnce = $derived(form.recurrence === 'once');

	const monthlyTotal = $derived(
		data.expenses
			.filter((e: Expense) => e.active && e.recurrence === 'monthly')
			.reduce((s: number, e: Expense) => s + e.amount, 0)
	);

	function openNew() {
		editing = null;
		confirmDelete = false;
		form = {
			name: '',
			category: 'other',
			amount: '',
			recurrence: 'monthly',
			day_of_month: '',
			due_date: '',
			starting_month: '',
			active: true
		};
		showForm = true;
	}

	function openEdit(expense: Expense) {
		editing = expense;
		confirmDelete = false;
		form = {
			name: expense.name,
			category: expense.category,
			amount: String(expense.amount),
			recurrence: expense.recurrence,
			day_of_month: expense.day_of_month ?? '',
			due_date: expense.due_date ?? '',
			starting_month: expense.starting_month ?? '',
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
			day_of_month: !isOnce ? form.day_of_month || null : null,
			due_date: isOnce ? form.due_date || null : null,
			starting_month: needsMonth ? form.starting_month || null : null,
			active: isOnce ? false : form.active
		};
		if (editing) {
			await supabase.from('expenses').update(payload).eq('id', editing.id);
		} else {
			await supabase.from('expenses').insert({ ...payload, user_id: data.userId });
		}
		showForm = false;
		await invalidateAll();
	}

	async function remove() {
		await supabase.from('expenses').delete().eq('id', editing!.id);
		showForm = false;
		await invalidateAll();
	}
</script>

<div class="pb-6">
	<div class="px-4 pt-4">
		<PageHeader title="Expenses" user={data.user} displayName={data.settings.displayName}>
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
			<ExpenseRow {expense} onEdit={openEdit} />
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
		{#if confirmDelete}
			<div class="space-y-4 py-2">
				<div class="rounded-xl bg-surface-muted px-4 py-4 text-center">
					<p class="text-sm font-medium">Delete "{editing?.name}"?</p>
					<p class="mt-1 text-xs text-neutral">This can't be undone.</p>
				</div>
				<button
					type="button"
					onclick={remove}
					class="w-full rounded-lg bg-expense py-3 text-sm font-semibold text-white"
				>
					Yes, delete
				</button>
				<button
					type="button"
					onclick={() => (confirmDelete = false)}
					class="w-full rounded-lg py-3 text-sm font-semibold text-neutral"
				>
					Cancel
				</button>
			</div>
		{:else}
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
				{#if isOnce}
					<div>
						<label for="exp-due" class="mb-1 block text-xs font-medium text-neutral"
							>Due date (optional)</label
						>
						<input id="exp-due" bind:value={form.due_date} type="date" class="input" />
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-3">
						<div>
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
						</div>
						{#if needsMonth}
							<div>
								<label for="exp-month" class="mb-1 block text-xs font-medium text-neutral"
									>Starting month</label
								>
								<select id="exp-month" bind:value={form.starting_month} class="input">
									<option value="">— select —</option>
									{#each months as m, i (m)}
										<option value={String(i + 1)}>{m}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>
					<Toggle
						bind:checked={form.active}
						label="Active"
						id="exp-active"
						color="var(--color-expense)"
					/>
				{/if}
			</div>
			<button
				type="submit"
				onclick={save}
				class="mt-5 w-full rounded-lg bg-expense py-3 text-sm font-semibold text-white"
			>
				{editing ? 'Save Changes' : 'Create Expense'}
			</button>
			{#if editing}
				<button
					type="button"
					onclick={() => (confirmDelete = true)}
					class="mt-2 w-full rounded-lg py-3 text-sm font-semibold text-expense"
				>
					Delete Expense
				</button>
			{/if}
		{/if}
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
