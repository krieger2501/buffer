<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import AccountMenu from '$lib/components/layout/AccountMenu.svelte';

	let { children, data } = $props();

	const isLoginPage = $derived(page.url.pathname === '/login');
</script>

<main class="mx-auto min-h-screen max-w-md">
	{@render children()}
</main>

{#if !isLoginPage}
	<BottomNav />
	{#if data.user}
		<div class="fixed top-4 right-4 z-40">
			<AccountMenu user={data.user} />
		</div>
	{/if}
{/if}
