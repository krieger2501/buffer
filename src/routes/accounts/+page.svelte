<script lang="ts">
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import AccountRow from '$lib/components/accounts/AccountRow.svelte';
	import BottomSheet from '$lib/components/layout/BottomSheet.svelte';
	import { Plus } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();

	type Account = (typeof data.accounts)[number];

	let showForm = $state(false);
	let editing = $state<Account | null>(null);
	let form = $state({
		name: '',
		type: 'checking',
		balance: '',
		currency: 'EUR',
		color: '',
		include_in_total: true
	});

	const accountTypes = ['checking', 'savings', 'crypto', 'investment', 'cash', 'other'];
	const currencies = ['EUR', 'USD', 'GBP', 'CHF', 'BTC', 'ETH'];
	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

	const totalBalance = $derived(data.accounts.reduce((s: number, a: Account) => s + a.balance, 0));
	const liquidBalance = $derived(
		data.accounts
			.filter((a: Account) => a.include_in_total)
			.reduce((s: number, a: Account) => s + a.balance, 0)
	);

	function openNew() {
		editing = null;
		form = {
			name: '',
			type: 'checking',
			balance: '',
			currency: 'EUR',
			color: '',
			include_in_total: true
		};
		showForm = true;
	}

	function openEdit(account: Account) {
		editing = account;
		form = {
			name: account.name,
			type: account.type,
			balance: String(account.balance),
			currency: account.currency,
			color: account.color ?? '',
			include_in_total: account.include_in_total
		};
		showForm = true;
	}

	async function save() {
		const payload = {
			name: form.name,
			type: form.type,
			balance: parseFloat(form.balance) || 0,
			currency: form.currency,
			color: form.color || null,
			include_in_total: form.include_in_total
		};
		if (editing) {
			await supabase.from('accounts').update(payload).eq('id', editing.id);
		} else {
			await supabase.from('accounts').insert({ ...payload, user_id: data.userId });
		}
		showForm = false;
		await invalidateAll();
	}

	async function remove(id: string) {
		if (!confirm('Delete this account?')) return;
		await supabase.from('accounts').delete().eq('id', id);
		await invalidateAll();
	}
</script>

<div class="pb-6">
	<div class="px-4 pt-4">
		<PageHeader title="Accounts" user={data.user} displayName={data.settings.displayName}>
			{#snippet actions()}
				<button
					type="button"
					onclick={openNew}
					class="flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-primary-500)] px-3 py-1.5 text-xs font-medium text-white"
				>
					<Plus size={14} /> Add
				</button>
			{/snippet}
		</PageHeader>
	</div>

	<div
		class="mx-4 mb-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
	>
		<div class="flex justify-between text-sm">
			<span class="text-[var(--color-neutral)]">Total balance</span>
			<span class="font-semibold tabular-nums">{fmt(totalBalance)}</span>
		</div>
		<div class="mt-1 flex justify-between text-sm">
			<span class="text-[var(--color-neutral)]">Liquid (included)</span>
			<span class="font-semibold text-[var(--color-primary-500)] tabular-nums"
				>{fmt(liquidBalance)}</span
			>
		</div>
	</div>

	<div class="space-y-2 px-4">
		{#each data.accounts as account (account.id)}
			<div class="relative">
				<AccountRow {account} onEdit={openEdit} />
				<button
					type="button"
					onclick={() => remove(account.id)}
					class="absolute top-1/2 right-14 -translate-y-1/2 rounded p-1 text-xs text-[var(--color-neutral)] hover:text-[var(--color-expense)]"
					aria-label="Delete">✕</button
				>
			</div>
		{/each}
		{#if data.accounts.length === 0}
			<div
				class="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-8 text-center"
			>
				<p class="text-sm text-[var(--color-neutral)]">No accounts yet. Tap "Add" to create one.</p>
			</div>
		{/if}
	</div>
</div>

{#if showForm}
	<BottomSheet bind:open={showForm} title={editing ? 'Edit Account' : 'New Account'}>
		<div class="space-y-3">
			<div>
				<label for="acc-name" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
					>Name</label
				>
				<input id="acc-name" bind:value={form.name} class="input" placeholder="e.g. N26 Checking" />
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="acc-type" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
						>Type</label
					>
					<select id="acc-type" bind:value={form.type} class="input">
						{#each accountTypes as t (t)}<option value={t}>{t}</option>{/each}
					</select>
				</div>
				<div>
					<label
						for="acc-currency"
						class="mb-1 block text-xs font-medium text-[var(--color-neutral)]">Currency</label
					>
					<select id="acc-currency" bind:value={form.currency} class="input">
						{#each currencies as c (c)}<option value={c}>{c}</option>{/each}
					</select>
				</div>
			</div>
			<div>
				<label for="acc-balance" class="mb-1 block text-xs font-medium text-[var(--color-neutral)]"
					>Balance</label
				>
				<input
					id="acc-balance"
					bind:value={form.balance}
					type="number"
					step="0.01"
					class="input"
					placeholder="0.00"
				/>
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input bind:checked={form.include_in_total} type="checkbox" class="h-4 w-4 rounded" />
				Include in liquid total
			</label>
		</div>
		<button
			type="submit"
			onclick={save}
			class="mt-5 w-full rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] py-3 text-sm font-semibold text-white"
		>
			{editing ? 'Save Changes' : 'Create Account'}
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
		border-color: var(--color-primary-400);
	}
</style>
