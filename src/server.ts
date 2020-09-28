import { Server } from "http";
import * as helmet from "helmet";
import * as morgan from "morgan";
import * as express from "express";
import * as clientSession from "client-sessions";

import api from "./api";
import config from "./config";

const app = express();

app.get("/", (_, response) => response.sendStatus(200));
app.get("/health", (_, response) => response.sendStatus(200));

app.use(morgan("short"));
app.use(express.json());
app.use(
  clientSession({
    cookieName: "session",
    secret: config.SESSION_SECRET,
    duration: 24 * 60 * 60 * 1000,
  })
);
app.use(helmet());

app.use(api);

let server: Server;
export default {
  start(port: number | string) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  },
};
