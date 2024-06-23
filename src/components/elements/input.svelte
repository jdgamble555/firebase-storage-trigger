<script lang="ts">
	import { cn } from '@components/utils';
	export let type: 'text' | 'email' | 'password' | 'number' | 'datetime-local' | 'datetime' =
		'text';
	export let name: string;
	export let input: HTMLInputElement | null = null;
	export let value: FormDataEntryValue = '';
	let className: string | undefined | null = undefined;
	export { className as class };
	export let inputClass /*tw*/ =
		' block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400';

	// https://stackoverflow.com/a/57393751/271450
	const onInput = (e: Event) => {
		const _value = (e.target as HTMLFormElement).value;
		value = type.match(/^(number|range)$/) ? +_value : _value;
	};
</script>

<input
	bind:this={input}
	on:input={onInput}
	on:input
	on:keydown
	{name}
	id={$$restProps.id || name}
	class={cn(inputClass, className)}
	{value}
	{type}
	{...$$restProps}
/>
