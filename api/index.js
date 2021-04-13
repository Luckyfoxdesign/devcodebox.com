"use strict"

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const config = require("../config/config")

const login = require("./Routes/auth/login/index")
const register = require("./Routes/auth/registration/index")
const saveDraftArticle = require("./Routes/upload-article/save-draft/index")
const updateDraftArticle = require("./Routes/upload-article/update-draft/index")
const publishNewArticle = require("./Routes/upload-article/publish-new/index")
const publishDraftArticle = require("./Routes/upload-article/publish-draft/index")
const getArticles = require("./Routes/articles/all/index")
const getArticle = require("./Routes/article/index")
const getMyArticles = require("./Routes/myarticles/index")
const removeArticle = require("./Routes/remove-article/index")
const userProfile = require("./Routes/user/profile/index")
const deleteProfile = require("./Routes/user/delete-profile/index")
const changePassword = require("./Routes/user/change-password/index")
const getPublishedArticles = require("./Routes/articles/published/index")
const getDraftArticles = require("./Routes/articles/drafts/index")

const PORT = 3001

// app.use(json())
// app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use("/api/auth/login", login)
app.use("/api/auth/registration", register)
app.use("/api/upload-article/save-draft", saveDraftArticle)
app.use("/api/upload-article/publish-new", publishNewArticle)
app.use("/api/upload-article/publish-draft", publishDraftArticle)
app.use("/api/upload-article/update-draft", updateDraftArticle)
app.use("/api/article", getArticle)
app.use("/api/myarticles", getMyArticles)
app.use("/api/remove-article", removeArticle)
app.use("/api/user/profile", userProfile)
app.use("/api/user/delete-profile", deleteProfile)
app.use("/api/user/change-password", changePassword)
app.use("/api/articles/published", getPublishedArticles)
app.use("/api/articles/drafts", getDraftArticles)
app.use("/api/articles/all", getArticles)

app.listen(PORT, async (err) => {
	if (err) console.log("error", err)
	else {
		config.dataBaseConnection = await mongoose.createConnection(
			config.mongoConnectionString("articles_db"),
			config.mongoConnectionOptions
		)
		// config.dataBaseConnection.on("disconnected", (disconnectedError) => {
		// 	console.log(disconnectedError)
		// })
	}
	console.log(`backend started on ${PORT}`)
})
