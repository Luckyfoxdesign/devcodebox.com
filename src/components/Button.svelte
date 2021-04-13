<script>
	export let text, bgd, c, bgh
</script>

<button class="button">{text}</button>

<style>
	.button {
		border-radius: 4px;
		border: none;
		height: 32px;
		background-color: var(bgd);
		cursor: pointer;
		color: var(c);
	}
	.button:hover {
		background-color: var(bgh);
	}
</style>
