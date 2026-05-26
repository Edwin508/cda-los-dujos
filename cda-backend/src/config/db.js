const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

// 1. Configuramos Neon para usar WebSockets en Render
neonConfig.webSocketConstructor = ws;

// 2. FUERZA BRUTA: Quemamos la URL. Adiós para siempre al problema del .env
const URL_SEGURA = "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

// 3. El pool ahora toma la variable quemada, nunca será undefined
const pool = new Pool({ connectionString: URL_SEGURA });
const adapter = new PrismaNeon(pool);

// 4. Prisma 7 recibe su adaptador
const prisma = new PrismaClient({ adapter });

module.exports = prisma;