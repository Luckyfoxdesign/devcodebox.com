<script context="module">
	import { goto } from "@sapper/app"
	import FormatSkeleton from "./_components/FormatSkeleton.svelte"
	import { icFile, icH2, icParagraph, icClose } from "../../../components/Icons"
	import { articleBlocksArray, paragraphDataIdCounter, articleTitleAndSubtitileObj } from "./../../../../store.js"

	export function preload(page, { sid, data }) {
		if (data === undefined || data.role != "admin") {
			if (typeof document === "undefined") {
				this.redirect(302, "/login")
			}
			this.redirect(302, "/login")
		} else return { sid, data }
	}
</script>

<script>
	export let sid, data
	import { onMount } from "svelte"
	import DeleteBlockBtn from "./_components/DeleteBlock_btn.svelte"

	let articleTitle = $articleTitleAndSubtitileObj.title
	let fakeArticleBlocksArray = $articleTitleAndSubtitileObj.content
	let subtitle = $articleTitleAndSubtitileObj.subtitle
	$articleBlocksArray = $articleTitleAndSubtitileObj.content
	let articleOldId = $articleTitleAndSubtitileObj.id
	let isImageUploadFormVisible = false // переменная модалки загрузки изображения
	let files // переменная для выбранных файлов
	let isDOMLoaded = false
	let isErrorMessage = false
	let errorMessageText = "",
		isElementHovered = false
	// let isPreviewImageLoaded = false

	function addNewParagraph() {
		// добавляем элемент p
		// оббновляем в сторе переменную
		paragraphDataIdCounter.update((n) => ++n)
		// добавляем в масиив новый обьект с данными
		fakeArticleBlocksArray.push({
			dataId: `${$paragraphDataIdCounter}`,
			type: "p",
			text: "",
		})
		// обновляем массив
		$articleBlocksArray = fakeArticleBlocksArray
	}

	function addNewH2() {
		// добавляем элемент H2
		// оббновляем в сторе переменную
		paragraphDataIdCounter.update((n) => ++n)
		// добавляем в масиив новый обьект с данными
		fakeArticleBlocksArray.push({
			dataId: `${$paragraphDataIdCounter}`,
			type: "h2",
			text: "",
		})
		// обновляем массив
		$articleBlocksArray = fakeArticleBlocksArray
	}

	function showImageUploadForm() {
		// показываем модалку загрузки картинки
		isImageUploadFormVisible = true
	}

	function hideImageUploadForm() {
		// скрываем модалку загрузки картинки
		isImageUploadFormVisible = false
	}

	async function uploadImage() {
		let formData = new FormData()
		let articleImageInputFile = document.querySelector(".image-input")
		formData.append("article-image", articleImageInputFile.files[0])

		const uploadImageResponse = await fetch("/api/uploadImage", {
			method: "POST",
			body: formData,
		})
		await uploadImageResponse.json().then((responseJSON) => {
			paragraphDataIdCounter.update((n) => ++n)
			fakeArticleBlocksArray.push({
				dataId: `${$paragraphDataIdCounter}`,
				type: "figure",
				src: "article_images/" + responseJSON.imageName,
				alt: responseJSON.imageName,
				caption: "",
			})
			$articleBlocksArray = fakeArticleBlocksArray
			files = null
			isImageUploadFormVisible = false
		})
	}

	function removeInnerTextAndUpdateVariables(e) {
		// если в редактируемом элементе нет текста (html элементы текстом не считаются)
		if (e.target.textContent === "") {
			let articleArrayElement
			const parentBlockDataId = e.target.parentElement.getAttribute("data-id") // получаем родителя текущего элемента
			e.target.innerHTML = ""

			// если у текущего элемента есть родитель
			if (parentBlockDataId != null) {
				// находим этот элемент в массиве
				articleArrayElement = fakeArticleBlocksArray.find((articleBlock) => articleBlock.dataId === parentBlockDataId)
				// обнуляем переменную с текстом в этом массиве
				articleArrayElement.text = ""
				// обновляем массив
				$articleBlocksArray = fakeArticleBlocksArray
			} else {
				// если у текущего элемента что-то другое кроме родителя
				// родителя не может быть только у заголовка и подзаголовка, остальные обернуты в div
				// получаем data-id текущего элемента
				const currentTargetDataId = e.target.getAttribute("data-id")
				switch (currentTargetDataId) {
					case "0":
						// если  id = 0 - это заголовок, обнуляем переменную
						articleTitle = ""
						break
					case "1":
						// если id = 1 - это подзаголовок, обнуляем переменную
						subtitle = ""
						break
				}
			}
		}
	}

	function showDeleteElementButton(e) {
		// функция для показа кнопки удаления элемента (крестик)
		e.target.lastElementChild.style.opacity = "1"
		// e.target.style.boxShadow = "inset 0 0 0 1px #f5f5f5"
		// console.log(e.target)
	}

	function hideDeleteElementButton(e) {
		// функция для скрытия кнопки удаления элемента (крестик)
		e.target.lastElementChild.style.opacity = "0"
	}

	async function saveArticle(e) {
		if (articleTitle != "" && $articleBlocksArray.find((arrayElement) => arrayElement.text != "") != undefined) {
			let previewSrc = ""

			if ($articleBlocksArray.find((arrayElement) => arrayElement.type === "figure") != undefined) {
				$articleBlocksArray.some((arrayElement) => {
					if (arrayElement.type === "figure") {
						return (previewSrc = arrayElement.src)
					}
				})
			}

			let userArticle = {
				content: $articleBlocksArray,
				title: articleTitle,
				subtitle: subtitle,
				authorId: data._id,
				previewSrc: previewSrc,
				dateCreated: Date.now(),
				articleOldId: articleOldId,
				type: e.target.getAttribute("data-type"),
			}
			await fetch(`http://localhost:8000/api/upload-article/${userArticle.type}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ article: userArticle }),
			})
				.then((responseResult) => {
					if (responseResult.status === 201) {
						goto("dashboard/")
					} else {
						throw new Error("Something went wrong")
					}
				})
				.catch((saveArticleError) => {
					console.log(saveArticleError)
				})
		} else {
			isErrorMessage = true
			errorMessageText = "Либо текста нет, либо заголовок пустой"
		}
	}

	onMount(() => {
		isDOMLoaded = true
	})
</script>

<svelte:head>
	<title>admin page</title>
</svelte:head>

{#if isErrorMessage}
	<div class="overlay">
		<div class="overlay-modal">
			<h2 class="modal-title">Ошибка</h2>
			<p>{errorMessageText}</p>
			<button
				class="upload-modal-btn"
				on:click={() => {
					isErrorMessage = false
				}}>Понятно</button
			>
		</div>
	</div>
{/if}

{#if isImageUploadFormVisible}
	<div class="overlay">
		<div class="overlay-modal">
			<h2 class="modal-title">Загрузить картинку</h2>
			<input type="file" class="image-input" bind:files multiple="false" />
			{#if files != undefined}
				<button class="upload-modal-btn" on:click={uploadImage}>Загрузить</button>
			{/if}
			<button class="close-modal-btn" on:click={hideImageUploadForm}>{@html icClose("12px", "12px")}</button>
		</div>
	</div>
{/if}

<div class="article-content">
	<h1
		type="text"
		data-placeholder="Заголовок"
		contenteditable
		data-id="0"
		class="article-header"
		class:empty={articleTitle === ""}
		on:keyup={(e) => removeInnerTextAndUpdateVariables(e)}
		on:keydown={(e) => {
			if (e.code === "Enter") {
				e.preventDefault()
				let sel = document.getSelection()
				// console.log(sel)
				sel.setPosition(document.querySelector(".p-main"), 0)
			}
		}}
		bind:innerHTML={articleTitle}
	/>
	<p
		class="article-paragraph p-main"
		data-id="1"
		data-placeholder="Подзаголовок"
		contenteditable
		class:empty={subtitle === ""}
		on:keyup={(e) => removeInnerTextAndUpdateVariables(e)}
		on:keydown={(e) => {
			if (e.code === "Enter") {
				e.preventDefault()
			}
		}}
		bind:innerHTML={subtitle}
	/>
	<div class="all">
		{#each $articleBlocksArray as arrayBlock, i}
			{#if arrayBlock.type === "p"}
				<div
					class="article-block"
					data-id={arrayBlock.dataId}
					on:mouseenter={(e) => showDeleteElementButton(e)}
					on:mouseleave={(e) => hideDeleteElementButton(e)}
				>
					<p
						class="article-paragraph"
						class:empty={$articleBlocksArray[i].text === ""}
						data-placeholder="Параграф"
						contenteditable
						on:keyup={(e) => removeInnerTextAndUpdateVariables(e)}
						bind:innerHTML={$articleBlocksArray[i].text}
					/>
					<DeleteBlockBtn fakeArr={fakeArticleBlocksArray} />
				</div>
			{/if}
			{#if arrayBlock.type === "h2"}
				<div
					class="article-block"
					data-id={arrayBlock.dataId}
					on:mouseenter={(e) => showDeleteElementButton(e)}
					on:mouseleave={(e) => hideDeleteElementButton(e)}
				>
					<h2
						class="article-stitle"
						class:empty={$articleBlocksArray[i].text === ""}
						data-placeholder="Заголовок H2"
						contenteditable
						on:keyup={(e) => removeInnerTextAndUpdateVariables(e)}
						bind:innerHTML={$articleBlocksArray[i].text}
					/>
					<DeleteBlockBtn fakeArr={fakeArticleBlocksArray} />
				</div>
			{/if}
			{#if arrayBlock.type === "figure"}
				<div
					class="article-block"
					data-id={arrayBlock.dataId}
					on:mouseenter={(e) => showDeleteElementButton(e)}
					on:mouseleave={(e) => hideDeleteElementButton(e)}
				>
					<figure>
						<div class="image-container">
							<img class="article-image" src={$articleBlocksArray[i].src} alt={$articleBlocksArray[i].alt} />
						</div>
						<figcaption
							class="image-caption"
							class:empty={$articleBlocksArray[i].caption === ""}
							data-placeholder="Опциональная подпись к картинке"
							on:keyup={(e) => removeInnerTextAndUpdateVariables(e)}
							contenteditable
							bind:innerHTML={$articleBlocksArray[i].caption}
						/>
					</figure>
					<DeleteBlockBtn fakeArr={fakeArticleBlocksArray} />
				</div>
			{/if}
		{/each}
	</div>
	{#if isDOMLoaded}
		<div class="publish-container">
			<div class="article-format">
				<button class="add-button" on:click={addNewParagraph}>{@html icParagraph}</button>
				<button class="add-button" on:click={addNewH2}>{@html icH2}</button>
				<button class="add-button" on:click={showImageUploadForm}>{@html icFile}</button>
			</div>
			{#if $articleTitleAndSubtitileObj.type === "edit"}
				<button class="publish-button" data-type="publish-draft" on:click={saveArticle}>Опубликовать черновик</button>
				<button class="draft-button" data-type="update-draft" on:click={saveArticle}>Сохранить изменения</button>
			{:else}
				<button class="publish-button" data-type="publish-new" on:click={saveArticle}>Опубликовать</button>
				<button class="draft-button" data-type="save-draft" on:click={saveArticle}>Сохранить как черновик</button>
			{/if}
		</div>
	{:else}
		<FormatSkeleton />
	{/if}
</div>

<style>
	.article-content {
		font-family: Charter, Bitstream Charter, serif;
		padding-top: 32px;
		padding-bottom: 96px;
	}
	.article-header {
		outline: 0;
		font-size: 3.429em;
		white-space: break-spaces;
	}
	.article-format {
		display: grid;
		grid-template-columns: repeat(3, 32px);
		column-gap: 4px;
		padding: 12px;
		margin-bottom: 24px;
		border: 1px solid #ccc;
		border-radius: 40px;
	}
	.add-button {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 32px;
		width: 32px;
		border-radius: 32px;
		border: none;
		cursor: pointer;
		background-color: var(--WhiteFF);
	}
	.add-button:hover {
		background-color: var(--GrayF5);
	}

	.publish-container {
		padding-top: 32px;
	}
	.publish-button {
		background-color: var(--WhiteFF);
		border-radius: 24px;
		border: 2px solid var(--Gray33);
		padding: 6px 12px 8px 12px;
		cursor: pointer;
	}
	.draft-button {
		color: var(--Gray75);
		background: none;
		border: none;
		padding: 6px 12px 8px 12px;
		margin-left: 16px;
		cursor: pointer;
	}
	.p-main {
		white-space: break-spaces;
		margin-bottom: 32px;
		color: var(--Gray75);
	}

	.hovered-element {
		background-color: #ccc;
	}

	/* Контейнер и картинка */
	.image-container {
		position: relative;
		overflow: hidden;
		padding-top: 32px;
		text-align: center;
		position: relative;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	.article-image {
		max-width: 100%;
		vertical-align: top;
		white-space: pre-wrap;
		cursor: text;
		text-align: center;
		word-wrap: break-word;
		max-height: 600px;
	}

	/* Подпись к картинке */
	.image-caption {
		outline: 0;
		text-align: center;
		margin-top: 8px;
		margin-bottom: 16px;
		padding-bottom: 16px;
		cursor: text;
		color: var(--Gray75);
	}

	/* Это для появления кнопки удаления напротив блока */
	.article-block {
		position: relative;
	}
	/* .article-block:hover {
		background-color: var(--GrayF5);
	}
	.article-paragraph:focus {
		background-color: var(--GrayF5);
	} */
	/* Стили всех параграфов */
	.article-paragraph {
		outline: 0;
		font-size: 1.5em;
		cursor: text;
	}

	.article-stitle {
		outline: 0;
		font-size: 2em;
		padding-top: 24px;
		padding-bottom: 8px;
	}

	/* Плейсхолдер для первого параграфа */
	.empty:empty::before {
		display: block;
		pointer-events: none;
		white-space: nowrap;
		color: var(--Gray75);
		content: attr(data-placeholder);
	}

	/* Модалка загрузки картинки */
	.overlay {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		background-color: rgba(255, 255, 255, 0.85);
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	.overlay-modal {
		position: relative;
		height: auto;
		max-width: 400px;
		padding: 24px 32px 32px 32px;
		background-color: var(--WhiteFF);
		border: 1px solid var(--Gray75) 0;
		box-shadow: 2px 0px 23px 7px rgba(194, 194, 194, 0.85);
		border-radius: 6px;
		margin-bottom: 96px;
		z-index: 2;
	}
	.close-modal-btn {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 32px;
		width: 32px;
		right: 4px;
		top: 4px;
		z-index: 3;
		background-color: #fff;
		border: none;
		cursor: pointer;
	}
	.image-input {
		display: block;
		margin-top: 16px;
	}

	.upload-modal-btn {
		width: 100%;
		margin-top: 24px;
		background-color: var(--Gray33);
		border: none;
		border-radius: 24px;
		padding: 6px 12px 8px 12px;
		color: var(--WhiteFF);
		cursor: pointer;
	}
</style>
