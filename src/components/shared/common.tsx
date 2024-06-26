"use client";
import React, { useEffect, useState } from "react";
import {
  fetchGenres,
  getMoviesByGenres,
  getPopularMoviesAndShows,
  getTopRatedMoviesAndShows,
  getTrendingMoviesAndShows,
} from "@/lib/api";
import { CommonDataType, GenresTypes } from "@/types";
import Carousel from "./carousel";
import Loader from "./loader";

const Common = ({ type = "movie" }: { type?: string }) => {
  const [genres, setGenres] = useState<GenresTypes[]>([]);
  const [data, setData] = useState<CommonDataType[]>([]);
  useEffect(() => {
    const getGenres = async () => {
      const response = await fetchGenres(type);
      setGenres(response);
    };
    getGenres();
  }, []);

  useEffect(() => {
    const getDataByGenres = async () => {
      try {
        const promisesAllMovie = genres.map(async (item) => {
          const moviesByGenres = await getMoviesByGenres(type, item.id);
          return { data: moviesByGenres, genre: item };
        });

        const allMovies = await Promise.all(promisesAllMovie);
        const [topRated, popular, trending] = await Promise.all([
          getTopRatedMoviesAndShows(type),
          getPopularMoviesAndShows(type),
          getTrendingMoviesAndShows(type),
        ]);

        setData([
          { title: "Our genres", genre: "genre", data: allMovies },
          { title: "Top Rated", genre: "", data: topRated },
          { title: "Popular", genre: "", data: popular },
          { title: "Trending", genre: "", data: trending },
        ]);
      } catch (error) {
        console.log(error);
      }
    };
    if (genres.length > 0) {
      getDataByGenres();
    }
  }, [genres]);

  console.log(data);

  return (
    <div className="w-full border relative border-[#252525] rounded-md p-5 mt-36 pb-16">
      <div className=" absolute -top-4 p-1 rounded-md px-5 bg-[#E40000] text-white">
        {type == "tv" ? "Shows" : "Movies"}
      </div>
      {data.length > 0 ? (
        data.map((item, index) => (
          <Carousel
            key={index}
            title={item.title}
            data={item.data as any}
            genre={item.genre}
            type={type}
          />
        ))
      ) : (
        <div className=" relative mb-20 flex items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Common;
