import { Pool } from "pg";

declare global {
  var _postgresPool: Pool | undefined;
}

export {};
