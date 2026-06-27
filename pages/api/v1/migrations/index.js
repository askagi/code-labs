import { createRouter } from "next-connect";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { errorHandler } from "infra/controller";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(errorHandler);

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  dryRun: true,
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

// ----------- Handlers -------------
async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
