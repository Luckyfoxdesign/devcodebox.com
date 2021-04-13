<script>
	import Nav from "../components/Nav.svelte"

	export let segment
</script>

<div class="container">
	<!-- {#if segment != "article"}
		<Nav segment={segment} />
	{/if} -->
	<Nav segment={segment} />

	<main
		style="background-color: white; box-sizing: border-box; margin-left: auto; margin-right: auto; max-width: 732px;"
	>
		<slot />
	</main>
</div>

<style>
	/* main {
		height: 100%;
	} */
</style>
