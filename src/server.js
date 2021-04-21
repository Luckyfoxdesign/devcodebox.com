import sirv from "sirv"
import express from "express"
import compression from "compression"
import * as sapper from "@sapper/server"
import { v4 as uuidv4 } from "uuid"
import config from "../config/config"
import sharp from "sharp"

const app = express()
const { json } = require("body-parser")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)

const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const { PORT, NODE_ENV, DBUSRNAME, DBUSRPWD } = process.env
const dev = NODE_ENV === "development"

app.post("/api/uploadImage", upload.single("article-image"), async (req, res) => {
	// console.log("app post image upload")
	let imagePath = req.file.originalname.replace(/\s/g, "_") + ".webp"
	await sharp(req.file.buffer)
		.webp()
		.toFile(`./static/article_images/${imagePath}`)
		.then(() => {
			res.send(JSON.stringify({ imageName: imagePath }))
		})
})

app.use(
	json(),
	session({
		genid: function (req) {
			return uuidv4()
		},
		secret: "secret",
		saveUninitialized: false,
		cookie: {
			path: "/",
			maxAge: 86400000 / 2, // это сутки деленные на 2
			// maxAge: 40000, // это 40 секунд
			secure: false,
			httpOnly: true,
			sameSite: true,
		},
		resave: false,
		store: new MongoStore(config.mongoStoreConnectionOptions),
	})
)

app.use(
	compression({ threshold: 0 }),
	sirv("static", { dev }),
	sapper.middleware({
		session: (req) => ({ sid: req.session.id, data: req.session.data }),
	})
)

app.listen(PORT, (err) => {
	if (err) console.log("error", err)
})
