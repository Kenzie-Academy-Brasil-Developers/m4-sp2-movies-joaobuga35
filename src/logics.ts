import { request, Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { allMoviesResult, iMovies, moviesCreate, moviesResult } from "./interfaces";

export const createMovies = async (request: Request, response: Response): Promise<Response> => {
    try {
        const movieCreateRequest: moviesCreate = request.body
        const moviesCreateKeys: Array<string> = Object.keys(request.body)
        const moviesCreateValues: any = Object.values(request.body)

        if (movieCreateRequest.description === null) {
            movieCreateRequest.description = null
        }
    
        const queryString : string = format(`
            INSERT INTO 
                movies(%I)
            VALUES 
                (%L)
            RETURNING *;
        `,moviesCreateKeys,moviesCreateValues)
                
        const queryResult:moviesResult = await client.query(queryString);

        return response.status(201).json(queryResult.rows[0])
        
    } catch (error) {
        return response.status(500).json({message: 'Internal Server Error.'})
    }
}

export const listAllMovies = async (request: Request, response: Response): Promise<Response> => {
    if (!request.query.page && !request.query.perPage && request.query.sort && request.query.order) {
        const query: string = format(`
            SELECT 
                *
            FROM
                movies
            ORDER BY
                %I %s;
        `,`${request.query.sort}`,`${request.query.order}`)

        const queryResult:moviesResult = await client.query(query)
        return response.status(200).json(queryResult.rows)
    }

    if (!request.query.page && !request.query.perPage) {
        
        const query: string = `
            SELECT 
                *
            FROM 
                movies
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

    let baseUrl: string = 'http://localhost:3000/movies'
    let prevPage:string | null = page === 1 ? null : `${baseUrl}?page=${page - 1}&perPage=${perPage}`
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`


    if (request.query.sort && !request.query.order) {
            const query: string = format(`
                SELECT 
                    *
                FROM
                    movies
                ORDER BY
                    %I ASC
                LIMIT %L OFFSET %L;
        `,`${request.query.sort}`,`${perPage}`,`${perPage * (page - 1)}`)

        const queryResult:moviesResult = await client.query(query)
        

        if (queryResult.rowCount === 0 || queryResult.rowCount < 5) {
            nextPage = null
        }

        const listMoviesResult: allMoviesResult = {
            previousPage: prevPage,
            nextPage: nextPage,
            count: queryResult.rowCount,
            data:[...queryResult.rows]
        }
        return response.status(200).json(listMoviesResult)

    }
    
    let sort =  typeof request.query.sort === "string" ? request.query.sort.toLowerCase() : undefined
    let order: string = request.query.order === "DESC" || request.query.order === "desc" ? request.query.order.toUpperCase() : "ASC" 

    if (sort !== "price" && sort !== "duration") {
        const query: string = format(`
            SELECT 
                *
            FROM
                movies
            LIMIT %L OFFSET %L;
        `,`${perPage}`,`${perPage * (page - 1)}`)

        const queryResult:moviesResult = await client.query(query)

        if (queryResult.rowCount === 0 || queryResult.rowCount < 5) {
            nextPage = null
        }

        const listMoviesResult: allMoviesResult = {
            previousPage: prevPage,
            nextPage: nextPage,
            count: queryResult.rowCount,
            data:[...queryResult.rows]
        }

        return response.status(200).json(listMoviesResult)
    }
    
    if (!request.query.sort && !request.query.order || !request.query.sort && request.query.order || !sort) {
        const query: string = format(`
            SELECT 
                *
            FROM
                movies
            LIMIT %L OFFSET %L;
        `,`${perPage}`,`${perPage * (page - 1)}`)

        const queryResult:moviesResult = await client.query(query)

        if (queryResult.rowCount === 0 || queryResult.rowCount < 5) {
            nextPage = null
        }

        const listMoviesResult: allMoviesResult = {
            previousPage: prevPage,
            nextPage: nextPage,
            count: queryResult.rowCount,
            data:[...queryResult.rows]
        }

        return response.status(200).json(listMoviesResult)
    }

    const query: string = format(`
        SELECT 
            *
        FROM
            movies
        ORDER BY
            %I %s
        LIMIT %L OFFSET %L;
    `,`${sort}`,`${order}`,`${perPage}`,`${perPage * (page - 1)}`)

    const queryResult:moviesResult = await client.query(query)

    if (queryResult.rowCount === 0 || queryResult.rowCount < 5) {
        nextPage = null
    }

    const listMoviesResult: allMoviesResult = {
        previousPage: prevPage,
        nextPage: nextPage,
        count: queryResult.rowCount,
        data:[...queryResult.rows]
    }
    return response.status(200).json(listMoviesResult)
}

export const editMovie =  async (request:Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id)
    const movieKeys: Array<string> = Object.keys(request.body)
    const movieValues: any = Object.values(request.body)

    const query: string = `
        UPDATE
            movies
        SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `

    const queryFormat: string = format(query,movieKeys,movieValues)

    const queryConfig: QueryConfig = {
        text: queryFormat,
        values:[id]
    }

    const queryResult: moviesResult = await client.query(queryConfig)
    return response.status(200).json(queryResult.rows[0])
}

export const deleteMovie =  async (request:Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id)

    const query: string = `
        DELETE FROM movies WHERE id = $1
    `

    const queryConfig: QueryConfig = {
        text: query,
        values: [id]
    }

    await client.query(queryConfig)
    return response.status(204).json()
}