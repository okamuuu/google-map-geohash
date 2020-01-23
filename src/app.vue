<template>
  <div>
    <div class="container">
      <div class="notification">
        Google Map GeoHash
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column">
          <div id="map"></div>
          <template v-if="!!google && !!map">
            <child-marker 
              v-for="(marker,i) in markers"
              :key="`marker:${i}`"
              :isEmphasized="false"
              :position="marker" 
              :google="google"
              :map="map"
              :hotel="marker.hotel"
              :onClick="handleClickMarker"
            />
          </template>
          <template v-if="!!google && !!map">
            <child-marker 
              v-for="(marker,i) in emphasizedMarkers"
              :key="`emphasizedMarkers:${i}`"
              :isEmphasized="true"
              :position="marker" 
              :google="google"
              :map="map"
              :hotel="marker.hotel"
              :onClick="handleClickMarker"
            />
          </template>
        </div>
        <!--
        <div class="column">
          xx
        </div>
        -->
      </div>
    </div>
    <div class="container">
      <footer class="footer">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import "babel-polyfill";
import axios from 'axios'
import geohash from 'ngeohash'
import GoogleMapsApiLoader from 'google-maps-api-loader'

const API_BASE_URL = window.location.origin === 'http://localhost:3000/' ? 'http://localhost:3000/api' : 'https://v8y3c9vp2c.execute-api.ap-northeast-1.amazonaws.com/dev/api'

const items = [
 [ 35.692734, 139.703752 ], // 新宿ピカデリー
 [ 35.690157, 139.705896 ], // 新宿バルト9
 [ 35.695415, 139.702055 ], // 東宝シネマズ
 [ 35.692233, 139.703012 ], // 紀伊国屋書店
]

function getGeoHash(latitude, longitude, precision=5) {
  return geohash.encode(latitude, longitude, precision);
}

export default {
  data: function () {
    return {
      google: null,
      map: null,
      selectedHotels: {},
      markers: [],
      emphasizedMarkers: [],
      mapConfig: {
        zoom: 15,
        center: { lat: 35.692734, lng: 139.703752 }
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
    async initializeMap () {
      const mapContainer = this.$el.querySelector('#map')
      const { Map } = this.google.maps
      this.map = new Map(mapContainer, this.mapConfig)

      const { data } = await axios.get(`${API_BASE_URL}/hotels`)
      this.hotels = data
      this.markers = this.hotels.map(hotel => ({
        isEmphasized: false,
        name: hotel.name,
        lat: Number(hotel.latitude),
        lng: Number(hotel.longitude),
        geohash: hotel.geohash,
        hotel: hotel
      }))
    },
    async handleClickMarker(hotel) {

      const { data } = await axios.get(`${API_BASE_URL}/locations/${hotel.geohash}`)
      const { geohashList, hotels } = data

      this.geohashList = geohashList
      this.geohashList.forEach(geohash => {
        this.drawGeohashArea(geohash, 0.2)
      })
      
      const foundHotels = {} 
      hotels.forEach(hotel => {
        foundHotels[hotel.id] = true
      })

      const markers = []
      const emphasizedMarkers = []
      this.hotels.forEach(hotel => {
        if (foundHotels[hotel.id]) {
          emphasizedMarkers.push({
            isEmphasized: true,
            name: hotel.name,
            lat: Number(hotel.latitude),
            lng: Number(hotel.longitude),
            geohash: hotel.geohash,
            hotel: hotel
          })
        } else {
          markers.push({isEmphasized: false,
            name: hotel.name,
            lat: Number(hotel.latitude) + 0.1,
            lng: Number(hotel.longitude) + 0.1,
            geohash: hotel.geohash,
            hotel: hotel
          })
        }
      })
      this.markers = markers
      this.emphasizedMarkers = emphasizedMarkers
    },
    drawGeohashNeighbors(hash) {
      this.drawGeohashArea(hash)
      geohash.neighbors(hash).forEach(this.drawGeohashArea)
    },
    drawGeohashArea(hash, strokeOpacity=1.0) {
      console.log("drawGeohashArea")
      const bbox = geohash.decode_bbox(hash)
      const coordinates = [
        {lat: bbox[0], lng: bbox[1]},
        {lat: bbox[0], lng: bbox[3]},
        {lat: bbox[2], lng: bbox[3]},
        {lat: bbox[2], lng: bbox[1]},
        {lat: bbox[0], lng: bbox[1]},
      ];

      const { Polyline } = this.google.maps
      const path = new Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity,
        strokeWeight: 2
      });
      path.setMap(this.map);
    }
  }
}
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 600px;
}

</style>
