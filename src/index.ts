import app from './app';
import "./utils/database";
import { config } from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
config();

const port = process.env.PORT || '3000';

if (port === '3000') {
  app.listen(process.env.PORT, () => {
    console.log(`
    ----------------
    MATÍAS MANUEL GALEANO - TECLAB PP - SPORTSXLIFE
    ----------------
    Status: Running
    Mode: Development/HTTP
    Port: ${process.env.PORT}
    ----------------
    `);
  });
} else {
  const options = {
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`
    ----------------
    MATÍAS MANUEL GALEANO - TECLAB PP - SPORTSXLIFE
    ----------------
    Status: Running
    Mode: Production/HTTPS
    Port: ${process.env.PORT}
    ----------------
    `);
  });
}
