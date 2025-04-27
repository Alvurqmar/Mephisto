import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { cards, users  } from './database';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`DROP TABLE IF EXISTS users CASCADE;`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedCards() {
  const existingType = await sql`
  SELECT 1 FROM pg_type WHERE typname = 'card_type';
`;

if (existingType.length === 0) {
  await sql`
    CREATE TYPE card_type AS ENUM ('MONSTER', 'ITEM', 'WEAPON', 'SPELL');
  `;
}
    await sql`DROP TABLE IF EXISTS cards CASCADE;`;
    await sql`
    CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL,
    type card_type NOT NULL,
    cost INTEGER NOT NULL,
    attack INTEGER NOT NULL,
    durability INTEGER NOT NULL,
    effect VARCHAR(255) NOT NULL,
    soulPts INTEGER NOT NULL
  );
`;
   const insertedCards = await Promise.all(
    cards.map(async (card) => {
      return sql`
        INSERT INTO cards (name, type, cost, attack, durability, effect, soulPts)
        VALUES (${card.name}, ${card.type}::card_type, ${card.cost}, ${card.attack}, ${card.durability}, ${card.effect}, ${card.soulPts})
        ON CONFLICT DO NOTHING;
      `;
    }),
  );

  return insertedCards;
}

export async function GET() {
    try {
      const result = await sql.begin((sql) => [
        seedUsers(),
        seedCards(),
      ]);
  
      return Response.json({ message: 'La base de datos se ha creado correctamente, dirigete a localhost:3000 para volver al inicio' });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

  