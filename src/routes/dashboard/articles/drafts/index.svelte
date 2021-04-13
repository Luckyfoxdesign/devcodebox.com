<script context="module">
	import { goto } from "@sapper/app"
	import { onMount } from "svelte"
	export function preload(page, { sid, data }) {
		if (data === undefined || data.role != "admin") {
			if (typeof document === "undefined") {
				this.redirect(302, "/")
			}
			this.redirect(302, "/")
		} else return { sid, data }
	}
</script>

<script>
	export let sid, data
  import { articleTitleAndSubtitileObj } from "../../../../../store"
  import { icDelete, icEdit } from "../../../../components/Icons"
	let myDraftsArticles = null,
  // draftsCount = 0,
		draftArticlesArr = []

	onMount(async () => {
		await fetch(`http://localhost:8000/api/articles/drafts?id=${data._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((responseResult) => {
				if (responseResult.status === 200) {
					return responseResult.json()
				} else {
					throw new Error("Something went wrong")
				}
			})
			.then((responseResultJSON) => {
				draftArticlesArr = responseResultJSON.result
			})
			.catch((getMyArticlesError) => {
				console.log(getMyArticlesError)
			})
	})

	function returnFormattedArticleDate(dateInput) {
		const parsedDate = new Date(dateInput)
		const intlOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			weekday: "short",
		}
		return new Intl.DateTimeFormat("ru-RU", intlOptions).format(parsedDate)
	}

  async function editArticle(articleTitle, articleId) {
		await fetch(`http://localhost:8000/api/article/${articleTitle}-${articleId}?type=draft`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((responseResult) => {
				if (responseResult.status === 200) {
					return responseResult.json()
				} else {
					throw new Error("Something went wrong")
				}
			})
			.then((responseResultJSON) => {
				$articleTitleAndSubtitileObj.title = responseResultJSON.result.title
				$articleTitleAndSubtitileObj.subtitle = responseResultJSON.result.subtitle
				$articleTitleAndSubtitileObj.content = responseResultJSON.result.content
				$articleTitleAndSubtitileObj.type = "edit"
				$articleTitleAndSubtitileObj.id = responseResultJSON.result._id
				goto("dashboard/createarticle")
			})
			.catch((getArticleError) => {
				console.log(getArticleError)
			})
	}

  async function deleteArticle(articleName, articleId) {
		await fetch(
			encodeURI(`http://localhost:8000/api/remove-article/?name=${articleName}&id=${articleId}&userid=${data._id}&f=drafts`),
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}
		)
			.then((responseResult) => {
				if (responseResult.status === 200) {
					return responseResult.json()
				} else {
					throw new Error("Something went wrong")
				}
			})
			.then((responseResultJSON) => {
				// draftsCount = responseResultJSON.result.draftCount
				draftArticlesArr = responseResultJSON.result.drafts
			})
			.catch((deleteArticleError) => {
				console.log(deleteArticleError)
			})
	}
</script>

<svelte:head>
	<title>admin page</title>
</svelte:head>

<div class="content">
	<div class="header">
		<h1>Черновики</h1>
	</div>
	<div class="all-articles">
		{#if draftArticlesArr != null}
			{#each draftArticlesArr as draftArticle, index}
				<div class="articles-list-item">
					<span class="articles-index">{index + 1}</span>
					<div class="article-description">
						<p class="article-name">{draftArticle.title}</p>
						<p class="article-date">{returnFormattedArticleDate(draftArticle.dateCreated)}</p>
					</div>
					<div class="article-actions">
						<button class="button-edit button" on:click={editArticle(draftArticle.title, draftArticle._id)}
							>{@html icEdit("12px", "12px")}</button
						>
						<button class="button-delete button" on:click={deleteArticle(draftArticle.title, draftArticle._id)}
							>{@html icDelete("12px", "12px")}</button
						>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.header {
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 16px;
		padding-top: 32px;
		padding-bottom: 24px;
		align-items: center;
	}
	.articles-list-item {
		display: grid;
		grid-template-columns: auto 1fr auto;
		padding-top: 16px;
		column-gap: 12px;
	}
	.articles-index {
		color: var(--Gray75);
		line-height: 1.5;
	}
	.article-name {
		margin: 0;
	}
	.article-date {
		margin: 0;
		font-size: 0.857em;
		color: var(--Gray75);
	}
	.article-description {
		padding-left: 12px;
		border-left: 1px solid var(--GrayF5);
	}
	.content {
		padding-bottom: 92px;
	}
  .button {
		border-radius: 4px;
		border: none;
		background-color: var(--WhiteFF);
		height: 26px;
		cursor: pointer;
	}
  .button-edit:hover {
		background-color: var(--GrayF5);
	}
	.button-delete:hover {
		background-color: var(--Red500);
	}
</style>
