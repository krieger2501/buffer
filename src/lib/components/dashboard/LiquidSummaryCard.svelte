<script lang="ts">
	let {
		accounts,
		monthlyExpenses,
		monthlyIncome
	}: {
		accounts: { balance: number; include_in_total: boolean }[];
		monthlyExpenses: number;
		monthlyIncome: number;
	} = $props();

	const totalLiquid = $derived(
		accounts.filter((a) => a.include_in_total).reduce((sum, a) => sum + a.balance, 0)
	);

	const netCashflow = $derived(monthlyIncome - monthlyExpenses);
	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
</script>

<div class="rounded-[var(--radius-xl)] bg-[var(--color-primary-500)] p-5 text-white shadow-lg">
	<p class="text-xs font-medium tracking-widest uppercase opacity-70">Liquid Assets</p>
	<p class="mt-1 text-4xl font-semibold tracking-tight">{fmt(totalLiquid)}</p>

	<div class="mt-5 flex gap-4 border-t border-white/20 pt-4">
		<div class="flex-1">
			<p class="text-[10px] tracking-wider uppercase opacity-70">Monthly In</p>
			<p class="mt-0.5 text-lg font-medium">{fmt(monthlyIncome)}</p>
		</div>
		<div class="flex-1">
			<p class="text-[10px] tracking-wider uppercase opacity-70">Monthly Out</p>
			<p class="mt-0.5 text-lg font-medium">{fmt(monthlyExpenses)}</p>
		</div>
		<div class="flex-1">
			<p class="text-[10px] tracking-wider uppercase opacity-70">Net</p>
			<p
				class="mt-0.5 text-lg font-medium {netCashflow >= 0 ? 'text-emerald-200' : 'text-red-300'}"
			>
				{fmt(netCashflow)}
			</p>
		</div>
	</div>
</div>
