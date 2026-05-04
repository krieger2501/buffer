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

<div
	class="relative overflow-hidden rounded-3xl bg-primary-500 p-6 shadow-xl shadow-primary-500/20"
>
	<!-- Decorative circles -->
	<div class="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5"></div>
	<div
		class="pointer-events-none absolute -bottom-6 -left-4 h-28 w-28 rounded-full bg-white/5"
	></div>

	<p class="text-[11px] font-semibold tracking-widest text-white/60 uppercase">Liquid Assets</p>
	<p class="mt-1 text-[2.75rem] leading-none font-semibold tracking-tight text-white">
		{fmt(totalLiquid)}
	</p>

	<div class="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-5">
		<div>
			<p class="text-[10px] font-medium tracking-wider text-white/50 uppercase">Monthly In</p>
			<p class="mt-1 text-base font-semibold text-white">{fmt(monthlyIncome)}</p>
		</div>
		<div>
			<p class="text-[10px] font-medium tracking-wider text-white/50 uppercase">Monthly Out</p>
			<p class="mt-1 text-base font-semibold text-white">{fmt(monthlyExpenses)}</p>
		</div>
		<div>
			<p class="text-[10px] font-medium tracking-wider text-white/50 uppercase">Net</p>
			<p
				class="mt-1 text-base font-semibold {netCashflow >= 0
					? 'text-emerald-300'
					: 'text-red-300'}"
			>
				{fmt(netCashflow)}
			</p>
		</div>
	</div>
</div>
