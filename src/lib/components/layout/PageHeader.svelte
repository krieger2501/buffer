<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		actions
	}: { title: string; subtitle?: string; actions?: Snippet } = $props();
</script>

<header class="mb-4 flex items-end justify-between">
	<div>
		{#if subtitle}
			<p class="text-xs font-medium tracking-widest text-[var(--color-neutral)] uppercase">
				{subtitle}
			</p>
		{/if}
		<h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
	</div>
	{#if actions}
		<div>{@render actions()}</div>
	{/if}
</header>
