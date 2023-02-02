import { QueryResult } from "pg";

export interface iMovies {
    id: number,
    name: string,
    description?: string,
    duration: number,
    price: number
};

export type moviesCreate = Omit<iMovies,'id'>;

export type moviesResult = QueryResult<iMovies>