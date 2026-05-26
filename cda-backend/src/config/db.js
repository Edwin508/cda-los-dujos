const { PrismaClient } = require('@prisma/client');

// Ya no necesita adaptadores. Prisma leerá el prisma.config.ts automáticamente.
const prisma = new PrismaClient();

module.exports = prisma;