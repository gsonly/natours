export default locations => {
  const token =
    'pk.eyJ1IjoidHIxbSIsImEiOiJja2ttcGZjaHUyaHU2MnZuN212Z2U5cHdzIn0.1zv94vl_Z0WdEe7MSmu8Vw'

  mapboxgl.accessToken = token

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/tr1m/ckkmpj8cy4z9o17o6qmvsw7t2',
    scrollZoom: false,
  })

  const bounds = new mapboxgl.LngLatBounds()

  const markerHeight = 50,
    markerRadius = 10,
    linearOffset = 25
  const popupOffsets = {
    top: [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    bottom: [0, -markerHeight],
    'bottom-left': [
      linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    'bottom-right': [
      -linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  }

  locations.forEach(l => {
    const marker = new mapboxgl.Marker({
      anchor: 'bottom',
      color: 'mediumseagreen',
    })
      .setLngLat(l.coordinates)
      .addTo(map)

    const popup = new mapboxgl.Popup({
      offset: popupOffsets,
      closeOnClick: false,
      closeOnMove: false,
    })
      .setLngLat(l.coordinates)
      .setHTML(`Day: ${l.day} - ${l.description}`)
      .setMaxWidth('300px')
      .addTo(map)

    bounds.extend(l.coordinates)
  })

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 200, left: 15, right: 5 },
  })
}
