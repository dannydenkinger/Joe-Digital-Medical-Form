import { Client } from 'pg';

export async function getClient() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("Missing database connection string environment variable.");
  }

  const client = new Client({
    connectionString,
    // Add SSL to ensure connection to cloud databases succeeds
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  return client;
}

export async function initDb() {
  const client = await getClient();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        patientName VARCHAR(255),
        date VARCHAR(255),
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip VARCHAR(255),
        teamAndPlayerNumber VARCHAR(255),
        sport VARCHAR(255),
        location VARCHAR(255),
        timeOfInjury VARCHAR(255),
        typeOfInjury VARCHAR(255),
        areaOfBodyInjured VARCHAR(255),
        howInjuryOccurred VARCHAR(255),
        lostConsciousness VARCHAR(255),
        howLongConscious VARCHAR(255),
        firstAidCareGiven VARCHAR(255),
        comment TEXT,
        equipmentUsed VARCHAR(255),
        returnToPlay VARCHAR(255),
        advisedFurtherEvaluation VARCHAR(255),
        called911 VARCHAR(255),
        handedOffToEMS VARCHAR(255),
        emsAgency VARCHAR(255),
        transported VARCHAR(255),
        transportMethod VARCHAR(255),
        patientParentCoachSignature VARCHAR(255),
        patientParentOtherName VARCHAR(255),
        phoneNumber VARCHAR(255),
        emtSignature TEXT,
        emtName VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  } finally {
    await client.end();
  }
}
