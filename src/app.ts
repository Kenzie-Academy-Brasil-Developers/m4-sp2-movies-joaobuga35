import express, { Application, json, Request, Response } from 'express';
import { startDatabase } from './database';
import { createMovies, deleteMovie, editMovie, listAllMovies } from './logics';
import { verifyMovieExists, verifyMovieNameExits } from './middlewares';


const app:Application = express()
app.use(json());

app.post('/movies',verifyMovieNameExits, createMovies)
app.get('/movies',listAllMovies)
app.patch('/movies/:id',verifyMovieExists,verifyMovieNameExits,editMovie)
app.delete('/movies/:id',verifyMovieExists,deleteMovie)


app.listen(3000, async () => {
    await startDatabase()
    console.log("Server is running http://localhost:3000")
})

