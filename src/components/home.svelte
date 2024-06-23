<script lang="ts">
	import Profile from '@components/profile.svelte';
	import LoginWithGoogle from '@components/login-with-google.svelte';
	import Logout from './logout.svelte';
	import { useUser } from '$lib/use-user';

	const user = useUser();
</script>

<section class="flex flex-col gap-3 p-5 items-center">
	{#if $user}
		<Profile />
		<Logout />
	{:else}
		<LoginWithGoogle />
	{/if}
</section>
