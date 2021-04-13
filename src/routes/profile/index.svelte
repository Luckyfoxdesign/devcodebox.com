<script context="module">
	import { goto } from "@sapper/app"
	export function preload(page, { sid, data }) {
		if (data === undefined) {
			if (typeof document === "undefined") {
				this.redirect(302, "/login")
			}
			this.redirect(302, "/login")
		} else return { data, sid }
	}
</script>

<script>
	export let sid,
		data,
		newPassword = "",
		oldPassword = ""
	import { onMount } from "svelte"
	import { stores } from "@sapper/app"
	const { session } = stores()

	let joinDate = "",
		nickname = "",
		userEmail = "",
		isDataLoaded = false,
		deletePassword = "",
		responseMessage = ""

	onMount(async () => {
		if (data != undefined) {
			await fetch(`http://localhost:8000/api/user/profile/${data._id}`, {
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
					nickname = responseResultJSON.name
					joinDate = responseResultJSON.joinDate
					userEmail = responseResultJSON.email
					isDataLoaded = true
					// console.log(responseResultJSON)
				})
				.catch((getArticleError) => {
					console.log(getArticleError)
				})
		}
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

	async function deleteProfile() {
		await fetch(`/api/delete-profile`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id: data._id, email: userEmail, password: deletePassword }),
		}).then((responseResult) => {
			if (responseResult.status === 200) {
				goto(".", { replaceState: true })
			} else {
				responseMessage = "Неправильный пароль"
				hideResponseNotice()
			}
		})
	}

	async function changePassword() {
		await fetch(`http://localhost:8000/api/user/change-password`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ id: data._id, email: userEmail, oldPassword: oldPassword, newPassword: newPassword }),
		}).then((responseResult) => {
			if (responseResult.status === 200) {
				console.log("Ура, сменили пароль")
			} else {
				responseMessage = "Неправильный пароль"
				hideResponseNotice()
			}
		})
	}

	function hideResponseNotice() {
		setTimeout(() => {
			responseMessage = ""
		}, 2000)
	}
</script>

<svelte:head>
	<title>Pofile</title>
</svelte:head>

<div class="content">
	<div class="header">
		<h1>Profile</h1>
	</div>
	{#if isDataLoaded}
		<div class="profile-description">
			<div class="avatar-overlay">
				<img class="avatar" src="ti.webp" alt="" />
			</div>
			<div>
				<h2>{nickname}</h2>
				<p class="join-date">{userEmail}</p>
				<p class="join-date">Дата регистрации: {returnFormattedArticleDate(joinDate)}</p>
			</div>
		</div>
		<div class="profile-settings">
			<div>
				<div class="input-label">
					<label for="email-input">Почта</label>
					<input type="email" id="email-input" readonly placeholder={userEmail} />
				</div>
				<div class="input-label">
					<label for="password-input">Старый пароль</label>
					<input type="password" id="password-input" bind:value={oldPassword} />
				</div>
				<div class="input-label">
					<label for="password-input">Новый пароль</label>
					<input type="password" id="password-input" bind:value={newPassword} />
				</div>
				<button class="create-article-button green" on:click={changePassword}>Сохранить</button>
			</div>
			<div>
				<p>Все личные данные удалятся, ваши посты останутся.</p>
				<div class="input-label">
					<label for="password-input">Пароль для удаления</label>
					<input type="password" id="password-input" bind:value={deletePassword} />
				</div>
				<button class="create-article-button red" on:click={deleteProfile}>Удалить аккаунт</button>
				{#if responseMessage != ""}
					<div class="message-form">
						<p>{responseMessage}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.header {
		padding-top: 32px;
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 16px;
		align-items: center;
	}
	.profile-actions {
		display: flex;
		align-items: flex-start;
	}
	.profile-description {
		display: grid;
		grid-template-columns: auto 1fr auto;
		column-gap: 16px;
		padding-top: 24px;
	}
	.join-date {
		margin-top: 0;
		margin-bottom: 0;
		color: var(--Gray75);
	}
	.input-label {
		display: flex;
		flex-direction: column;
		padding-bottom: 12px;
	}
	.avatar-overlay {
		width: 72px;
		height: 72px;
		overflow: hidden;
		position: relative;
		border-radius: 16px;
		display: block;
	}
	.profile-settings {
		display: grid;
		grid-template-columns: 50% 50%;
		column-gap: 32px;
		padding-top: 24px;
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
	.create-article-button {
		border-radius: 4px;
		border: none;
		height: 32px;
		cursor: pointer;
		margin-top: 12px;
	}
	.red {
		background-color: var(--Red500);
		color: var(--WhiteFF);
	}

	.red:hover {
		background-color: var(--Red600);
	}
	.green {
		background-color: var(--Green500);
		color: var(--WhiteFF);
	}
	.green:hover {
		background-color: var(--Green600);
	}
	input {
		padding: 4px 8px 6px 8px;
		border: 1px solid var(--GrayCC);
		border-radius: 4px;
		margin-top: 4px;
	}
	.content {
		padding-bottom: 92px;
	}
</style>
