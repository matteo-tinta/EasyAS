import path from 'path';
import { GenericContainer, Network, StartedNetwork, StartedTestContainer, Wait } from 'testcontainers'; // or your lib
import { test as baseTest } from 'vitest';
import fs from "fs"

interface CustomTestContainerContext {
  network: StartedNetwork,
  mongoDBContainer: StartedTestContainer,
  app: StartedTestContainer;
  appUrl: string;
  seed: (collection: string, ...data: object[]) => Promise<void>;
}

export const composeTest = baseTest.extend<CustomTestContainerContext>({
  network: async({}, use) => {
    const net = await new Network().start();
    await use(net)
  },
  mongoDBContainer: async({network}, use) => {
    const mongodbContainer = await new GenericContainer("mongo:8")
        .withEnvironment({
          "MONGO_INITDB_ROOT_USERNAME": "test",
          "MONGO_INITDB_ROOT_PASSWORD": "test"
        })
        .withCommand(["mongod", "--bind_ip", "0.0.0.0", "--auth"])
        .withWaitStrategy(Wait.forLogMessage(/MongoDB init process complete/))
        .withNetwork(network)
        .start();
      
    await use(mongodbContainer);
    await mongodbContainer.stop({ remove: true, removeVolumes: true })
  },
  app: async ({mongoDBContainer, network}, use) => {
    const startedContainer = await global.sharedState.APP_IMAGE!
      .withNetwork(network)
      .withExposedPorts(4000)
      // .withLogConsumer(readableStream => {
      //   readableStream.on('data', (chunk) => {
      //     console.log(chunk);
      //   });
      // })
      .withEnvironment({
        "DB_CONN_STRING": `mongodb://test:test@${mongoDBContainer.getHostname()}:27017/as?authSource=admin&retryWrites=true&w=majority`,
        "DB_NAME": "AS"
      })
      .withWaitStrategy(Wait.forLogMessage(/Server running/))
      .start()

    await use(startedContainer)
    startedContainer
    await startedContainer.stop({ remove: true })
  },
  appUrl: async({app}, use) => {
    const port = app.getMappedPort(4000);
    await use(`http://localhost:${port}`)
  },
  seed: async({mongoDBContainer, expect}, use) => {
    await use(async (collection, ...data) => {
      var response = await mongoDBContainer.exec([
            "mongosh",
            "mongodb://test:test@localhost:27017/AS?authSource=admin&retryWrites=true&w=majority",
            "--eval",
            `db.${collection}.insertMany(${JSON.stringify(data)})`
      ]);

      if(response.exitCode != 0) {
        console.error(response)
      }

      expect(response.exitCode, "cannot seed database with data").toBe(0)
    })
  }
});