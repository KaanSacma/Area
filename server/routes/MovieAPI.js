const movieRouter = require('express').Router();
const axios = require('axios');
require('dotenv').config();

movieRouter.get('/now-playing', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.themoviedb.org/3/movie/now_playing',
            {
                params: {
                    language: 'en-US',
                    page: 1,
                    sort_by: 'created_at.asc',
                },
                headers: {
                    Authorization: `Bearer ${ process.env.TMDB_TOKEN }`,
                    Accept: 'application/json',
                },
            }
        );
        const movieTitles = response.data.results.map((movie) => movie.title);
        const message = `There are ${ movieTitles.length } movies playing now:\n${ movieTitles.join('\n') }`;
        res.status(200).json({message: message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

movieRouter.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.themoviedb.org/3/movie/popular',
            {
                params: {
                    language: 'en-US',
                    page: 1,
                    sort_by: 'created_at.asc',
                },
                headers: {
                    Authorization: `Bearer ${ process.env.TMDB_TOKEN }`,
                    accept: 'application/json',
                },
            }
        );
        const movieTitles = response.data.results.map((movie) => movie.title);
        const message = `There are ${ movieTitles.length } popular movies:\n${ movieTitles.join('\n') }`;
        res.status(200).json({message: message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

movieRouter.get('/upcoming', async (req, res) => {
    try {
        const response = await axios.get(
            'https://api.themoviedb.org/3/movie/upcoming',
            {
                params: {
                    language: 'en-US',
                    page: 1,
                    sort_by: 'created_at.asc',
                },
                headers: {
                    Authorization: `Bearer ${ process.env.TMDB_TOKEN }`,
                    accept: 'application/json',
                },
            }
        );
        const moviesData = response.data.results.map((movie) => ({
            title: movie.title,
            release_date: movie.release_date,
        }));
        const message = `There are ${ moviesData.length } upcoming movies:\n${ moviesData.map((movie) => `${ movie.title } (${ movie.release_date })`).join('\n') }`;
        res.status(200).json({message: message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

movieRouter.get('/onTheater/:movie_name', async (req, res) => {
    const movieName = req.params.movie_name;
    try {
        const response = await axios.get(
            'https://api.themoviedb.org/3/movie/now_playing',
            {
                params: {
                    language: 'en-US',
                    page: 1,
                    sort_by: 'created_at.asc',
                },
                headers: {
                    Authorization: `Bearer ${ process.env.TMDB_TOKEN }`,
                    Accept: 'application/json',
                },
            }
        );
        const movieTitles = response.data.results.map((movie) => movie.title);
        const movie = movieTitles.find((title) => title.toLowerCase() === movieName.toLowerCase());
        if (!movie) {
            res.status(201).json({ message: `Movie ${ movieName } not found` });
            return;
        }
        const message = `Movie ${ movieName } is on theater`;
        res.status(200).json({message: message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = movieRouter;
