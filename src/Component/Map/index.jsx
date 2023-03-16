import React, { memo, useRef } from "react";
import Map, {
  MapProvider,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Marker,
  AttributionControl,
  Source,
  Layer,
  Popup
} from "react-map-gl";
import polygon from "../../constants/Shapefiles/polygon";
import MarkerData from "../../constants/Shapefiles/marker";



const MapScreen = (props) => {
  const {
    handleMapClick = () => {}, markerCoord, baseMap, handleRouteClick = () => {}, routeCoord, trackingMode, route, savedPoint, routeSaved,isPolygonShown,isMarkerShown
  } = props;

  const handleClickMap = !trackingMode ? handleMapClick : handleRouteClick;
  const [ popupInfo, setPopupInfo ] = React.useState(null);
  const arrayedCoordinateTrack = routeSaved ? Object.values(routeSaved?.track || {}) : null

  const dataOne = {
    type: "Feature",
    properties: {},
    geometry: route[0]?.geometry
  };

  const dataTwo = {
    type: "Feature",
    properties: {},
    geometry: { coordinates: arrayedCoordinateTrack, type: "LineString" }
  }

  const myRef = useRef(null);


  
  return (
    <MapProvider>
      <Map
        initialViewState={{
          longitude: 107.550965,
          latitude: -6.899872,
          zoom: 5,
        }}
        mapboxAccessToken={baseMap.apiKey}
        style={{
          width: "100vw",
          height: "100vh",
        }}
        mapStyle={baseMap.url}
        
        attributionControl={false}
        onClick={(e) => handleClickMap(e)}
      >
        <AttributionControl customAttribution="Made with love by Sam X Datasintesa" style={{ color: "black" }}/>
        <NavigationControl position="bottom-right" />
        <FullscreenControl />
        <Marker latitude={markerCoord.lat} longitude={markerCoord.lng}/>
        <GeolocateControl />
        { isPolygonShown && (
          <Source id="polygon-layer" type="geojson" data={polygon}>
            <Layer
              id="polygon-layer"
              type="fill"
              source="my-data"
          
              paint={{
                "fill-color": "#2AA025",
                "fill-opacity": 0.85,
                'fill-outline-color': 'rgba(0, 0, 0, 1)'
              
              
              }}
            />
          </Source>
        )}
        { isMarkerShown && (
          <Source id="marker-layer" type="geojson" data={MarkerData} >
            <Layer
              id="marker-layer"
              type="symbol"
              source="my-data"
              ref={myRef}
          
              // paint={{
              //   "fill-color": "#2AA025",
              //   "fill-opacity": 0.85,
              //   'fill-outline-color': 'rgba(0, 0, 0, 1)'
              
              
              // }}
              filter={[ "==", "$type", "Point" ]}
              layout= {{
                "icon-image":  'marker', 'icon-size': 5, 'icon-allow-overlap': true 
              }

              }

            />
          </Source>
        )}
        

       

        
        {routeCoord && routeCoord.map((el) => {
          return (
            <Marker latitude={el?.lat} longitude={el.lng} offsetLeft={-20} offsetTop={-10} color="red"/>
          )
        })}
        {savedPoint && savedPoint?.data ? savedPoint?.data?.map((el) => {
          return (
            <Marker latitude={el?.latitude || 0} longitude={el?.longitude || 0} offsetLeft={-20} offsetTop={-10} color="yellow" onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(el);
            }} />
          )
        }): null}
        {route && (
          <Source id="polylineLayer" type="geojson" data={dataOne}>
            <Layer
              id="lineLayer"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "rgba(230, 0, 0, 1)",
                "line-width": 2
              }}
            />
          </Source>
        )}
        {routeSaved && (
          <Source id="polylineLayer" type="geojson" data={dataTwo}>
            <Layer
              id="lineLayer"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "rgba(0, 230, 0, 1)",
                "line-width": 2
              }}
            />
          </Source>
        )}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <a>
              {popupInfo?.nama}   &nbsp;
              {popupInfo?.namaTempat} 
            </a>
            <img width="100%" height="50%" src={popupInfo.image} />
          </Popup>
        )}
      </Map>
    </MapProvider>
  );
};

export default memo(MapScreen);
