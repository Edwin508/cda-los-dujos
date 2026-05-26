const { PrismaClient } = require('@prisma/client');

// Prisma nativo usará su propio motor de alto rendimiento.
// Leerá automáticamente la variable DATABASE_URL de tu panel de Render.
const prisma = new PrismaClient();

module.exports = prisma;