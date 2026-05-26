const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

// 1. Soporte de WebSockets para Linux/Render
neonConfig.webSocketConstructor = ws;

// 2. La URL blindada
const URL_SEGURA = "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

// 3. El adaptador oficial de Neon exigido por Prisma 7
const pool = new Pool({ connectionString: URL_SEGURA });
const adapter = new PrismaNeon(pool);

// 4. PrismaClient recibe su adaptador obligatorio
const prisma = new PrismaClient({ adapter });

module.exports = prisma;