import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
		plugin(({ addVariant }) => {
			addVariant('current-page', '&[aria-current="page"]');
		})
	]
} as Config;
