import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Quemamos la URL aquí directamente. 
    // Prisma 7 la leerá sin importar lo que haga dotenvx.
    url: "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
  }
});