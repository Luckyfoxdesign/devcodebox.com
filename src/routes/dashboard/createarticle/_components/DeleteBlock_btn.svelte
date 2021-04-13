<script>
	import { icClose } from "../../../../components/Icons"
	import { articleBlocksArray } from "../../.../../../../../store.js"
	export let fakeArr
</script>

<button
	class="block-delete button"
	on:click={(e) => {
		let dataId
		switch (e.target.nodeName) {
			case "BUTTON":
				dataId = e.target.parentElement.getAttribute("data-id")
				break
			case "svg" || "path":
				dataId = e.target.parentElement.parentElement.getAttribute("data-id")
				break
		}
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
