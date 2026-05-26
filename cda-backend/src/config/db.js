const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

// 1. Soporte de WebSockets para Linux/Render
neonConfig.webSocketConstructor = ws;

// 2. LA TÁCTICA MAESTRA: Destruimos la variable fantasma que inyecta dotenvx
delete process.env.DATABASE_URL;

// 3. Al no existir la variable en el sistema, Neon está obligado a leer nuestra URL quemada
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
});

// 4. Conectamos Prisma 7 a través de su adaptador obligatorio
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;