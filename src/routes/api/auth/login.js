import fetch from "node-fetch"

export async function post(req, res) {
	const { email, password } = req.body

	const response = await fetch("http://localhost:3001/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ email, password }),
	})

	const responseJSON = await response.json()
	req.session.data = await responseJSON.data

	res.send(JSON.stringify({ msg: responseJSON.msg, data: responseJSON.data, success: responseJSON.success }))
}
