<script lang="ts">
	import '../app.css';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	const isLoginPage = $derived($page.url.pathname === '/login');
</script>

<main class="mx-auto min-h-screen max-w-md">
	{@render children()}
</main>

{#if !isLoginPage}
	<BottomNav />
{/if}
