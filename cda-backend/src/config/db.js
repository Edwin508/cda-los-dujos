const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

// 1. Configuramos Neon para usar WebSockets (el estándar en servidores como Render)
neonConfig.webSocketConstructor = ws;

// 2. Render inyecta esta variable de forma nativa e infalible desde el segundo cero
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);

// 3. ¡Prisma 7 recibe su adaptador obligatorio!
const prisma = new PrismaClient({ adapter });

module.exports = prisma;

