import express, { Application, json, Request, Response } from 'express';
import { startDatabase } from './database';
import { createMovies, editMovie, listAllMovies } from './logics';
import { verifyMovieExist } from './middlewares';


const app:Application = express()
app.use(json());

app.post('/movies', createMovies)
app.get('/movies',listAllMovies)
app.patch('/movies/:id', editMovie)
app.delete('/movies/:id')


app.listen(3000, async () => {
    await startDatabase()
    console.log("Server is running http://localhost:3000")
})

