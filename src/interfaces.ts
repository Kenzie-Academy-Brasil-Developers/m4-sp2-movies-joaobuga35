import { QueryResult } from "pg";
import { string } from "pg-format";

export interface iMovies {
    id: number,
    name: string,
    description?: string | null,
    duration: number,
    price: number
};

export type moviesCreate = Omit<iMovies,'id'>;

export type moviesResult = QueryResult<iMovies>;

export interface allMoviesResult {
    previousPage?: string | null,
    nextPage?: string,
    count: number,
    data: Array<iMovies>
}
