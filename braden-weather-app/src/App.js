import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useReducer,
  useContext,
} from "react";
import { saveLinks } from "./components/utils";
import "./App.css";
import SearchFunction from "./components/searchFunction";
import WeekForecast from "./components/forecast";
import WeatherAPI from "./components/weatherData";

export const dataReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DATA":
      return {
        ...state,
        searchData: action.payload,
      };
    case "GET_FORECAST":
      return {
        ...state,
        forecastData: action.payload,
      };
    case "GET_TIME_DATE":
      return {
        ...state,
        timeDateData: action.payload,
      };
    default:
      return state;
  }
};

export const cityDataContext = createContext(null);

export const CityDataProvider = ({ children }) => {
  const initialState = {
    searchData: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <cityDataContext.Provider value={{ state, dispatch }}>
      {children}
    </cityDataContext.Provider>
  );
};

export const useCityData = () => {
  return useContext(cityDataContext);
};

export const appDataContext = createContext(null);

export const AppDataProvider = ({ children, index }) => {
  const initialState = {
    searchData: null,
    locationData: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <appDataContext.Provider value={{ state, dispatch }}>
      {children}
    </appDataContext.Provider>
  );
};

export const useAppData = () => {
  return useContext(appDataContext);
};

const AppInstance = ({ index }) => {
  return (
    <CityDataProvider>
      <div id={`app-${index}`} className="App">
        <div className="leftComponents">
          <SearchFunction />
          <WeekForecast />
        </div>
        <div className="rightComponents">
          <WeatherAPI />
        </div>
      </div>
    </CityDataProvider>
  );
};
function saveDotsAndClickCount(clickCount, activeDotIndex) {
  localStorage.setItem(
    "appData",
    JSON.stringify({ clickCount, activeDotIndex })
  );
}

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const dotsContainerRef = useRef(null);

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem("appData")) || {
      clickCount: 0,
      activeDotIndex: 0,
    };
  
    // Update the state with the retrieved clickCount
    setClickCount(appData.clickCount);
    setActiveDotIndex(0); // Set activeDotIndex to 0 when the component is mounted or reloaded
    saveDotsAndClickCount(appData.clickCount, 0); // Save activeDotIndex as 0
  }, []);

  // handling button to add location components
  function handleButtonClick() {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      saveDotsAndClickCount(newCount, activeDotIndex);
      saveLinks(newCount, activeDotIndex);
      return newCount;
    });
  }

  // clicking the dots and dot logic
  function handleDotClick(index) {
    setActiveDotIndex(index);
    const targetElement = document.getElementById(`app-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    console.log("Dot Clicked: Index -", index, "Active Dot Index -", activeDotIndex);
  }

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [clickCount]); 
  function handleScroll() {
    if (!dotsContainerRef.current) return;
  
    const scrollPosition = dotsContainerRef.current.scrollLeft;
    const appWidth = dotsContainerRef.current.querySelector(".App").offsetWidth;
  
    const activeIndex = Math.round(scrollPosition / appWidth);
  
    // Use the callback to ensure the latest state value
    setActiveDotIndex((prevIndex) => {
      if (prevIndex !== activeIndex) {
        saveDotsAndClickCount(clickCount, activeIndex);
      }
      return activeIndex;
    });
  }
  // handle user scrolling and updating current active dot


  // jsx return
  return (
    <>
      <div className="buttonDots">
        <div className="dots">
          {Array.from({ length: clickCount }, (_, index) => (
            <div
              key={index}
              className={`dot ${index === activeDotIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
        <div className="button">
          <input
            type="button"
            value={"Add Component"}
            onClick={handleButtonClick}
          ></input>
        </div>
      </div>
      <div className="locationsAdded" ref={dotsContainerRef}>
        <div className="locationsContainer">
          {[...Array(clickCount)].map((_, index) => (
            <AppInstance key={index} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
