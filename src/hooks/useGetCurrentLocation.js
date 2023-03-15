import React from 'react'

const useGetCurrentLocation = () => {
  // ---------- STATES ----------
  const [ coord, setCoord ] = React.useState({
    latitude: -6.902457,
    longitude: 107.639261,
  })

  // ---------- EFFECTS ----------
  React.useEffect(() => {
    getLocation()
  }, [])

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  // ---------- INITIAL FUNCTION ----------
  const successCallback = ({ coords }) => {
    const { latitude, longitude } = coords;
    setCoord({ latitude, longitude })
  };

  const errorCallback = (error) => {
    alert(error);
  };

  return [ coord ]
}

export default useGetCurrentLocation