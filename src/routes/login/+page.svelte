<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import logo from '$lib/assets/logo.webp';

	let { data } = $props();

	async function signInWith(provider: 'google' | 'apple') {
		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-6">
	<div class="w-full max-w-sm">
		<!-- Logo / wordmark -->
		<div class="mb-10 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/30"
			>
				<img src={logo} alt="Buffer" class="h-9 w-9 object-contain" />
			</div>
			<h1 class="text-2xl font-bold tracking-tight">Buffer</h1>
			<p class="mt-1 text-sm text-neutral">Your personal money overview</p>
		</div>

		<!-- Error hint -->
		{#if data.error}
			<div class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
				Sign-in failed or your account is not on the allowlist.
			</div>
		{/if}

		<!-- Auth buttons -->
		<div class="space-y-3">
			<button
				type="button"
				onclick={() => signInWith('google')}
				class="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-surface
				       py-3.5 text-sm font-semibold shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]"
			>
				<!-- Google colour logo -->
				<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
					<path
						d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
						fill="#4285F4"
					/>
					<path
						d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
						fill="#34A853"
					/>
					<path
						d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
						fill="#FBBC05"
					/>
					<path
						d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
						fill="#EA4335"
					/>
				</svg>
				Continue with Google
			</button>

			<button
				type="button"
				onclick={() => signInWith('apple')}
				class="flex w-full items-center justify-center gap-3 rounded-2xl bg-black
				       py-3.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]"
			>
				<!-- Apple logo -->
				<svg width="16" height="18" viewBox="0 0 814 1000" aria-hidden="true" fill="white">
					<path
						d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 434.9 0 331.4 0 232.6c0-173.9 113.9-266.6 225.4-266.6 59.5 0 109 38.8 145.5 38.8 35 0 89.8-41.2 160.7-41.2 28.2 0 130.7 2.6 198.5 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
					/>
				</svg>
				Continue with Apple
			</button>
		</div>

		<p class="mt-8 text-center text-xs text-neutral">
			Access is restricted to invited accounts only.
		</p>
	</div>
</div>
