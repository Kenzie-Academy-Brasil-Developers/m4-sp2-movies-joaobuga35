import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { moviesCreate, moviesResult } from "./interfaces";

export const verifyMovieNameExits = async (request: Request, response: Response, next:NextFunction): Promise<Response | void> => {
    const movieBody: moviesCreate = request.body

    const query: string = `
        SELECT
            *
        FROM 
            movies_favorites
        WHERE 
            name = $1;
    `

    const queryConfig: QueryConfig = {
        text: query,
        values: [movieBody.name]
    }

    const queryResult: moviesResult = await client.query(queryConfig)
    const movieName: moviesCreate = queryResult.rows[0]

    if (movieName) {
        return response.status(409).json({
            message: "Movie name already exists!"
        })
    }
    return next()
}

export const verifyMovieExists = async (request: Request, response: Response, next:NextFunction): Promise<Response | void> => {
    const id: number = parseInt(request.params.id)

    const query: string = `
        SELECT 
            *
        FROM 
            movies_favorites
        WHERE 
            id = $1;
    `

    const queryConfig: QueryConfig = {
        text: query,
        values: [id]
    }


    const queryResult:moviesResult = await client.query(queryConfig)

    if(!queryResult.rowCount){
        return response.status(404).json({
            message: 'Movie not found!'
        })
    }

    return next()
}