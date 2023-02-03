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

export interface allMoviesResult {
    previousPage?: string | null,
    nextPage?: string,
    count: number,
    data: Array<iMovies>
}