import { Client } from "pg";

export const client: Client = new Client({
    user: 'joaob',
    password: '1234',
    host: 'localhost',
    database: 'movies',
    port: 5432
})

export const startDatabase = async ():Promise<void> => {
    await client.connect()
    console.log('DATABASE CONNECT!')
}