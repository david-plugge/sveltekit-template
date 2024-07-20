import { env as dynamicEnv } from '$env/dynamic/private';
import * as staticEnv from '$env/static/private';
import { coerceNumber } from '$lib/utils/validation/coerce';
import * as v from 'valibot';

const publicEnvSchema = v.object({
	DB_URL: v.pipe(v.string(), v.url()),
	REDIS_HOST: v.string(),
	REDIS_PORT: coerceNumber()
});

export const privateEnv = v.parse(publicEnvSchema, {
	...staticEnv,
	...dynamicEnv
});
