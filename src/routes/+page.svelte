<script>
	import '../app.css';
	import Chain from '$lib/components/Chain.svelte';
	import { Network } from '$lib/intercom-state';
	import { setContext } from 'svelte';

	Network.clear_counters();

	let intercom_network = new Network();
	setContext('network', intercom_network);

	let chains = intercom_network.chains;

	let c0 = intercom_network.add_chain();

	c0.add_module('PTH');
	c0.add_module('LFO');
	c0.add_module('PRO');

	let c1 = intercom_network.add_chain();
	c1.add_module('PTH');
	let c1m1 = c1.add_module('BCH');

	intercom_network.add_out(
		{
			gate: { pid: 4, channel: 2 }
		},
		{ chain_index: 0, module_index: 1 }
	);

	setTimeout(() => {
		intercom_network.add_out(
			{
				gate: { pid: 7, channel: 3 }
			},
			{ chain_index: 0, module_index: 1 }
		);
	}, 500);

	// setTimeout(() => {
	// 	intercom_network.move_module(0,0,0,1)
	// }, 500);

	// setTimeout(() => {
	// 	intercom_network.move_module(1, 0, 1, 3);
	// 	setTimeout(() => {
	// 		intercom_network.move_module(0, 0, 1, 1);
	// 	}, 200);
	// }, 200);
</script>

<div class="chains" on:dragover={(e) => e.preventDefault()} role="application">
	{#each $chains as chain (chain.id)}
		<Chain {chain}></Chain>
	{/each}
</div>

<style>
	.chains {
		display: flex;
		gap: 4px;
	}
</style>
