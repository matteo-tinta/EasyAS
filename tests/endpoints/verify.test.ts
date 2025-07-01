import { describe } from "node:test";
import { beforeAll, expect } from "vitest";
import { composeTest } from "../_contexts/test-container.context";


describe("Verify Endpoint", () => {
    const wait = async (timeInSeconds: number) => {
        await new Promise((res, rej) => setTimeout(() => {
            res(undefined)
        }, timeInSeconds * 1000))
    }

    composeTest.concurrent("verify should return ok if access token is valid, then ko if token is invalid", async ({ appUrl, seed }) => {
        //Login and getting token
        await seed("users", {
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
        expect(verifyResultJson).toMatchObject({ok: true})

        //wait for 60s to make it down
        await wait(60);
        
        verifyResult = await fetch(`${appUrl}/token/verify`, {
            headers: {
                "Authorization": `Bearer ${json.token}`
            }
        })
        verifyResultJson = await verifyResult.json()
        
        expect(verifyResult.status).toBe(401)
        expect(verifyResultJson).toMatchObject({ok: false})

    }, 1000 * 80) //waiting for it to expire
})