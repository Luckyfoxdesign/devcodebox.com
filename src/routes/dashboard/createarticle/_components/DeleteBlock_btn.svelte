<script>
	import { icClose } from "../../../../components/Icons"
	import { articleBlocksArray } from "../../.../../../../../store.js"
	export let fakeArr
</script>

<button
	class="block-delete button"
	on:mouseenter={(e) => {
		e.currentTarget.parentElement.style.backgroundColor = "#ffd5d5"
	}}
	on:mouseleave={(e) => {
		e.currentTarget.parentElement.style.backgroundColor = "#ffffff"
	}}
	on:click={(e) => {
		const dataId = e.currentTarget.parentElement.getAttribute("data-id")
		const articleBlockIndex = fakeArr.findIndex((articleBlock) => articleBlock.dataId === dataId)
		fakeArr.splice(articleBlockIndex, 1)
		$articleBlocksArray = fakeArr
	}}
	>{@html icClose()}
</button>

<style>
	.block-delete {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 32px;
		width: 32px;
		right: -48px;
		top: 0;
		z-index: 3;
		opacity: 0;
		background-color: #fff;
	}
	.button {
		border: none;
		cursor: pointer;
	}
</style>
