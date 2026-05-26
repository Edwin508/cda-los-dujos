const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_X2HWJzfVyJK1@ep-little-sound-apled613-pooler.c-7.us-east-1.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false // Esto evita cualquier bloqueo de certificados en Render
  }
});

module.exports = pool;