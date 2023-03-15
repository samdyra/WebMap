import React, { useState } from "react";
import useGetCurrentLocation from "../../hooks/useGetCurrentLocation";
import {
  Sidebar,
  PressComponent,
  ControlPanel,
  Modal,
  MapScreen,
  BaseMapPicker,
  ModalTrack,
  Tweet,
  ModalTutorial,
  Help
} from "../../Component";
import { MAPBOX_API_KEY_STREET } from "../../constants";
import useGetRoute from "../../hooks/useGetRoute";
import s from "./Home.module.scss";
import { toast } from "react-toastify";
import useLoadTrack from "../../hooks/useLoadTrack";

export default function HomeScreen() {
  // ---------- HOOKS ----------
  const [ trackingMode, setTrackingMode ] = useState(true);
  const [ panelModeControl, setPanelModeControl ] = useState("control");
  const [ routeCoord, setRouteCoord ] = useState([]);
  const [ routeSaved, setRouteSaved ] = useState([]);
  const [ profileRoute, setProfileRoute ] = useState("mapbox/driving");
  const { route } = useGetRoute(profileRoute, routeCoord);
  const [ dataModalTrack, setDataModalTrack ] = useState([]);
  const [ shownRoute, setShownRoute ] = useState(route);
  const [ coord ] = useGetCurrentLocation();
  const [ baseMap, setBaseMap ] = useState({
    url: "mapbox://styles/mapbox/streets-v11",
    apiKey: MAPBOX_API_KEY_STREET,
  });
  const res = useLoadTrack()
  const resPoint = useLoadTrack("dataSintesa")
  const [ isModalShown, setIsModalShown ] = useState(false);
  const [ isModalTrackShown, setIsModalTrackShown ] = useState(false);
  const [ isModalTutorialShown, setIsModalTutorialShown ] = useState(false);

  const [ markerCoord, setMarkerCoord ] = useState({
    lng: 0,
    lat: 0,
  });

  const [ coordClick, setCoordClick ] = useState({
    lng: coord.longitude,
    lat: coord.latitude,
  });

  const isControl = panelModeControl === "control";
  const isSave = panelModeControl === "save";

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

  const handlePanelClick = (value) => {
    setPanelModeControl(value);
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

  const handleTrackingMode = () => {
    setTrackingMode(!trackingMode);
  };

  const handleProfileRoute = (data) => {
    setProfileRoute(data);
  };

  const handleSaveRoute = (value) => {
    if (!value) {
      return toast("Create a Track First!", { type: "warning" });
    }
    setDataModalTrack(value);
    setIsModalTrackShown(true);
  }

  const onClickTrack = (data) => {
    setRouteSaved(data)
  }

  const showModalTutorial = () => {
    setIsModalTutorialShown(true)
  }

  // ---------- UI VARIABLES ----------
  const Panel = () => {
    if (panelModeControl === "control") {
      return (
        <ControlPanel
          routeCoord={routeCoord}
          clearMap={clearMap}
          route={route}
          handlePanelClick={handlePanelClick}
          panelModeControl={panelModeControl}
          handleProfileRoute={handleProfileRoute}
          profileRoute={profileRoute}
          handleSaveRoute={handleSaveRoute}
        />
      );
    }

    // TO DO: REFACTOR LATER
    return (
      <div className={s.wrapper}>
        <div
          style={{ display: "flex", alignItems: "center" }}
          className={s.nav}
        >
          <div
            className={isControl ? s.control : s.title}
            onClick={() => handlePanelClick("control")}
          >
            Control Panel &nbsp;|{" "}
          </div>
          <div
            className={isSave ? s.control : s.title}
            onClick={() => handlePanelClick("save")}
          >
            &nbsp; Saved Data
          </div>
        </div>
        <div>Saved Track Data</div>
        <div style={{fontSize: 13}}>(Click Image to see the Route that were saved)</div>
        {res && res?.data?.map((item) => {
          return (
            <Tweet item={item} type={"track"} onClickTrack={onClickTrack}/>
          )
        })}
        <div>Saved Point Data</div>
        <div style={{fontSize: 13}}>(All Points are automatically shown, without clicking. Click the points on the map to see details)</div>
        {resPoint && resPoint?.data?.map((item) => {
          return (
            <Tweet item={item} type="dataSintesa" />
          )
        })}
      </div>
    );
  }

  // ---------- RENDER FUNCTION ----------
  return (
    <>
      <Modal
        open={isModalShown}
        coord={coordClick}
        onClose={() => setIsModalShown(false)}
      />
      <ModalTrack 
        open={isModalTrackShown}
        coord={dataModalTrack}
        onClose={() => setIsModalTrackShown(false)}
      />
      <ModalTutorial 
        open={isModalTutorialShown}
        onClose={() => setIsModalTutorialShown(false)}
      />
      <Sidebar>
        <Panel />
      </Sidebar>
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
        // savedTrack={res}
        routeSaved={routeSaved}
      />
      <PressComponent
        handleTrackingMode={handleTrackingMode}
        trackingMode={trackingMode}
      />
      <Help showModalTutorial={showModalTutorial}/>
      <BaseMapPicker setBaseMap={setBaseMap} />
    </>
  );
}
