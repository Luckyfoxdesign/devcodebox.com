const http = require("http"),
	httpProxy = require("http-proxy")
//
// Create your proxy server and set the target in the options.
//
httpProxy.createProxyServer({ target: "http://localhost:3001/" }).listen(8000) // See (†)
