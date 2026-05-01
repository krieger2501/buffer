<script lang="ts">
	import '../app.css';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';

	let { children } = $props();
</script>

<main class="mx-auto min-h-screen max-w-md">
	{@render children()}
</main>

<BottomNav />
