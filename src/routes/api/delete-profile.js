import fetch from "node-fetch"

export async function post(req, res) {
	await fetch("http://localhost:8000/api/user/delete-profile", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ id: req.body.id, email: req.body.email, password: req.body.password }),
	}).then((responseResult) => {
		if (responseResult.status === 200) {
			req.session.destroy((err) => {
				res.clearCookie("connect.sid")
				if (err) return next(err)
				res.sendStatus(200)
			})
		} else {
			res.sendStatus(204)
		}
	})
}
