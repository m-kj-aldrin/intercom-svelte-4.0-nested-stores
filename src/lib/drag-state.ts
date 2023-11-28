import { writable, type Writable } from 'svelte/store';
import type { Chain, Module } from './intercom-state';

type DragState = {
	dragged_module: Writable<Module | null>;
	dragged_chain: Chain | null;
};

let drag_state: DragState = {
	dragged_module: writable<Module>(),
	dragged_chain: null
};

export { drag_state };
