const { app } = require("../index")
const request = require("supertest")
const process = require("process")

beforeAll(() => {
	process.env.NODE_ENV = "test"
})

test("/", async () => {
	const res = await request(app).get("/")
	expect(res.status).toEqual(200)
	expect(res.text).toEqual("Hello World!")
	return
})
