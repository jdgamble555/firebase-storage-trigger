<script lang="ts">
	import { useUploadImage } from '$lib/use-upload-image';
	import Card from '@components/elements/card.svelte';

	const { status, files } = useUploadImage();
</script>

<div class="my-5 flex items-center justify-center">
	<div class="w-3/4 max-w-3xl">
		<Card class="flex flex-col gap-5">
			<h1 class="text-3xl font-bold">Upload Image</h1>
			<input type="file" bind:files={$files} accept="image/*" />
			{#if $status.progress}
				<p>Percent: {$status.progress.toString()}</p>
			{/if}
			{#if $status.error}
				<p class="text-red-600">
					<span class="font-bold">Error: </span>
					{$status.error}
				</p>
			{/if}
		</Card>
	</div>
</div>
