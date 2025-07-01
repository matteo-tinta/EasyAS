import { describe } from "node:test";
import { expect } from "vitest";
import { composeTest } from "../_contexts/test-container.context";


describe("Login Endpoint", () => {

    composeTest("login should return an access token", async ({ appUrl, seed }) => {
        await seed("users", {
            username: "exampleUser",
            password: "strongPassword123"
        })

        var result = await fetch(`${appUrl}/token/login?username=exampleUser&password=strongPassword123`)
        var json = await result.json()

        expect(result.status).toBe(200)
        expect(json.token).toMatch(/^(?:[^.]*\.){2}[^.]*$/); //JWT format
        expect(json.refreshToken).toBeDefined();
    })

    composeTest("login should return 401 if password is wrong", async ({ appUrl, seed }) => {
        seed("users", {
            username: "exampleUser",
            password: "strongPassword123"
        })

        var result = await fetch(`${appUrl}/token/login?username=exampleUser&password=strongPassword1234`)
        expect(result.status).toBe(401)
    })

    composeTest("login should return 401 if user does not exist", async ({appUrl}) => {
        var result = await fetch(`${appUrl}/token/login?username=exampleUser1&password=strongPassword1234`)
        expect(result.status).toBe(401)
    })

    composeTest(`login should return 400 if request is malformed`, async ({appUrl}) => {
        var result = await fetch(`${appUrl}/token/login`)
        expect(result.status).toBe(400)
    })
})