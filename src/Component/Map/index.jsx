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
} from "react-map-gl";
import polygon from "../../constants/Shapefiles/polygon";
import MarkerData from "../../constants/Shapefiles/marker";

const MapScreen = (props) => {
  const {
    baseMap, isPolygonShown, isMarkerShown , searchTerm
  } = props;


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
    else {
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
      >
        <AttributionControl customAttribution="Made with love by Sam" style={{ color: "black" }}/>
        <NavigationControl position="bottom-right" />
        <FullscreenControl />
        <GeolocateControl />
        {SearchPolygon().map((feature) => (
          <Source key={feature.id} id={feature.id} type="geojson" data={feature}>
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
      </Map>
    </MapProvider>
  );
};

export default memo(MapScreen);
