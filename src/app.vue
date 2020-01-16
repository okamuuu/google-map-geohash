<template>
  <div>
    <div id="map"></div>
    <template v-if="!!google && !!map">
      <child-marker 
        v-for="(marker,i) in markers"
        :key="i"
        :position="marker" 
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
import geohash from 'ngeohash'
import GoogleMapsApiLoader from 'google-maps-api-loader'

const items = [
 [ 35.692734, 139.703752 ], // 新宿ピカデリー
 [ 35.690157, 139.705896 ], // 新宿バルト9
 [ 35.695415, 139.702055 ], // 東宝シネマズ
 [ 35.692233, 139.703012 ], // 紀伊国屋書店
]

function getGeoHash(latitude, longitude, precision=9) {
  return geohash.encode(latitude, longitude, precision);
}

export default {
  data: function () {
    return {
      google: null,
      map: null,
      markers: items.map(x => ({
        lat: x[0],
        lng: x[1],
        geohash: getGeoHash(x[0], x[1]) 
      })),
      mapConfig: {
        zoom: 15,
        center: { lat: items[0][0], lng: items[0][1] }
      }
    }
  }, 
  mounted () {
    GoogleMapsApiLoader({
      libraries: ['places'],
    }).then((google) => {
      this.google = google
      const mapContainer = this.$el.querySelector('#map')
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig)
      this.initializeMap()
    })
  },
  methods: {
    initializeMap () {
      const mapContainer = this.$el.querySelector('#map')
      const { Map } = this.google.maps
      this.map = new Map(mapContainer, this.mapConfig)
    }
  }
}
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 800px;
}

p {
  font-size: 2em;
  text-align: center;
}
</style>
