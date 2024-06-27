import * as v from 'valibot';

export type Unwrap<Schema extends v.GenericSchema> = Schema extends {
	wrapped: infer Inner extends v.GenericSchema;
}
	? Unwrap<Inner>
	: Schema;

export function unwrap<Schema extends v.GenericSchema>(schema: Schema): Unwrap<Schema> {
	let current: v.GenericSchema = schema;

	while ('wrapped' in current) {
		current = current.wrapped as v.GenericSchema;
	}

	return current as Unwrap<Schema>;
}

export function analyze(schema: v.GenericSchema) {
	let current = schema;
	let optional: null | boolean = null;
	let nullable: null | boolean = null;

	while ('wrapped' in current) {
		switch (current.type) {
			case 'optional':
				optional ??= true;
				break;
			case 'non_optional':
				optional ??= false;
				break;
			case 'nullable':
				nullable ??= true;
				break;
			case 'non_nullable':
				nullable ??= false;
				break;
			case 'nullish':
				optional ??= true;
				nullable ??= true;
				break;
			case 'non_nullish':
				optional ??= false;
				nullable ??= false;
				break;
		}

		current = current.wrapped as v.GenericSchema;
	}

	return {
		optional: optional ?? false,
		nullable,
		schema: current
	};
}
