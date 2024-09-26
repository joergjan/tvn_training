import { writable, derived } from "svelte/store";

export let currentPage = writable(0);

export let darkMode = writable();
