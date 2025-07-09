import { describe } from "node:test";
import { expect, vi } from "vitest";
import { composeTest } from "../_contexts/test-container.context";


describe("Verify Endpoint", () => {
    composeTest("verify should return ok if access token is valid, then ko if token is invalid", async ({ appUrl, client }) => {
        vi.useFakeTimers();

        await client.db().collection("users").insertOne({
            username: "exampleUser",
            password: "strongPassword123"
        })

        const result = await fetch(`${appUrl}/token/login?username=exampleUser&password=strongPassword123`)
        const json = await result.json()

        expect(json.token).toMatch(/^(?:[^.]*\.){2}[^.]*$/);

        //Checking verify result
        let verifyResult = await fetch(`${appUrl}/token/verify`, {
            headers: {
                "Authorization": `Bearer ${json.token}`
            }
        })
        let verifyResultJson = await verifyResult.json()

        expect(verifyResult.status).toBe(200)
        expect(verifyResultJson).toMatchObject({ ok: true })

        //Advance time by 60 seconds (60000 milliseconds)
        vi.advanceTimersByTime(60000);

        verifyResult = await fetch(`${appUrl}/token/verify`, {
            headers: {
                "Authorization": `Bearer ${json.token}`
            }
        })
        verifyResultJson = await verifyResult.json()

        expect(verifyResult.status).toBe(401)
        expect(verifyResultJson).toMatchObject({ ok: false })

    }) //waiting for it to expire
})