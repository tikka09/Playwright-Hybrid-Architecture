import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { config } from '../config/config';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const file = path.join(logsDir, 'serilog.json');
const dest = pino.destination({ dest: file, sync: false });

export const logger = pino({ level: config.logLevel }, dest);

export function serilogEntry(level: string, message: string, props?: Record<string, any>) {
  const entry = {
    Timestamp: new Date().toISOString(),
    Level: level.toUpperCase(),
    Message: message,
    Properties: props ?? {}
  };
  logger[level as pino.Level](entry);
}
