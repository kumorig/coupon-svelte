<script>
  let container
  let zoom = 12
  let center = { lat: 31.58597, lng: 130.557114 }
  let marker
  let map
  import { gmapsCoords } from './store'

  import { onMount } from 'svelte'

  onMount(async () => {
    map = new window.google.maps.Map(container, {
      zoom,
      center,
      disableDefaultUI: true,
    })
    marker = new window.google.maps.Marker({ map, position: center, draggable: true })
    window.google.maps.event.addListener(marker, 'dragend', function (event) {
      gmapsCoords.set({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    })
    gmapsCoords.subscribe((coords) => {
      if (coords.lat != marker.position.lat() && coords.lng != marker.position.lng()) {
        if (coords.lat === null || coords.lng === null) coords = { ...center }
        marker.setPosition(new window.google.maps.LatLng(coords.lat, coords.lng))
      }
    })
  })
</script>

<div class="full-screen" bind:this={container} />

<style>
  .full-screen {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }
</style>
