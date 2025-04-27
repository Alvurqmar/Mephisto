import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchCards() {
    try {
        const cards = await sql`SELECT * FROM cards`;
        return cards;
    } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue cards.');
}
}
