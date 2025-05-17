import { Server } from "http";
import app from "./app";
import config from "./config";

const port = config.port;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  const exitHandler = async () => {
    if (server) {
      server.close(() => {
        console.log("Server close");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}
main();
