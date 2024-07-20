import { page } from '$app/stores';
import type { Page } from '@sveltejs/kit';
import { derived as derivedStore } from 'svelte/store';
import { ReadableState } from '../helpers/runes.svelte';
import type { RouteId } from './routes';

class PageState implements Page {
	#data = new ReadableState(derivedStore(page, ($page) => $page.data));
	#error = new ReadableState(derivedStore(page, ($page) => $page.error));
	#form = new ReadableState(derivedStore(page, ($page) => $page.form));
	#params = new ReadableState(derivedStore(page, ($page) => $page.params));
	#route = new ReadableState(derivedStore(page, ($page) => $page.route as { id: RouteId }));
	#state = new ReadableState(derivedStore(page, ($page) => $page.state));
	#status = new ReadableState(derivedStore(page, ($page) => $page.status));
	#url = new ReadableState(derivedStore(page, ($page) => $page.url));

	get data() {
		return this.#data.value;
	}
	get error() {
		return this.#error.value;
	}
	get form() {
		return this.#form.value;
	}
	get params() {
		return this.#params.value;
	}
	get route() {
		return this.#route.value;
	}
	get state() {
		return this.#state.value;
	}
	get status() {
		return this.#status.value;
	}
	get url() {
		return this.#url.value;
	}
}

export const pageState = new PageState();
