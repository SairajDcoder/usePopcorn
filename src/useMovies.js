import { useState, useEffect } from "react";
const KEY = 'aaaede1c';

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(function () {
        const controller = new AbortController();

        async function handleIncomingMovies() {
            try {
                setError("");
                setIsLoading(true);
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });
                if (!res.ok) {
                    throw new Error("Something went wrong while fetching the movies!!");
                }
                const data = await res.json();


                if (data.Response === "False") {
                    throw new Error("Movie Not found")
                }

                setMovies(data.Search)
                setError("")
            }
            catch (err) {
                if (err.name !== "AbortError")
                    setError(err.message)
            }
            finally {
                setIsLoading(false);
            }


        }

        if (query.length < 3) {
            setMovies([]);
            setError('');
            return
        }
        // setSelectedId(null)
        handleIncomingMovies();

        return function () {
            controller.abort();
        }
    }, [query]);
    return { movies, isLoading, error }
}