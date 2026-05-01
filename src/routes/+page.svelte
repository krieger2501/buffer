<script lang="ts">
	import LiquidSummaryCard from '$lib/components/dashboard/LiquidSummaryCard.svelte';
	import AccountCard from '$lib/components/dashboard/AccountCard.svelte';
	import UpcomingEvents from '$lib/components/dashboard/UpcomingEvents.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';

	let { data } = $props();
</script>

<div class="space-y-4 px-4 pt-4 pb-6">
	<PageHeader title="Overview" subtitle="Serene Finance" />

	<LiquidSummaryCard
		accounts={data.accounts}
		monthlyExpenses={data.monthlyExpenses}
		monthlyIncome={data.monthlyIncome}
	/>

	{#if data.accounts.length > 0}
		<section>
			<p class="mb-2 text-xs font-semibold tracking-widest text-[var(--color-neutral)] uppercase">
				Accounts
			</p>
			<div class="space-y-2">
				{#each data.accounts as account (account.id)}
					<AccountCard {account} />
				{/each}
			</div>
		</section>
	{/if}

	<UpcomingEvents events={data.upcoming} />

	{#if data.accounts.length === 0}
		<div
			class="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-8 text-center"
		>
			<p class="text-sm font-medium text-[var(--color-neutral)]">No accounts yet</p>
			<p class="mt-1 text-xs text-[var(--color-neutral)]">
				<a
					href="/accounts"
					class="text-[var(--color-primary-500)] underline-offset-2 hover:underline"
				>
					Add your first account
				</a>
				to get started.
			</p>
		</div>
	{/if}
</div>
