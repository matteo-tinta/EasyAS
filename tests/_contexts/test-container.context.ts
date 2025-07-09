import { MongoDBContainer, StartedMongoDBContainer } from "@testcontainers/mongodb";
import getPort from "get-port";
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { MongoClient } from "mongodb";
import { test as baseTest } from 'vitest';
import startAppAsync from '../../src/app';

interface CustomTestContainerContext {
  mongoDBContainer: StartedMongoDBContainer,
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  appPort: number;
  connectionString: string,
  client: MongoClient,
  appUrl: string;
}

export const composeTest = baseTest.extend<CustomTestContainerContext>({
  mongoDBContainer: async ({ }, use) => {
    var container = await new MongoDBContainer("mongo:8")
      .withLogConsumer((stream) => {
        stream.on("error", console.log)
      })
      .withExposedPorts(27017)
      .start()

    await use(container)
    await container.stop({ remove: true, removeVolumes: true })
  },
  server: async ({ appPort, connectionString }, use) => {
    console.log("connection_string", connectionString)
    process.env["DB_CONN_STRING"] = connectionString;

    var app = await startAppAsync();
    const server = createServer(app);

    server.listen(appPort);

    await use(server)
    server.close()
  },
  connectionString: async ({ mongoDBContainer }, use) => {
    await use(`${mongoDBContainer.getConnectionString()}/as?directConnection=true&authSource=admin&retryWrites=true&w=majority`)
  },
  client: async ({ connectionString }, use) => {
    var client = await new MongoClient(connectionString).connect()
    await use(client)
  },
  appPort: async ({ }, use) => await use(await getPort()),
  appUrl: async ({ appPort, server }, use) => await use(`http://localhost:${appPort}`),
});