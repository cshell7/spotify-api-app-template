import React, { useState } from "react";
import { useSpotityAPI } from "@c-shell/spotify-api-hook";

export const Page = () => {
  const { getUserAccessToken, isAuthed, error, fetchData } = useSpotityAPI();
  const redirectUri = "http://lvh.me:3000/";
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const scope = "user-read-recently-played"; // https://developer.spotify.com/documentation/general/guides/scopes

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [selectedSong, setSelectedSong] = useState();
  const [selectedSongInfo, setSelectedSongInfo] = useState();
  const [trackHistory, setTrackHistory] = useState();

  !!searchResults && console.log("Search results:", searchResults);
  !!selectedSongInfo && console.log("Song info:", selectedSongInfo);
  !!trackHistory && console.log("Track history:", trackHistory);

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
        <button onClick={() => getUserAccessToken({ redirectUri, scope })}>
          Auth
        </button>
      </>
    );
  else
    return (
      <>
        <button onClick={() => getUserAccessToken({ redirectUri, scope })}>
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
        <button
          onClick={() => {
            fetchData(`me/player/recently-played?limit=50`).then((data) =>
              setTrackHistory(data)
            );
          }}
        >
          Get your track history
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
        {!!selectedSongInfo && <h3>View console logs for song info</h3>}
        {!!trackHistory && <h3>View console logs for your track history</h3>}
      </>
    );
};
