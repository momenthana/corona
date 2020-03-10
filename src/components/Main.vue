<template>
  <v-content>
    <v-dialog
      v-model="$store.state.dialog"
      max-width="360"
    >
      <v-card
        class="mx-auto"
      >
        <v-card-title class="headline">
          Notice
        </v-card-title>
        <v-card-text>
          <p class="text--primary">
            이번 주는 서비스의 안정적 운영을 지켜보기 위하여 베타서비스입니다.
          </p>
          <p class="text--primary">
            서비스되는 재고 현황 정보는 데이터 처리 및 전송으로 인해 실제 현장 판매처의 현황과 5분~10분 정도의 차이가 있습니다.
          </p>
          <p class="text--primary">
            일부 약국에서는 번호표 배부 후 판매하는 약국도 있어 서비스되는 정보가 번호표 배부 현황을 반영하지는 못하고 있습니다.
          </p>
          <p class="text--primary">
            마스크 현황 정보는 성인용 마스크를 대상으로 합니다.
          </p>
          <p class="text--primary">
            어려운 환경에서도 일선에서 공헌해 주시는 약사님, 우체국 종사자분들 응원합니다!
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="deep-purple accent-4"
            @click="$store.state.dialog = false"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      if (this.delayCenter.let + 0.05 < this.center.let || this.delayCenter.lng + 0.05 < this.center.lng || this.delayCenter.let - 0.05 > this.center.let || this.delayCenter.lng - 0.05 > this.center.lng) {
        this.delayCenter.let = this.center.let
        this.delayCenter.lng = this.center.lng
        axios.get(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${this.center.lat}&lng=${this.center.lng}&m=10000`)
        .then(res => {
          res.data.stores.forEach(element => {
            var position =  new kakao.maps.LatLng(element.lat, element.lng)
            var remain_stat = element.remain_stat === 'plenty' ? '100+' : element.remain_stat === 'some' ? '30+' : element.remain_stat === 'few' ? '1~30' : '소진'
            var color = element.remain_stat === 'plenty' ? 'success' : element.remain_stat === 'some' ? 'warning' : element.remain_stat === 'few' ? 'danger' : 'dark'

            var button = `
              <button id="btn${element.code}" class="btn btn-sm btn-${color}" onclick="document.getElementById('${element.code}').style.display = 'block'; document.getElementById('btn${element.code}').style.display = 'none';">${remain_stat}</button>
            `

            var card = `
              <div id="${element.code}" class="card" style="display: none;">
                <div class="card-body">
                  <button class="close" onclick="document.getElementById('${element.code}').style.display = 'none'; document.getElementById('btn${element.code}').style.display = 'block'">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <small class="text-dark">기준 ${element.created_at ? element.created_at : '자료 없음'}</small>
                  <h5 class="card-title text-dark"><button class="btn btn-sm btn-${color}">${remain_stat}</button> ${element.name}</h5>
                  <h6 class="card-subtitle mb-2 text-dark">${element.addr}</h6>
                  <p class="card-text text-dark">입고 ${element.stock_at ? element.stock_at : '자료 없음'}</p>
                  <a href="https://map.kakao.com/link/to/${element.name},${element.lat},${element.lng}" target="_blank"><button class="btn btn-outline-primary">길찾기</button></a>
                </div>
              </div>
            `

            var buttonOverlay = new kakao.maps.CustomOverlay({
              map: this.map,
              position: position,
              content: button
            })

            var cardOverlay = new kakao.maps.CustomOverlay({
              map: this.map,
              position: position,
              content: card,
              zIndex: 1
            })
          })
        })
      }
    }
  }
}
</script>
