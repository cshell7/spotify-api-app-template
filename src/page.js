import React, { useState } from "react";
import { useSpotityAPI } from "./hooks/use-spotify-api";

export const Page = () => {
  const { getUserAccessToken, isAuthed, error, fetchData } = useSpotityAPI();
  const redirectUri = "http://lvh.me:3000/";
  const clientId = process.env.REACT_APP_CLIENT_ID;

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [selectedSong, setSelectedSong] = useState();
  const [selectedSongInfo, setSelectedSongInfo] = useState();

  !!searchResults && console.log("Search results:", searchResults);
  !!selectedSongInfo && console.log("Song info:", selectedSongInfo);

  if (!clientId)
    return (
      <>
        <p>
          No clientId, go to{" "}
          <a href="https://developer.spotify.com/documentation/general/guides/app-settings/">
            here
          </a>{" "}
          for instructions on how to get a clientId then add it to your .env
          file
        </p>
      </>
    );
  else if (error)
    return (
      <>
        <h1>Something Bad Happened!</h1>
        <p>{error.message}</p>
        <a href={error.link}>{error.code}</a>
      </>
    );
  else if (!isAuthed)
    return (
      <>
        <button onClick={() => getUserAccessToken({ redirectUri })}>
          Auth
        </button>
      </>
    );
  else
    return (
      <>
        <button onClick={() => getUserAccessToken({ redirectUri })}>
          Reauth
        </button>
        <input
          placeholder="search for a song"
          value={searchInputValue}
          onChange={({ target }) => setSearchInputValue(target.value)}
        />
        <button
          onClick={() => {
            fetchData(
              `search?q=${encodeURIComponent(searchInputValue)}&type=track`
            ).then(({ tracks }) => setSearchResults(tracks));
          }}
          disabled={!searchInputValue}
        >
          Search
        </button>
        <button
          onClick={() => {
            fetchData(`audio-analysis/${selectedSong}`).then((data) =>
              setSelectedSongInfo(data)
            );
          }}
          disabled={!selectedSong}
        >
          Get song info
        </button>
        <a href="https://developer.spotify.com/documentation/web-api/reference/">
          API endpoints reference
        </a>
        <div>
          {!!searchResults?.items &&
            searchResults?.items.map(({ name, id }) => {
              return (
                <div key={id} onClick={() => setSelectedSong(id)}>
                  {selectedSong === id && "--"}
                  {name}
                </div>
              );
            })}
        </div>
        {!!selectedSongInfo && <p>View console logs for song info</p>}
      </>
    );
};
