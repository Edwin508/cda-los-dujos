const { PrismaClient } = require('@prisma/client');

// Prisma tomará automáticamente la variable DATABASE_URL del entorno de Render
const prisma = new PrismaClient();

module.exports = prisma;