import * as path from "path";
import migrate from "migrate";

import stateStore from "../data/postgres-state-storage";

const migrationsDirectory = path.resolve(__dirname, "../src/migrations");

const [command] = process.argv.slice(2);

new Promise((resolve, reject) => {
  migrate.load(
    {
      stateStore,
      migrationsDirectory,
    },
    (err: Error, set: any) => {
      if (err) {
        reject(err);
      }

      if (typeof set[command] !== "function") {
        reject(new Error("Command is not a function"));
      }

      set[command]((err: Error) => {
        if (err) reject(err);
        resolve();
      });
    }
  );
})
  .then(() => {
    console.log(`migrations "${command}" successfully ran`);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.stack);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
