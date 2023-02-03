import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { allMoviesResult, iMovies, moviesCreate, moviesResult } from "./interfaces";

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
    if (!request.query.page && !request.query.perPage) {
        
        const query: string = `
            SELECT 
                *
            FROM 
                movies_favorites
        `
        const queryResult:moviesResult = await client.query(query)
        return response.status(200).json(queryResult.rows)
    }

    let page : number = Number(request.query.page) || 1
    let perPage : number = Number(request.query.perPage) || 5

    if (0 > page) {
        page = 1
    }

    if (0 > perPage || perPage > 5) {
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

    const baseUrl: string = 'http://localhost:3000/movies'
    const prevPage:string | null = page === 1 ? null : `${baseUrl}?page=${page - 1}&perPage=${perPage}`
    const nextPage: string = `${baseUrl}?page=${page + 1}&perPage=${perPage}`

    const listMoviesResult: allMoviesResult = {
        previousPage: prevPage,
        nextPage: nextPage,
        count: queryResult.rowCount,
        data:[...queryResult.rows]
    }
    return response.status(200).json(listMoviesResult)
}