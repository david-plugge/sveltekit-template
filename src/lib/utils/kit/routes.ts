import { resolveRoute } from '$app/paths';
import type RouteMetadata from '$lib/../../.svelte-kit/types/route_meta_data.json';
import { pageState } from './page.svelte';

type RouteMetadata = typeof RouteMetadata;

type Prettify<T> = { [K in keyof T]: T[K] } & {};
type ParseParam<T extends string> = T extends `...${infer Name}` ? Name : T;

type ParseParams<T extends string> = T extends `${infer A}[[${infer Param}]]${infer B}`
	? ParseParams<A> & { [K in ParseParam<Param>]?: string } & ParseParams<B>
	: T extends `${infer A}[${infer Param}]${infer B}`
		? ParseParams<A> & { [K in ParseParam<Param>]: string } & ParseParams<B>
		: // eslint-disable-next-line @typescript-eslint/no-empty-object-type
			{};

type RequiredKeys<T extends object> = keyof {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	[P in keyof T as {} extends Pick<T, P> ? never : P]: 1;
};

export type RouteId = keyof RouteMetadata;

export type Routes = {
	[K in RouteId]: Prettify<ParseParams<K>>;
};

type OptionalOptions<T extends RouteId> = {
	query?: string | Record<string, string> | URLSearchParams | string[][];
	hash?: string;
	params?: Routes[T];
};
type RequiredOptions<T extends RouteId> = {
	query?: string | Record<string, string> | URLSearchParams | string[][];
	hash?: string;
	params: Routes[T];
};

type RouteArgs<
	T extends RouteId,
	AdditionalOptions extends Record<string, unknown> = Record<string, never>
> =
	RequiredKeys<Routes[T] & AdditionalOptions> extends never
		? [options?: OptionalOptions<T>]
		: [options: RequiredOptions<T>];

export function route<T extends RouteId>(routeId: T, ...[options]: RouteArgs<T>) {
	const path = resolveRoute(routeId, options?.params ?? {});
	const search = options?.query && new URLSearchParams(options.query).toString();
	return path + (search ? `?${search}` : '') + (options?.hash ? `#${options.hash}` : '');
}

export function isActiveRouteId(routeId: RouteId, nested = false) {
	// ignore groups
	const current = pageState.route.id?.replace(/\/\(.+\)/, '') || '/';

	if (nested) {
		return current?.startsWith(routeId) === true;
	}
	return current === routeId;
}

export function createLink<T extends RouteId>(routeId: T, ...[options]: RouteArgs<T>) {
	return {
		get href() {
			return route(routeId, options);
		},
		get 'aria-current'() {
			return isActiveRouteId(routeId) ? 'page' : undefined;
		}
	} as const;
}
