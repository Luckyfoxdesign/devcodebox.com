<script context="module">
	export function preload(page, { sid, data }) {
		return { sid, data }
	}
</script>

<script>
	import { onMount } from "svelte"
	import NewsSkeleton from "../dashboard/createarticle/_components/NewsSkeleton.svelte"

	// export let data

	let loadedArticles = null

	onMount(async () => {
		await fetch("http://localhost:8000/api/articles/all", {
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
				// console.log(responseResultJSON)
				loadedArticles = responseResultJSON.result
			})
			.catch((getArticlesError) => {
				console.log(getArticlesError)
			})
	})

	// повторно используется в админке, наверное можно вытащить куда-то в ожно место
	function formatArticleDate(dateInput) {
		const parsedDate = new Date(dateInput)
		const intlOptions = { year: "numeric", month: "short", day: "numeric" }
		return new Intl.DateTimeFormat("en-US", intlOptions).format(parsedDate)
	}
</script>

<svelte:head>
	<title>Index page</title>
</svelte:head>
<div class="content">
	<div class="articles-list">
		{#if loadedArticles != null}
			{#each loadedArticles as article}
				<div class="article">
					<div class="article-description">
						<a
							rel="prefetch"
							class="article-link"
							href="blog/article/{article.title.replace(/\s/g, '-')}-{article._id}"
						>
							<h2 class="article-title">{@html article.title}</h2>
							<p class="article-short">{@html article.subtitle}</p>
						</a>
						<span class="article-date">{formatArticleDate(article.dateCreated)}</span>
					</div>
					<a rel="prefetch" class="article-link" href="blog/article/{article.title.replace(/\s/g, '-')}-{article._id}">
						<div class="article-preview">
							{#if article.previewSrc != ""}
								<img
									class="preview-image"
									loading="lazy"
									src={`${article.previewSrc}`}
									alt={article.previewAlt}
									on:error={() => {
										article.previewSrc = "/site/no-image.webp"
									}}
								/>
							{:else}
								<img class="preview-image" src="/site/no-image.webp" alt="wqd" />
							{/if}
						</div>
					</a>
				</div>
			{/each}
		{:else}
			<NewsSkeleton />
		{/if}
	</div>
</div>

<style>
	.content {
		padding-bottom: 92px;
	}
	.articles-list {
		padding-bottom: 96px;
	}
	.article {
		display: grid;
		grid-template: auto / 1fr 200px;
		column-gap: 32px;
		padding-top: 32px;
	}
	.article-title {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-weight: 700;
	}
	.article-link {
		text-decoration: none;
	}
	.article-short {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-family: inherit;
		color: var(--Gray75);
	}
	.article-date {
		color: var(--Gray75);
	}
	.article-preview {
		position: relative;
		overflow: hidden;
		width: 200px;
		height: 132px;
		/* background-color: var(--GrayCC); */
	}
	.preview-image {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
</style>
