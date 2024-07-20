import { tick, untrack } from 'svelte';
import { SvelteURL } from 'svelte/reactivity';
import { get, type Readable, type Writable } from 'svelte/store';

export function readable<T>(start: (set: (value: T) => void) => () => void) {
	let value = $state() as T;

	let subscribers = 0;
	let stop: null | (() => void) = null;

	return {
		get value() {
			if ($effect.tracking()) {
				$effect.pre(() => {
					if (subscribers++ === 0) {
						stop = start((v) => (value = v));
					}

					return () => {
						tick().then(() => {
							if (--subscribers === 0) {
								stop?.();
							}
						});
					};
				});
			} else {
				start((v) => (value = v))();
			}

			return value;
		}
	};
}

export class ReadableState<T> {
	#store: Readable<T>;
	#subscriber = 0;
	#stop: null | (() => void) = null;
	#value = $state() as T;

	constructor(store: Readable<T>) {
		this.#store = store;
	}

	get value() {
		if ($effect.tracking()) {
			$effect.pre(() => {
				untrack(() => {
					if (this.#subscriber++ === 0) {
						this.#stop = this.#store.subscribe((value) => {
							if (value instanceof URL) {
								if (this.#value instanceof SvelteURL) {
									this.#value.href = value.href;
								} else {
									this.#value = new SvelteURL(value) as T;
								}
							} else {
								this.#value = value;
							}
						});
					}
				});

				return () => {
					if (--this.#subscriber === 0) {
						this.#stop?.();
						this.#stop = null;
					}
				};
			});
		} else {
			this.#value = get(this.#store);
		}

		return this.#value;
	}
}

export class WritableState<T> extends ReadableState<T> {
	#store: Writable<T>;

	constructor(store: Writable<T>) {
		super(store);
		this.#store = store;
	}

	set value(value: T) {
		this.#store.set(value);
	}
}
