export async function get(req, res, next) {
	req.session.destroy((err) => {
		res.clearCookie("connect.sid")
		if (err) return next(err)
		res.sendStatus(200)
	})
}
