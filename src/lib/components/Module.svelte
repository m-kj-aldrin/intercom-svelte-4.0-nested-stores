<script lang="ts">
	import { drag_state } from '$lib/drag-state';
	import type { Network, Module } from '$lib/intercom-state';
	import { getContext, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/Icon.svelte';

	let intercom_network = getContext('network') as Network;

	export let module: Module;

	let m = drag_state.dragged_module;

	let meta = module.meta;

	function toggle_min() {
		$meta.min = !$meta.min;
	}

	function drag_start(e: DragEvent) {
		$m = module;
	}

	let module_el: HTMLElement;
	onMount(() => {
		module_el.__module = module;
	});

	let outs = intercom_network.outs;
	$: filtered_outs = $outs.filter((out) => out.target_module == module);

	function toggle_minimize_module() {
		$meta.min = !$meta.min;
	}
</script>

<div
	class="module stack border"
	data-id={module.id}
	bind:this={module_el}
	class:dragged={module == $m}
>
	<header class="stack" draggable="true" on:dragstart={drag_start} role="application">
		<div>{module.type}</div>
		<div class="outs">
			<button class="symbol" on:click={() => ($meta.show_outs_list = !$meta.show_outs_list)}>
				<Icon type="out"></Icon>
				<div class="count">{filtered_outs.length}</div>
			</button>

			{#if $meta.show_outs_list}
				<div class="outs-list stack border padding">
					<div class="outs-controlls stack">
						<div class="new-out stack">
							<label>
								pid:<input type="text" maxlength="2" />
							</label>

							<label>
								ch:<input type="text" maxlength="2" />
							</label>
						</div>

						<button class="add-out">
							<Icon type="plus"></Icon>
						</button>
					</div>

					{#if filtered_outs.length}
						<hr />

						<div class="stack">
							<!-- {#each outs as out (out.id)}
								<Out {out}></Out>
							{/each} -->
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<div class="module-controlls stack">
			<button class="minimize-module" on:click={() => toggle_minimize_module()} />
		</div>

		<div class="dot-menu">
			<button class="dots">
				{#each { length: 3 } as i}
					<div class="dot"></div>
				{/each}
			</button>
			{#if $meta.dot_menu_open}
				<div class="stack border options">
					<button class="remove-module">remove</button>
				</div>
			{/if}
		</div>
	</header>
	{#if !$meta.min}
		<div class="inner" transition:slide={{ duration: 200 }}>inner</div>
	{/if}
</div>

<style lang="scss">
	.padding {
		padding: var(--gap-1);
	}

	.module {
		--gap: 0;
		background-color: var(--bg-color);
		box-shadow: var(--shadow-0);
		width: var(--module-width);
		font-size: var(--text-size-1);

		header {
			padding: var(--gap-1);

			cursor: move;
			--gap: var(--gap-2);
			--direction: row;
			align-self: normal;

			background-color: var(--color-gray-light);
			padding-inline: var(--gap-2);

			.controlls {
				margin-inline-start: auto;
			}

			&:hover {
				background-color: var(--color-gray-lightest);
			}
		}
	}

	.outs {
		margin-inline-start: auto;

		.symbol {
			border: none;
			background-color: transparent;
			padding: 0;
			display: flex;
			cursor: pointer;

			> .count {
				transform: translateY(0.75ex);
				font-size: var(--text-size-0);
			}
		}

		.outs-controlls {
			--direction: row;
			padding: var(--gap-1);
			align-self: normal;
			justify-content: space-between;

			.new-out {
				--direction: row;
			}

			.add-out {
				display: grid;
				padding: var(--gap-0);
				color: var(--color-ok);
			}
		}

		input {
			max-width: 3ch;
			text-align: center;
		}
	}

	.outs-list {
		background-color: var(--color-white);
		position: absolute;
		z-index: 10;
		box-shadow: var(--shadow-0);
	}

	.dot-menu {
		.dots {
			display: flex;
			flex-direction: column;
			gap: 2px;

			border: none;
			background-color: transparent;

			cursor: pointer;
			padding: 2px;
		}

		.dot {
			width: 0.5ch;
			height: 0.5ch;
			background-color: currentColor;
			border-radius: 50%;
		}

		.options {
			position: absolute;
			padding: var(--gap-1);
			background-color: var(--color-white);

			.remove-module {
				color: var(--color-error);
			}
		}
	}

	.module-controlls {
		--direction: row;
		align-items: center;

		button {
			width: 1.25ch;
			height: 1.25ch;
			border-radius: 50%;
			border: none;
			background-color: currentColor;
			padding: 0;

			&.minimize-module {
				background-color: var(--color-info);
			}
		}
	}

	.module.minimized {
		button.minimize-module {
			background-color: var(--color-ok);
		}
	}

	.operator {
		background-color: white;
		padding: var(--gap-2);
		align-self: normal;
	}

	/* DRAGGED */
	.dragged {
		border-color: var(--color-info);

		header {
			background-color: var(--color-info-light) !important;
		}
	}
</style>
