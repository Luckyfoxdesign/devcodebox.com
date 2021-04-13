<script context="module">
	import { goto } from "@sapper/app"
</script>

<script>
	export let segment
	import { stores } from "@sapper/app"
	import { icLogout } from "./Icons"
	const { page, session } = stores()

	const logout = async () => {
		await fetch("/api/auth/logout", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}).then((responseResult) => {
			if (responseResult.status === 200) {
				$session.data = undefined
				return goto(".", { replaceState: true })
			} else {
				throw new Error("Something went wrong")
			}
		})
	}
</script>

<header>
	<div class="head-content" style="padding-top: 16px;">
		<div class="content">
			<a rel="prefetch" href=".">
				<img class="head-logo" src="site/logo.webp" alt="" />
			</a>
			<div class="header-data">
				<div class="menu">
					<a rel="prefetch" aria-current={segment === "blog" ? "page" : undefined} href="blog">Блог</a>
				</div>
				<div class="profile">
					{#if $session.data != undefined}
						<div class="profile-links">
							<a rel="prefetch" aria-current={segment === "dashboard" ? "page" : undefined} href="dashboard">Дашборд</a>
							<a rel="prefetch" aria-current={segment === "profile" ? "page" : undefined} href="profile">Профиль</a>
						</div>
						<div class="avatar-overlay">
							<img class="avatar" src="/ti.webp" alt="" />
						</div>
						<button class="add-button" on:click={logout}>{@html icLogout()}</button>
					{:else}
						<a rel="prefetch" href="login">Вход</a>
						<a rel="prefetch" href="registration">Регистрация</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</header>

<style>
	.head-content {
		display: flex;
		justify-content: center;
		padding-bottom: 16px;
		border-bottom: 2px solid #000;
	}
	.content {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 24px;
		width: 732px;
	}
	.head-logo {
		display: block;
		height: 32px;
		width: 32px;
		background-color: #ccc;
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
	.profile {
		display: grid;
		grid-template-columns: auto 32px 32px;
		column-gap: 16px;
		align-items: inherit;
	}
	.profile-links {
		display: grid;
		grid-template-columns: repeat(2, auto);
		column-gap: 16px;
		text-align: right;
	}
	.header-data {
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 32px;
		align-items: center;
		grid-template-rows: 32px;
	}
	.avatar-overlay {
		width: 32px;
		height: 32px;
		overflow: hidden;
		position: relative;
		border-radius: 16px;
		display: block;
	}
	.avatar {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	[aria-current] {
		color: var(--Blue500);
	}
</style>
