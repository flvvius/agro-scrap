import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { env } from "~/env";
import * as schema from "./schema";

declare global {
  // cache across HMR in dev
  var __dbConn: Sql | undefined;
}

const connectionString = env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

// Pass the SSL flag and a tighter timeout
const connectionOptions = {
  ssl: { rejectUnauthorized: false },
  // max 5 simultaneous connections
  max: 5,
  // give up if we can’t connect in 5s
  timeout: 5,
};

const conn = global.__dbConn ?? postgres(connectionString, connectionOptions);

if (env.NODE_ENV !== "production") {
  global.__dbConn = conn;
}

export const db = drizzle(conn, { schema });
