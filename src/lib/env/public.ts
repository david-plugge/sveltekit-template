import * as v from 'valibot';
import { env as dynamicEnv } from '$env/dynamic/public';
import * as staticEnv from '$env/static/public';

const publicEnvSchema = v.object({});

export const publicEnv = v.parse(publicEnvSchema, {
	...staticEnv,
	...dynamicEnv
});
