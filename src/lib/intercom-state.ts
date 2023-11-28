import { get, writable } from 'svelte/store';

export class Network {
	chains = writable<Chain[]>([]);
	outs = writable<Out[]>([]);

	constructor() {
		this.chains.subscribe((chains) => {
			chains.forEach((chain, index) => (chain.index = index));
		});

		this.outs.subscribe((outs) => console.log(outs));
	}

	static clear_counters() {
		Chain.id_counter = 0;
		Module.id_counter = 0;
		Out.id_counter = 0;
	}

	add_chain() {
		let new_chain = new Chain();

		this.chains.update((chains) => [...chains, new_chain]);
		return new_chain;
	}

	move_module(
		moved_index: number,
		moved_chain_index: number,
		to_chain_index: number,
		to_index: number
	) {
		let chains = get(this.chains);

		let moved_module: Module;

		let new_chain = false;

		chains[moved_chain_index].modules.update((modules) => {
			moved_module = modules.splice(moved_index, 1)[0];

			if (moved_chain_index == to_chain_index) {
				modules.splice(to_index, 0, moved_module);
			}

			return modules;
		});

		if (moved_chain_index != to_chain_index) {
			chains[to_chain_index].modules.update((modules) => {
				modules.splice(to_index, 0, moved_module);
				moved_module.parent_chain = chains[to_chain_index];

				new_chain = true;

				return modules;
			});
		}

		return new_chain;
	}

	add_out(destination: Omit<OutDestination, 'cv'>, target: OutTarget) {
		let chains = get(this.chains);
		let target_chain = chains[target.chain_index];
		let target_module = get(target_chain.modules)[target.module_index];

		if (!target_chain || !target_module) return;

		let new_out = new Out(destination, target_module);
		// new_out.index = this._outs.length;
		// new_out.target_module = target_module;

		// this._outs = [...this._outs, new_out];
		this.outs.update((outs) => [...outs, new_out]);

		// console.log(
		//     `o -a ${target.chain_index}:${target.module_index}:${destination.gate.pid}:${destination.gate.channel}:${destination.gate.pid}:${destination.gate.channel}`
		// );

		return new_out;
	}
}

export class Chain {
	static id_counter = 0;
	readonly id = Chain.id_counter++;
	index = -1;
	readonly modules = writable<Module[]>([]);

	constructor() {
		this.modules.subscribe((modules) => {
			modules.forEach((module, index) => (module.index = index));
		});
	}

	add_module(type: ModuleTypes) {
		let new_module = new Module(type, this);

		this.modules.update((modules) => [...modules, new_module]);
		return new_module;
	}

	remove_module(id: number) {
		this.modules.update((modules) => {
			let module_index = modules.findIndex((module) => id == module.id);
			let module = modules.splice(module_index, 1)[0];

			return modules;
		});
	}
}

export const ModuleMap = {
	PTH: [],
	LFO: [],
	PRO: [],
	BCH: []
};

export type ModuleTypes = keyof typeof ModuleMap;

export class Module {
	static id_counter = 0;
	readonly id = Module.id_counter++;
	index = -1;

	parent_chain: Chain;

	type: ModuleTypes;
	meta = writable({
		min: false,
		dot_menu_open: false,
		show_outs_list: false
	});

	constructor(type: ModuleTypes, parent_chain: Chain) {
		this.type = type;
		this.parent_chain = parent_chain;
	}

	remove() {
		this.parent_chain.remove_module(this.id);
	}
}

type OutTarget = {
	chain_index: number;
	module_index: number;
};

type Periphial = {
	pid: number | null;
	channel: number | null;
};

type OutDestination = {
	gate: Periphial;
	cv: Periphial;
};

class Out {
	static id_counter = 0;
	readonly id = Out.id_counter++;
	target_id = -1;
	target_module: Module;
	destination: OutDestination;

	constructor(destination: Omit<OutDestination, 'cv'>, target_module: Module) {
		this.destination = { cv: { pid: null, channel: null }, ...destination };
		this.target_module = target_module;
	}
}
