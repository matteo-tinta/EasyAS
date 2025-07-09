import { describe } from "node:test";
import { expect } from "vitest";
import { composeTest } from "../_contexts/test-container.context";


describe("Register Endpoint", () => {
    composeTest("register should register a new user", async ({ appUrl }) => {
        const result = await fetch(`${appUrl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": "exampleUser",
                "password": "strongPassword123"
            })
        })

        expect(result.status).toBe(200)

        const loginResult = await fetch(`${appUrl}/token/login?username=exampleUser&password=strongPassword123`)
        var json = await loginResult.json()

        expect(loginResult.status).toBe(200)
        expect(json.token).toMatch(/^(?:[^.]*\.){2}[^.]*$/); //JWT format
        expect(json.refreshToken).toBeDefined();

    })
})