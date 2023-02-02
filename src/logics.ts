import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { iMovies, moviesCreate, moviesResult } from "./interfaces";

export const createMovies = async (request: Request, response: Response): Promise<Response> => {
    const movieCreateRequest: moviesCreate = request.body

    const queryString : string = `
            INSERT INTO 
            movies_favorites("name", description, duration, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `
            
    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(movieCreateRequest)
    }
            
    const queryResult:moviesResult = await client.query(queryConfig);
    const newMovie: iMovies = queryResult.rows[0]
    
    return response.status(201).json(newMovie)
}

export const listAllMovies = async (request: Request, response: Response): Promise<Response> => {
    const query: string = `
        SELECT 
        *
        FROM 
        movies_favorites;
    `
    const queryResult:moviesResult = await client.query(query)

    return response.status(200).json(queryResult.rows)
}