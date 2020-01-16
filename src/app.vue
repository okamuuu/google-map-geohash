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
              :key="i"
              :position="marker" 
              :google="google"
              :map="map"
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
import geohash from 'ngeohash'
import GoogleMapsApiLoader from 'google-maps-api-loader'

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
    
      // this.drawGeohashArea("xn77519jj", 1.0)
      // this.drawGeohashArea("xn77519j", 0.8)
      // this.drawGeohashArea("xn77519", 0.7)
      // this.drawGeohashArea("xn7751", 0.6)
      // this.drawGeohashArea("xn775", 0.5)
      this.drawGeohashNeighbors("xn7751")
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
