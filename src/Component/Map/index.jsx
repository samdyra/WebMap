import React, {
  memo, useEffect, useRef 
} from "react";
import Map, {
  MapProvider,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Marker,
  AttributionControl,
  Source,
  Layer,
} from "react-map-gl";
import polygon from "../../constants/Shapefiles/polygon";
import MarkerData from "../../constants/Shapefiles/marker";



const MapScreen = (props) => {
  const {
    baseMap, isPolygonShown, isMarkerShown, zoomCoord
  } = props;

  const mapRef = useRef(null)

  useEffect(() => {
    if (zoomCoord.length === 0) return
    mapRef.current?.flyTo({ center: zoomCoord, zoom: 10 })
  }, [ zoomCoord ])

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
        ref={mapRef}
      >
        <AttributionControl customAttribution="Made with love by Sam" style={{ color: "black" }}/>
        <NavigationControl position="bottom-right" />
        <FullscreenControl />
        <GeolocateControl />
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
      </Map>
    </MapProvider>
  );
};

export default memo(MapScreen);
