type Getter<T> = () => T;
type Setter<T> = (value: T) => void;

export interface ReadableBox<T> {
	readonly value: T;
}
export interface WritableBox<T> {
	value: T;
}

export function box<T>(getter: Getter<T>): ReadableBox<T>;
export function box<T>(getter: Getter<T>, setter: Setter<T>): WritableBox<T>;
export function box<T>(getter: Getter<T>, setter?: Setter<T>) {
	return new Box(getter, setter);
}

export class Box<T> {
	#getter: Getter<T>;
	#setter?: Setter<T>;

	constructor(getter: Getter<T>, setter?: Setter<T>) {
		this.#getter = getter;
		this.#setter = setter;
	}

	get value() {
		return this.#getter();
	}
	set value(value) {
		if (!this.#setter) {
			throw new Error(`this box is not writable`);
		}
		this.#setter(value);
	}
}
