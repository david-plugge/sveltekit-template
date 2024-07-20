import { privateEnv } from '$lib/env/env.private';
import { Redis, type RedisKey } from 'ioredis';

export class CustomRedis extends Redis {
	async getJson<T>(key: RedisKey): Promise<T | null> {
		const value = await this.get(key);
		if (value) {
			try {
				return JSON.parse(value);
			} catch {
				return null;
			}
		}
		return null;
	}

	async setJson<T>(key: RedisKey, value: T) {
		await this.set(key, JSON.stringify(value));
	}
}

export type Cache = typeof cache;

export const cache = new CustomRedis({
	host: privateEnv.REDIS_HOST,
	port: privateEnv.REDIS_PORT
});
