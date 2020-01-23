<template></template>

<script>
const defaultIcon = {
  fillColor: "#ff0000",
  fillOpacity: 0.2,
  path: 0, // google.maps.SymbolPath.CIRCLE,
  scale: 8,
  strokeColor: "#ff0000",
  strokeWeight: 1.0
}

const emphasizedIcon = {
  fillColor: "#ff0000",
  fillOpacity: 0.6,
  path: 0, // google.maps.SymbolPath.CIRCLE,
  scale: 16,
  strokeColor: "#ff0000",
  strokeWeight: 2.0
}

export default {
  name: 'child-marker',
  props: {
    isEmphasized: Boolean,
    google: Object,
    map: Object,
    position: Object,
    hotel: Object,
    onClick: Function
  },
  data () {
    return { 
      marker: null,
      infoWindow: null
    }
  },
  mounted() {
    console.log("mounted")
    const { Marker } = this.google.maps
    console.log(this.isEmphasized)
    this.marker = new Marker({
      position: this.position,
      map: this.map,
      icon: this.isEmphasized ? emphasizedIcon : defaultIcon
    })
    this.marker.addListener('click', this.handleClick);
    this.infoWindow = new this.google.maps.InfoWindow({
      content: `<div>lat: ${this.position.lat}<br />lng: ${this.position.lng}<br />geohash: ${this.position.geohash}</div>`
    })
  },
  beforeDestroy () {
    console.log("beforeDestroy")
    this.marker.setMap(null);
  },
  methods: {
    handleClick() {
      this.infoWindow.open(this.map, this.marker)
      setTimeout(() => this.infoWindow.close(this.map, this.marker), 2000); 
      this.onClick(this.hotel)
    },
    handleChangeEmphasize() {
      console.log("handleChangeEmphasize")
    }
  }
}
</script>
