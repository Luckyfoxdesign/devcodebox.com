import { writable } from "svelte/store"

export const articleBlocksArray = writable([{}])
export const articleTitleAndSubtitileObj = writable({
	title: "",
	subtitle: "",
	content: [],
	type: "",
	titleId: "",
})
export const paragraphDataIdCounter = writable(1)
