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
	import { articleTitleAndSubtitileObj } from "../../../store"
	import ArticlesTableSkeleton from "./createarticle/_components/ArticlesTableSkeleton.svelte"
	import { icDelete, icEdit } from "../../components/Icons"

	export let sid, data

	let myArticles = null,
		draftsCount = 0,
		draftArticlesArr = []

	onMount(async () => {
		await fetch(`http://localhost:8000/api/myarticles?id=${data._id}`, {
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
				draftsCount = responseResultJSON.articles.draftsCount
				draftArticlesArr = responseResultJSON.articles.draft

				myArticles = responseResultJSON.articles
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

	async function deleteArticle(articleName, articleId) {
		await fetch(
			encodeURI(`http://localhost:8000/api/remove-article/?name=${articleName}&id=${articleId}&userid=${data._id}`),
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
				draftsCount = responseResultJSON.result.draftCount
				draftArticlesArr = responseResultJSON.result.drafts
			})
			.catch((deleteArticleError) => {
				console.log(deleteArticleError)
			})
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
	function createNewArticle() {
		$articleTitleAndSubtitileObj.title = ""
		$articleTitleAndSubtitileObj.subtitle = ""
		$articleTitleAndSubtitileObj.content = []
		$articleTitleAndSubtitileObj.type = "new"
		goto("dashboard/createarticle")
	}
</script>

<svelte:head>
	<title>admin page</title>
</svelte:head>

<div class="content">
	<div class="header">
		<h1>Дашборд</h1>
		<button class="create-article-button" on:click={createNewArticle}>Создать статью</button>
	</div>
	<div class="all-articles">
		<div class="articles">
			<h3 class="articles-list-header">Последние 4 опубликованных</h3>
			{#if myArticles != null}
				{#if myArticles.published.length > 0}
					{#each myArticles.published as publicArticle}
						<div class="articles-list-item">
							<div class="article-description">
								<a rel="prefetch" href="blog/article/{publicArticle.title.replace(/\s/g, '-')}-{publicArticle._id}">
									<p class="article-name">{publicArticle.title}</p>
								</a>
								<p class="article-date">{returnFormattedArticleDate(publicArticle.dateCreated)}</p>
							</div>
						</div>
					{/each}
					{#if myArticles.publishedCount > 4}
						<div class="view-all-link">
							<a rel="prefetch" href="dashboard/articles/published"
								>Смотреть все опубликованные ({myArticles.publishedCount})</a
							>
						</div>
					{/if}
				{:else}
					<p class="empty-list">Опубликованных статей нет</p>
				{/if}
			{:else}
				<ArticlesTableSkeleton />
			{/if}
		</div>
		<div class="articles">
			<h3 class="articles-list-header">Черновики</h3>
			{#if myArticles != null}
				{#if draftArticlesArr.length > 0}
					{#each draftArticlesArr as draftArticle}
						<div class="articles-list-item">
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
					{#if draftsCount > 4}
						<div class="view-all-link">
							<a href="dashboard/articles/drafts">Смотреть все черновики ({draftsCount})</a>
						</div>
					{/if}
				{:else}
					<p class="empty-list">В черновиках пусто</p>
				{/if}
			{:else}
				<ArticlesTableSkeleton />
			{/if}
		</div>
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
	.all-articles {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 32px;
	}
	.articles-list-item {
		display: grid;
		grid-template-columns: 1fr auto;
		padding-top: 16px;
	}
	.articles-list-header {
		padding-bottom: 16px;
		border-bottom: 1px solid var(--GrayF5);
	}
	.article-name {
		margin: 0;
	}
	.article-date {
		margin: 0;
		font-size: 0.857em;
		color: var(--Gray75);
	}

	.create-article-button {
		border-radius: 4px;
		border: none;
		height: 32px;
		background-color: var(--Green500);
		cursor: pointer;
		color: var(--WhiteFF);
	}
	.create-article-button:hover {
		background-color: var(--Green600);
	}
	.empty-list {
		color: var(--Gray75);
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

	.view-all-link {
		padding-top: 16px;
	}
	.content {
		padding-bottom: 92px;
	}
</style>
