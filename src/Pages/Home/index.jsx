import React, { useState } from "react";
import useGetCurrentLocation from "../../hooks/useGetCurrentLocation";
import {
  Sidebar,
  MapScreen,
  BaseMapPicker,
} from "../../Component";
import ReactSearchBox from "react-search-box";
import search_icon from "../../assets/search_icon.png";

import { MAPBOX_API_KEY_STREET } from "../../constants";
import useGetRoute from "../../hooks/useGetRoute";
import s from "./Home.module.scss";
import useLoadTrack from "../../hooks/useLoadTrack";
import { propinsiValues } from "../../constants/Shapefiles/polygon";

export default function HomeScreen() {
  // ---------- HOOKS ----------
  const [ trackingMode ] = useState(true);
  const [ routeCoord, setRouteCoord ] = useState([]);
  const [ profileRoute, ] = useState("mapbox/driving");
  const { route } = useGetRoute(profileRoute, routeCoord);
  const [ shownRoute, setShownRoute ] = useState(route);
  const [ coord ] = useGetCurrentLocation();
  const [ baseMap, setBaseMap ] = useState({
    url: "mapbox://styles/mapbox/streets-v12",
    sprite: "mapbox://sprites/mapbox/basic-v8",

    apiKey: MAPBOX_API_KEY_STREET,
  });
  const resPoint = useLoadTrack("dataSintesa")
  const [ , setIsModalShown ] = useState(false);
  const [ , setIsModalTutorialShown ] = useState(false);
  const [ isPolygonShown, setIsPolygonShown ] = useState(false);
  const [ isMarkerShown, setIsMarkerShown ] = useState(false);

  const activeLayerIndex = [];
  if (isPolygonShown) {
    activeLayerIndex.push(1);
  }
  else if (!isPolygonShown) {
    activeLayerIndex.filter((item) => item !== 1);
  }
  
  if (isMarkerShown) {
    activeLayerIndex.push(0);
  }
  else if (!isMarkerShown) {
    activeLayerIndex.filter((item) => item !== 0);
  }



  const handlePolygonShown = () => {
    setIsPolygonShown(!isPolygonShown);
  };

  const handleMarkerShown = () => {
    setIsMarkerShown(!isMarkerShown);
  };

  

  const [ markerCoord, setMarkerCoord ] = useState({
    lng: 0,
    lat: 0,
  });

  const [ , setCoordClick ] = useState({
    lng: coord.longitude,
    lat: coord.latitude,
  });


  // ---------- EFFECTS ----------
  React.useEffect(() => {
    setShownRoute(route);
  }, [ route ]);

  React.useEffect(() => {
    setIsModalTutorialShown(true)
  }, [ ]);

  // ---------- INTIAL FUNCTION ----------
  const handleMapClick = (e) => {
    setCoordClick(e.lngLat);
    setMarkerCoord(e.lngLat);

    setTimeout(() => {
      setIsModalShown(true);
    }, 700);
  };

  const clearMap = () => {
    setRouteCoord([]);
    setShownRoute([]);
  };

  

  const handleRouteClick = (e) => {
    if (routeCoord.length === 0) {
      return setRouteCoord([ e.lngLat ]);
    }
    if (routeCoord.length === 2) {
      return clearMap();
    }
    return setRouteCoord([ ...routeCoord, e.lngLat ]);
  };

  const searchIcon =
    (
      <img src={search_icon} alt="search" />
    )

  const [ searchTerm, setSearchTerm ] = useState([])

  const handleSearchClick = (record) => {
    setSearchTerm([ ...searchTerm, record ]);
  };


  const removeSearchTerm = (key) => {
    const newSearchTerm = searchTerm.filter((e) => e.item.key !== key);
    setSearchTerm(newSearchTerm);
  };

  // ---------- RENDER FUNCTION ----------
  return (
    <>
      <Sidebar
        pointClick={handleMarkerShown}
        polygonClick={handlePolygonShown}
        activeLayerIndexArray={activeLayerIndex}
        searchTerm={searchTerm}
        removeSearchTerm={removeSearchTerm}
        
      >
      </Sidebar>
      <div className={s.searchbar}>
        <ReactSearchBox
          placeholder="Search on map"
          data={propinsiValues}
          callback={(record) => console.log(record)}
          inputFontColor="#000"
          leftIcon={searchIcon}
          iconBoxSize="50px"
          onSelect={handleSearchClick}

        />
      </div>
      <MapScreen
        coord={coord}
        handleMapClick={handleMapClick}
        markerCoord={markerCoord}
        baseMap={baseMap}
        handleRouteClick={handleRouteClick}
        routeCoord={routeCoord}
        trackingMode={trackingMode}
        route={shownRoute}
        savedPoint={resPoint}
        isPolygonShown={isPolygonShown}
        isMarkerShown={isMarkerShown}
        searchTerm={searchTerm}
      />
      <BaseMapPicker setBaseMap={setBaseMap} />
    </>
  );
}
