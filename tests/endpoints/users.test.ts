import { describe } from "node:test";
import { expect } from "vitest";
import { JwtService } from "../../src/core/services/jwt.service";
import { UserCollection } from "../../src/infrastructure/persitence/database";
import { composeTest } from "../_contexts/test-container.context";


describe("User Endpoint", () => {

    composeTest("user all should returns user in db", async ({ appUrl, client }) => {
        const insertResult = await client.db().collection<UserCollection>("users").insertOne({
            password: "strongPassword123",
            username: "exampleUser"
        })

        var result = await fetch(`${appUrl}/users`, {
            headers: {
                "Authorization": `Bearer ${new JwtService().sign({ username: "test" })}`
            }
        })
        var json = await result.json()

        expect(result.status).toBe(200)
        expect(json[0].username).toBe("exampleUser")
        expect(json[0].password).to.be.undefined
    })
})