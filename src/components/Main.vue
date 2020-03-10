<template>
  <v-content>
    <vue-daum-map
      :appKey="appKey"
      :center.sync="center"
      :level.sync="level"
      :mapTypeId="mapTypeId"
      :libraries="libraries"
      @load="load"
      @center_changed="center_changed"
      style="width:100vw;height:100%;"
    />
  </v-content>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=dce438490f21b3aaa6e6176c852d813a"></script>

<script>
import VueDaumMap from 'vue-daum-map'

export default {
  name: 'Main',

  components: { VueDaumMap },

  data: () => ({
    appKey: 'dce438490f21b3aaa6e6176c852d813a',
    center: { lat: 37.5411, lng: 127.068 },
    delayCenter: { lat: 0, lng: 0 },
    level: 3,
    mapTypeId: VueDaumMap.MapTypeId.NORMAL,
    libraries: [],
    map: null
  }),

  methods: {
    load (map) {
      var mapTypeControl = new kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)

      var zoomControl = new kakao.maps.ZoomControl()
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var lat = position.coords.latitude
          var lon = position.coords.longitude
          var locPosition = new kakao.maps.LatLng(lat, lon)
          map.setCenter(locPosition)
        })
      }

      this.map = map
    },
    center_changed () {
      if (this.delayCenter.let + 0.3 < this.center.let || this.delayCenter.lng + 0.3 < this.center.lng || this.delayCenter.let - 0.3 > this.center.let || this.delayCenter.lng - 0.3 > this.center.lng) {
        this.delayCenter.let = this.center.let
        this.delayCenter.lng = this.center.lng
        axios.get(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${this.center.lat}&lng=${this.center.lng}&m=10000`)
        .then(res => {
          res.data.stores.forEach(element => {
            var position =  new kakao.maps.LatLng(element.lat, element.lng)
            var remain_stat = element.remain_stat === 'plenty' ? '100+' : element.remain_stat === 'some' ? '30+' : element.remain_stat === 'few' ? '1~30' : '소진'
            var color = element.remain_stat === 'plenty' ? 'success' : element.remain_stat === 'some' ? 'warning' : element.remain_stat === 'few' ? 'danger' : 'dark'
            var content = `<div id="${element.code}" class="card" style="display: none;">
                            <div class="card-body">
                              <button class="close" onclick="document.getElementById('${element.code}').style.display = 'none'; document.getElementById('btn${element.code}').style.display = 'block'">
                                <span aria-hidden="true">&times;</span>
                              </button>
                              <small class="text-muted">${element.created_at} 기준</small>
                              <h5 class="card-title"><button class="btn btn-sm btn-${color}">${remain_stat}</button> ${element.name}</h5>
                              <h6 class="card-subtitle mb-2 text-muted">${element.addr}</h6>
                              <p class="card-text">${element.stock_at} 입고</p>
                              <a href="https://map.kakao.com/link/to/${element.name},${element.lat},${element.lng}" target="_blank"><button class="btn btn-outline-primary">길찾기</button></a>
                            </div>
                          </div>
                          <button id="btn${element.code}" class="btn btn-sm btn-${color}" onclick="document.getElementById('${element.code}').style.display = 'block'; document.getElementById('btn${element.code}').style.display = 'none'">${remain_stat}</button>
                          `

            var customOverlay = new kakao.maps.CustomOverlay({
              map: this.map,
              position: position,
              content: content
            })
          })
        })
      }
    }
  }
}
</script>
