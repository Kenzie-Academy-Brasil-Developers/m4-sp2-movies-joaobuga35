import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { iMovies, moviesCreate, moviesResult } from "./interfaces";

export const createMovies = async (request: Request, response: Response): Promise<Response> => {
    try {
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
        
    } catch (error) {
        return response.status(409).json({message: 'Movie already exists.'})
    }
}

export const listAllMovies = async (request: Request, response: Response): Promise<Response> => {
    let perPage: any = request.query.perPage === undefined  ? 5 : request.query.perPage
    let page: any = request.query.perPage === undefined  ? 1 : request.query.page

    if (typeof page === 'string' || 0 > page) {
        page = 1
    }

    if (typeof perPage === 'string' || 0 > perPage) {
        perPage = 5
    }

    const query: string = `
        SELECT 
            *
        FROM 
            movies_favorites
        LIMIT $1 OFFSET $2
    `
    const queryConfig:QueryConfig = {
        text: query,
        values: [perPage,perPage * (page - 1)]
    }
    
    const queryResult:moviesResult = await client.query(queryConfig)
    console.log(queryResult)

    return response.status(200).json(queryResult.rows)
}