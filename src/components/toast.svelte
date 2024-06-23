<script lang="ts">
	import ExclamationIcon from './icons/exclamation-icon.svelte';
	import CheckIcon from './icons/check-icon.svelte';
	import { useToast } from '$lib/use-toast';

	const { message, isError } = useToast();
</script>

{#if $message}
	<div class="fixed bottom-5 flex w-full items-center justify-center p-4">
		<div
			class="max-w-xs rounded-md border bg-white shadow-lg dark:border-neutral-500 dark:bg-neutral-700"
		>
			<div class="flex p-4">
				{#if $isError}
					<ExclamationIcon class="h-6 w-6 text-red-700 mt-{0.5}" />
				{:else}
					<CheckIcon class="h-6 w-6 text-sky-600 mt-{0.5}" />
				{/if}
				<div class="ml-3">
					<p class="text-lg text-gray-700 dark:text-white m-0">
						{$message}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
