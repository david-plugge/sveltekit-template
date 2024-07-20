<script lang="ts">
	import '../app.css';

	import { createLink } from '$lib/utils';

	let { children } = $props();
</script>

<nav class="flex gap-2 p-4">
	<a {...createLink('/')} class="current-page:text-indigo-600">Home</a>
	<a {...createLink('/about')} class="current-page:text-indigo-600">About</a>
</nav>

{@render children()}
