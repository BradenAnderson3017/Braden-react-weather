import { useEffect, useState } from "react";
import { useCityData } from "../App";
import TimeZoneClock from "./timezone";
import "./searchFunction.css";

export const timeDateContainer = (timeDateData, dispatch) => {
  const timeDateToTransfer = {
    timeZone: timeDateData.timeZone,
  };

  // Dispatch the time and date data to the context
  dispatch({ type: "GET_TIME_DATE", payload: timeDateToTransfer });

  // Return the data that needs to be updated in the state
  return timeDateToTransfer;
};

//getting the flag
function getFlagUrl(countryCode) {
  return `https://raw.githubusercontent.com/HatScripts/circle-flags/gh-pages/flags/${countryCode.toLowerCase()}.svg`;
}

function SearchFunction() {
  const [location, changeLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [id, setId] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: null,
    longitude: null,
    name: null,
    id: null,
  });
  const [timeZone, setTimeZone] = useState("");

  const { state, dispatch } = useCityData();

  function handleInput(event) {
    changeLocation(event.target.value);
  }

  function handleClick() {
    if (location !== "") {
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&language=en&format=json`
      )
        .then((response) => response.json())
        .then((json) => {
          setSearchResults(json.results);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem("appData")) || [];
   setActiveDotIndex(appData.activeDotIndex);
   setClickCount(appData.clickCount); 
   
  }, []);


  // Fetch the stored time zones from local storage
  const storedTimeZones = JSON.parse(localStorage.getItem("links")) || [];

  useEffect(() => {
    // Get the index of the current app component
    const currentIndex = storedTimeZones.findIndex((link, index) => {
      //console.log(link, link.name);
      if (index === activeDotIndex) {
        //console.log(storedTimeZones[activeDotIndex].timeZone)
        setTimeZone(storedTimeZones[activeDotIndex].timeZone);
      }
    });

   
  }, [storedTimeZones]);

  function chosenLocation(city) {
    const CityTimeZone = `${city?.timezone}`;
    setId(city.id);
    setTimeZone(CityTimeZone);
    console.log("timeZone: ", timeZone, CityTimeZone);
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      name: `${city.name}${city.admin1 ? `, ${city.admin1}` : ""}`,
      id: city.id,
    });
    dispatch({ type: "FETCH_DATA", payload: city });

    // Clear input value
    changeLocation("");
    // Clear search results
    setSearchResults([]);
  }
  return (
    <>
      <div className="searchData">
        <div className="searchBarContainer">
          <input
            placeholder={"Enter Location..."}
            onChange={handleInput}
            value={location}
          ></input>
          <button className="searchButton" onClick={handleClick}>
            Search
          </button>
        </div>
        <div className="cityNames">
          <ul className="ulContainer">
            {searchResults &&
              searchResults.map((city) => {
                const admins = [
                  city.admin1,
                  city.admin2,
                  city.admin3,
                  city.admin4,
                ]
                  .filter(Boolean)
                  .filter(
                    (value, index, self) => self.indexOf(value) === index
                  );

                if (admins.length > 0) {
                  const flagUrl = getFlagUrl(city.country_code); // Get flag URL here
                  return (
                    <li className="citiesToChoose" key={city.id}>
                      {flagUrl && (
                        <div className="flagContainer">
                          <img
                            className="flag"
                            src={flagUrl}
                            alt="Country Flag"
                          />
                        </div>
                      )}
                      <p>
                        {city.name}, {admins.join(", ")}
                      </p>
                      <button
                        className="add"
                        onClick={() => chosenLocation(city)}
                      >
                        +
                      </button>
                    </li>
                  );
                }

                return null;
              })}
          </ul>
        </div>
        {timeZone !== "" && <TimeZoneClock timeZone={timeZone} />}
      </div>
    </>
  );
}

export default SearchFunction;
