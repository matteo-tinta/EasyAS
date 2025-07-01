import { createServer } from "http";
import startAppAsync from "./app";

export const server = async () => {
  var app = await startAppAsync();

  const server = createServer(app);

  server.listen(4000, () => {
    console.log(`Server running in 4000`);
  });
};
