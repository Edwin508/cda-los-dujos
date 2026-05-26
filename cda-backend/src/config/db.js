// 1. Sobreescribimos la variable de entorno a la fuerza en la memoria RAM de Node
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require";

// 2. Importamos el Prisma original
const { PrismaClient } = require('@prisma/client');

// 3. Prisma 7 leerá automáticamente la variable que le acabamos de obligar a ver
const prisma = new PrismaClient();

module.exports = prisma;