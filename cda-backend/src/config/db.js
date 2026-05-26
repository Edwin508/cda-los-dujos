const { PrismaClient } = require('@prisma/client');
const { neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

// 1. Mantenemos el soporte de WebSockets para que funcione en Linux/Render
neonConfig.webSocketConstructor = ws;

// 2. EL GRAN CAMBIO DE PRISMA 7: Adiós al "Pool".
// La URL quemada va directa e inyectada en el nuevo adaptador de Neon.
const adapter = new PrismaNeon({
  connectionString: "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
});

// 3. Prisma recibe el adaptador con la conexión asegurada
const prisma = new PrismaClient({ adapter });

module.exports = prisma;