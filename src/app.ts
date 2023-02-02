import express, { Application, json, Request, Response } from 'express';
import { startDatabase } from './database';
import { createMovies, listAllMovies } from './logics';


const app:Application = express()
app.use(json());

app.post('/movies', createMovies)
app.get('/movies',listAllMovies)


app.listen(3000, async () => {
    await startDatabase()
    console.log("Server is running http://localhost:3000")
})

