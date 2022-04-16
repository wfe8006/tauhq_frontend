import { writable, derived } from 'svelte/store';

let mode = writable("default")

export { mode }