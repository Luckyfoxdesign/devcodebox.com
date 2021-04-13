<script context="module">
	export function preload(page, { sid, data }) {
		if (data != undefined) this.redirect(302, "/")
		else return { sid, data }
	}
</script>

<script>
	let password = "",
		email = ""
	export let sid, data

	import { stores } from "@sapper/app"
	const { session } = stores()

	// ! обработать повторные регистрации
	// !TODO Добавить валидацию полей

	const register = async () => {
		const response = await fetch("/api/auth/registration", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
		const responseJSON = await response.json()
		$session.data = await responseJSON.data
	}
</script>

<svelte:head>
	<title>Регистрация</title>
</svelte:head>

<h1>Регистрация</h1>

<form on:submit|preventDefault={register} method="post">
	<label>
		Email:
		<input type="email" bind:value={email} />
	</label>
	<label>
		Password:
		<input type="password" bind:value={password} />
	</label>
	<button type="submit">Регистрация</button>
</form>

<style>
</style>
