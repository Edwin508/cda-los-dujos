// 1. Aplastamos cualquier intento de dotenvx inyectando la URL en la memoria central
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

// 2. Importamos el cliente nativo
const { PrismaClient } = require('@prisma/client');

// 3. El motor nativo en Rust se conecta usando la variable de memoria
const prisma = new PrismaClient();

module.exports = prisma;