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

	let myPublishedArticles = null

	onMount(async () => {
		await fetch(`http://localhost:8000/api/articles/published?id=${data._id}`, {
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
				myPublishedArticles = responseResultJSON.result
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
</script>

<svelte:head>
	<title>admin page</title>
</svelte:head>

<div class="content">
	<div class="header">
		<h1>Опубликованные статьи</h1>
	</div>
	<div class="all-articles">
		{#if myPublishedArticles != null}
			{#each myPublishedArticles as publicArticle, index}
				<div class="articles-list-item">
					<span class="articles-index">{index + 1}</span>
					<div class="article-description">
						<a rel="prefetch" href="blog/article/{publicArticle.title.replace(/\s/g, '-')}-{publicArticle._id}"
							><p class="article-name">{publicArticle.title}</p></a
						>
						<p class="article-date">{returnFormattedArticleDate(publicArticle.dateCreated)}</p>
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
		grid-template-columns: auto 1fr;
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
</style>
