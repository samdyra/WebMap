import React from 'react'
import axios from 'axios'
import { MAPBOX_DIRECTION_API, MAPBOX_MASTER_API } from '../constants'
import { toast } from "react-toastify";



const useGetRoute = (profile="mapbox/driving", coordinate) => {
  const [ route, setRoute ] = React.useState('')
  const [ isHitApi, setIsHitApi ] = React.useState(false)
  const [ error, setError ] = React.useState('')
  const [ loading, setLoading ] = React.useState(true)

  const sourceCoord = `${coordinate[0]?.lng}%2C${coordinate[0]?.lat}`
  const destinyCoord = `${coordinate[1]?.lng}%2C${coordinate[1]?.lat}`
  const routeCoord = `${sourceCoord}%3B${destinyCoord}`

  const ENDPOINT = `${MAPBOX_DIRECTION_API}${profile}/${routeCoord}?alternatives=false&annotations=state_of_charge%2Cduration&geometries=geojson&language=en&overview=simplified&steps=true&access_token=${MAPBOX_MASTER_API}`

  React.useEffect(() => {
    if (coordinate.length === 2) {
      setIsHitApi(true)
    } else setIsHitApi(false)
  }, [ profile, coordinate ])

  React.useEffect(() => {
    if (isHitApi) {
      getRoute()
    }
  }, [ isHitApi, profile ])

  const getRoute = () => {
    axios.get(ENDPOINT)
      .then(res => {
        setRoute(res?.data?.routes)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
        toast("Something Went Wrong!", { type: "error" });
      })
  }
  
  return {
    route,
    error,
    loading,
  }
}

export default useGetRoute