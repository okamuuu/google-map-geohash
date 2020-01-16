<template></template>
<script>
export default {
  name: 'child-marker',
  props: {
    google: Object,
    map: Object,
    position: Object
  },
  data (){
    return { 
      marker: null,
      infoWindow: null
    }
  },
  mounted(){
    const { Marker } = this.google.maps
    this.marker = new Marker({
      position: this.position,
      map: this.map,
    })
    this.marker.addListener('click', this.handleClick);
    this.infoWindow = new google.maps.InfoWindow({
      content: `<div>lat: ${this.position.lat}<br />lng: ${this.position.lng}<br />geohash: ${this.position.geohash}</div>`
    })
  },
  methods: {
    handleClick() {
      this.infoWindow.open(this.map, this.marker)
      setTimeout(() => this.infoWindow.close(this.map, this.marker), 2000); 
    } 
  }
}
</script>
