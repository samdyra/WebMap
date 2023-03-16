import React, { memo } from "react";
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
    handleMapClick = () => {}, markerCoord, baseMap, handleRouteClick = () => {}, routeCoord, trackingMode, route, savedPoint, routeSaved,isPolygonShown,isMarkerShown , searchTerm
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
  const SearchPolygon = () => {
    if (!searchTerm || searchTerm.length === 0) {
      return [];
    }
    const searchKeys = new Set(searchTerm.map((item) => item.item.key));
    const result = polygon.features.filter((feature) => searchKeys.has(feature.properties.ID));
    return result;
  }




  const polygonColor = (status) => {
    if (status < 250 ) {
      return "#FD9D0D"
    }
    else if (250 < status && status < 500) {
      return "#0F9504"
    }
    else if ( status > 500) {
      return "#3CA1FF"
    }
  }



  
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
       
        {SearchPolygon().map((feature) => (
          
          <Source key={feature.id} id={feature.id} type="geojson" data={feature}>
            {console.log(feature.properties.users)}

            <Layer
              id={feature.id}
              type="fill"
              paint={{
                "fill-color": polygonColor(feature.properties.users),
                "fill-opacity": 0.85,
                "fill-outline-color": "rgba(0, 0, 0, 1)"
              }}
            />
          </Source>
        ))}
        

       
        { isPolygonShown && (
          <Source id="polygon-layer" type="geojson" data={polygon}>
            <Layer
              id="polygon-layer"
              type="fill"
              source="my-data"

              paint={{
                "fill-color": [ "case", [ "<", [ "get", "users" ], 250 ], "#FD9D0D",
                  [ "all", [ ">=", [ "get", "users" ], 250 ], [ "<", [ "get", "users" ], 500 ] ], "#0F9504",
                  [ "<=", [ "get", "users" ], 500 ], "#3CA1FF",
                  "#3CA1FF"
                ],
                "fill-opacity": 0.85,
                'fill-outline-color': 'rgba(0, 0, 0, 1)'
              
              
              }}
            />
          </Source>
        )}
        
        { isMarkerShown && MarkerData.features.map((el) => {
          return (
            <Marker latitude={el?.geometry.coordinates[1]} longitude={el?.geometry.coordinates[0]} offsetLeft={-20} offsetTop={-10} color={el?.properties.status === "done" ? "green" : el?.properties.status === "ongoing" ? 'yellow' : "red" }/>
          )
        })}
        
        

       

        
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
