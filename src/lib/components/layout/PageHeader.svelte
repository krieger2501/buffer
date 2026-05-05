<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		actions
	}: { title: string; subtitle?: string; actions?: Snippet } = $props();
</script>

<header class="mb-5 flex items-end justify-between">
	<div>
		{#if subtitle}
			<p class="mb-0.5 text-[11px] font-semibold tracking-widest text-neutral uppercase">
				{subtitle}
			</p>
		{/if}
		<h1 class="text-2xl font-bold tracking-tight">{title}</h1>
	</div>
	{#if actions}
		<div class="pr-12">{@render actions()}</div>
	{/if}
</header>
