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
      id: null,
      marker: null,
      infoWindow: null
    }
  },
  mounted() {
    console.log("mounted")
    const { Marker } = this.google.maps
    this.marker = new Marker({
      position: this.position,
      map: this.map,
      icon: this.isEmphasized ? emphasizedIcon : defaultIcon
    })
    this.marker.addListener('click', this.handleClick);
    this.id = this.position.hotel.id
    this.geohash = this.position.geohash
    this.infoWindow = new this.google.maps.InfoWindow({
      content: `<div>name: ${this.position.name}</div>`
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
      this.onClick({id: this.id, geohash: this.geohash})
    },
    handleChangeEmphasize() {
      console.log("handleChangeEmphasize")
    }
  }
}
</script>
