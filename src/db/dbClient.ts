// src/db/dbClient.ts
import { config } from '../config/config';
import mysql from 'mysql2/promise';

/**
 * queryDb - runs a query against configured DB.
 * If config.db.type === 'mock', returns sample rows for POC without needing a real DB.
 *
 * Note:
 *  - We require 'mssql' at runtime only when DB type is 'mssql' to avoid TypeScript
 *    compile-time type issues when @types/mssql is not installed.
 */
export async function queryDb(query: string) {
  if (config.db.type === 'mock') {
    // Return mock rows for demonstration
    console.log('[dbClient] Running in MOCK mode. Query:', query);
    // Simple username check pattern (POC)
    if (/from\s+users\s+where\s+username\s*=\s*'([^']+)'/i.test(query)) {
      const match = query.match(/username\s*=\s*'([^']+)'/i);
      const username = match ? match[1] : 'unknown';
      if (username === 'standard_user') {
        return [{ id: 1, username: 'standard_user', password: 'secret_sauce' }];
      }
      return [];
    }
    // default mock response
    return [{ mock: true }];
  }

  if (config.db.type === 'mysql') {
    const pool = await mysql.createPool({
      host: config.db.mysql.host,
      port: config.db.mysql.port,
      user: config.db.mysql.user,
      password: config.db.mysql.password,
      database: config.db.mysql.database
    });
    try {
      const [rows] = await pool.query(query);
      return rows;
    } finally {
      try {
        await pool.end();
      } catch (e) {
        // ignore pool close errors in POC
        // console.warn('Error closing mysql pool', e);
      }
    }
  }

  // MSSQL branch (dynamic require to avoid compile-time type issues)
  if (config.db.type === 'mssql') {
    // require at runtime
    const mssql: any = require('mssql');

    // Ensure config values are strings (prevent undefined errors)
    const mssqlConfig = {
      server: String(config.db.mssql.server ?? ''),
      user: String(config.db.mssql.user ?? ''),
      password: String(config.db.mssql.password ?? ''),
      database: String(config.db.mssql.database ?? ''),
      options: config.db.mssql.options ?? {}
    };

    // Connect and query
    let pool: any;
    try {
      pool = await mssql.connect(mssqlConfig);
      const result = await pool.request().query(query);
      return result && result.recordset ? result.recordset : [];
    } finally {
      // Some versions expose pool.close(), some require disconnecting by calling close on the pool.
      try {
        if (pool && typeof pool.close === 'function') {
          await pool.close();
        } else if (mssql && typeof mssql.close === 'function') {
          await mssql.close();
        }
      } catch (err) {
        // ignore cleanup errors for POC
        // console.warn('Error closing mssql connection', err);
      }
    }
  }

  // Unsupported DB type
  throw new Error(`Unsupported DB type: ${config.db.type}`);
}
