import { describe } from "node:test";
import { expect } from "vitest";
import { composeTest } from "../_contexts/test-container.context";


describe("Refresh Endpoint", () => {
    composeTest("when refresh token is not expired, issues a new refresh and access token", async ({ appUrl, client }) => {
        //Login and getting token
        await client.db().collection("users").insertOne({
            username: "exampleUser",
            password: "helloworld"
        })
        await client.db().collection("tokens").insertOne({
            username: "exampleUser",
            refreshToken: "123456789",
            expireAt: `__DATE__${new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()}__DATE__` //expires by 1h
        })

        //Refresh the token
        const refreshTokenResult = await fetch(`${appUrl}/token/renew`, {
            method: "POST",
            headers: {
                "Content-Type": `application/x-www-form-urlencoded`
            },
            body: `grant_type=refresh_token&refresh_token=123456789`
        })
        const refreshTokenBody = await refreshTokenResult.json()

        expect(refreshTokenResult.status).toBe(200)

        expect(refreshTokenBody.token).toMatch(/^(?:[^.]*\.){2}[^.]*$/); //JWT format
        expect(refreshTokenBody.refreshToken).toBeDefined();
        expect(refreshTokenBody.refreshToken).not.toMatch("123456")
    })

    composeTest("when refresh token does not exist returns 400", async ({ appUrl }) => {

        //Refresh the token
        const refreshTokenResult = await fetch(`${appUrl}/token/renew`, {
            method: "POST",
            headers: {
                "Content-Type": `application/x-www-form-urlencoded`
            },
            body: `grant_type=refresh_token&refresh_token=123456789`
        })
        const refreshTokenBody = await refreshTokenResult.json()

        expect(refreshTokenResult.status).toBe(400)

        expect(refreshTokenBody.error).toBe("invalid_grant");
    })

    composeTest("when refresh token is expired returns 400", async ({ appUrl, client }) => {
        //Login and getting token
        await client.db().collection("tokens").insertOne({
            username: "exampleUser",
            refreshToken: "123456789",
            expireAt: `__DATE__${new Date(new Date().getTime() - (60 * 60 * 1000)).toISOString()}__DATE__` //expired 1h ago
        })

        //Refresh the token
        const refreshTokenResult = await fetch(`${appUrl}/token/renew`, {
            method: "POST",
            headers: {
                "Content-Type": `application/x-www-form-urlencoded`
            },
            body: `grant_type=refresh_token&refresh_token=123456789`
        })
        const refreshTokenBody = await refreshTokenResult.json()

        expect(refreshTokenResult.status).toBe(400)

        expect(refreshTokenBody.error).toBe("invalid_grant");
    })
})