import * as v from 'valibot';

export function coerceNumber(): v.NumberSchema<undefined> {
	return v.pipe(
		v.unknown(),
		v.transform((v) => {
			const num = Number(v);
			return isNaN(num) ? v : num;
		}),
		v.number()
	) as unknown as v.NumberSchema<undefined>;
}

export function coerceString(): v.StringSchema<undefined> {
	return v.pipe(
		v.unknown(),
		v.transform((v) => {
			switch (typeof v) {
				case 'string':
				case 'number':
				case 'bigint':
				case 'boolean':
					return String(v);
				default:
					return v;
			}
		}),
		v.string()
	) as unknown as v.StringSchema<undefined>;
}

export function coerceBoolean(): v.BooleanSchema<undefined> {
	return v.pipe(
		v.unknown(),
		v.transform((v) => {
			switch (typeof v) {
				case 'string':
					if (['true', 'on', 'yes'].includes(v)) return true;
					if (['false', 'off', 'no', ''].includes(v)) return false;
					return v;
				case 'number':
				case 'bigint':
					return Boolean(v);
				case 'boolean':
					return Boolean(v);
				default:
					return v;
			}
		}),
		v.boolean()
	) as unknown as v.BooleanSchema<undefined>;
}

export function coerceArray<
	const TItem extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>(item: TItem): v.ArraySchema<TItem, undefined> {
	return v.pipe(
		v.unknown(),
		v.transform((v) => {
			return Array.isArray(v) ? v : [v];
		}),
		v.array(item)
	) as unknown as v.ArraySchema<TItem, undefined>;
}
