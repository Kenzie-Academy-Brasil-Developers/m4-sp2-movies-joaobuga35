import express, { Application, json, request, Request, response, Response } from 'express';

const app:Application = express()
app.use(json());

app.get('/purchaseList', (request: Request, response: Response): Response => {
    return response.status(200).json()
})

app.listen(3000, () => {
    console.log("Server is running http://localhost:3000")
})

