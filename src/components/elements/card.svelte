<script lang="ts">
	import { cn } from '@components/utils';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'rounded-lg bg-white p-5 shadow dark:border dark:border-neutral-500 dark:bg-neutral-700 dark:text-white',
		className
	)}
>
	<slot />
</div>
