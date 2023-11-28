<script lang="ts">
	import { scale } from 'svelte/transition';
	import Module from './Module.svelte';
	import { flip } from 'svelte/animate';
	import type { Chain, Network } from '$lib/intercom-state';
	import { drag_state } from '$lib/drag-state';
	import { getContext } from 'svelte';

	let intercom_network = getContext('network') as Network;

	export let chain: Chain;
	let modules = chain.modules;
	let m = drag_state.dragged_module;

	function drag_start(e: DragEvent) {
		drag_state.dragged_chain = chain;
	}

	function drag_end(e: DragEvent) {
		drag_state.dragged_chain = null;
		$m = null;
	}

	function drag_over(e: DragEvent & { currentTarget: HTMLElement }) {
		if (!$m) return;
		e.preventDefault();

		let children = [...e.currentTarget.querySelectorAll('.module')] as HTMLElement[];

		let closest = get_closest_element(children, e.clientY);

		if (closest[0]) {
			if ($m == closest[0].__module) return;
		}

		let drag_index = $m?.index;

		let target_index = closest[2];

		if (drag_state.dragged_chain == chain) {
			if (drag_index == target_index - 1) return;
			target_index = drag_index < closest[2] ? closest[2] - 1 : closest[2];
		}

		let res = intercom_network.move_module(
			$m?.index,
			$m?.parent_chain.index,
			chain.index,
			target_index
		);

		if (res) {
			drag_state.dragged_chain = chain;
		}
	}

	function get_closest_element(children: HTMLElement[], y: number) {
		return children.reduce<[HTMLElement | null, number, number]>(
			([closest, closestY, targetIndex], child, index) => {
				const childBox = child.getBoundingClientRect();
				const offsetY = y - childBox.top - childBox.height / 2;

				if (offsetY < 0 && offsetY > closestY) {
					return [child, offsetY, index];
				}
				return [closest, closestY, targetIndex];
			},
			[null, Number.NEGATIVE_INFINITY, children.length]
		);
	}
</script>

<div class="chain stack border">
	<header></header>
	<div
		role="application"
		class="modules stack"
		on:dragstart={drag_start}
		on:dragover={drag_over}
		on:dragend={drag_end}
		on:drop={drag_end}
	>
		{#each $modules as module (module.id)}
			<div
				animate:flip={{ duration: 100 }}
				in:scale={{ duration: 100 }}
				out:scale={{ duration: 100 }}
			>
				<Module {module}></Module>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.chain {
		padding: var(--gap-2);
		gap: var(--gap-2);
		box-shadow: var(--shadow-0);
		background-color: var(--color-white);
	}

	header {
		--direction: row;

		align-self: normal;

		padding-block: var(--gap-2);
		border-radius: 1px;

		background-color: var(--color-gray-light);

		justify-content: center;

		font-size: var(--text-size-1);

		// .input {
		// 	--gap: var(--gap-2);
		// 	--direction: row;

		// 	> .stack {
		// 		--direction: row;
		// 	}
		// }
	}

	.modules {
		flex-grow: 1;
		--gap: var(--gap-2);
	}
</style>
