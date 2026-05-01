<script lang="ts">
	import type { UpcomingEvent } from '$lib/types';
	import { ArrowDownLeft, ArrowUpRight, Users } from 'lucide-svelte';

	let { events }: { events: UpcomingEvent[] } = $props();

	const fmt = (n: number) =>
		new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

	const fmtDate = (d: string) =>
		new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

	const typeConfig = {
		income: { icon: ArrowDownLeft, color: 'var(--color-income)', sign: '+' },
		expense: { icon: ArrowUpRight, color: 'var(--color-expense)', sign: '-' },
		debt: { icon: Users, color: 'var(--color-debt)', sign: '' }
	};
</script>

{#if events.length > 0}
	<div
		class="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]"
	>
		<p
			class="px-4 pt-3 pb-1 text-xs font-semibold tracking-widest text-[var(--color-neutral)] uppercase"
		>
			Upcoming
		</p>
		<ul>
			{#each events as event, i (event.date + event.label)}
				{@const cfg = typeConfig[event.type]}
				<li
					class="flex items-center gap-3 px-4 py-3
                         {i < events.length - 1 ? 'border-b border-[var(--color-border)]' : ''}"
				>
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
						style="background-color: {cfg.color}18; color: {cfg.color};"
					>
						<cfg.icon size={14} stroke-width={2} />
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium">{event.label}</p>
						<p class="text-xs text-[var(--color-neutral)]">{fmtDate(event.date)}</p>
					</div>
					<p class="text-sm font-semibold tabular-nums" style="color: {cfg.color};">
						{cfg.sign}{fmt(event.amount)}
					</p>
				</li>
			{/each}
		</ul>
	</div>
{/if}
