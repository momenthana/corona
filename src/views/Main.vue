<template>
  <v-app>
    <Bar/>
    <Nav/>
    <v-content>
      <v-dialog
        v-model="dialog"
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
              서비스되는 재고 현황 정보는 데이터 처리 및 전송으로 인해 실제 현장 판매처의 현황과 5분~10분 정도의 차이가 있습니다.
            </p>
            <p class="text--primary">
              일부 약국에서는 번호표 배부 후 판매하는 약국도 있어 서비스되는 정보가 번호표 배부 현황을 반영하지는 못하고 있습니다.
            </p>
            <p class="text--primary">
              어려운 환경에서도 일선에서 공헌해 주시는 약사님, 우체국 종사자분들 응원합니다!
            </p>
            <a href="https://open.kakao.com/o/gKFJSh1b" target="_blink" style="text-decoration: none;">카카오톡 오픈채팅방</a>
          </v-card-text>
          <v-card-actions>
            <v-btn
              dark
              color="deep-orange accent-4"
              @click="close()"
            >
              숨기기
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              dark
              color="deep-purple accent-4"
              @click="dialog = false"
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
        @center_changed="request()"
        style="width:100vw;height:100%;"
      />
      <v-toolbar
        floating
        absolute
        class="ma-3"
      >
        <v-text-field
          hide-details
          single-line
          clearable
          color="#9146ff"
          v-model="addr"
          placeholder="장소 검색"
          prepend-icon="mdi-magnify"
          @keyup.native.enter="search()"
        ></v-text-field>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              @click="location()"
              v-on="on"
            >
              <v-icon>
                mdi-crosshairs-gps
              </v-icon>
            </v-btn>
          </template>
          <span>내 위치 찾기</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              @click="request()"
              v-on="on"
            >
              <v-icon>
                mdi-autorenew
              </v-icon>
            </v-btn>
          </template>
          <span>새로고침</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-switch
              hide-details
              inset
              v-model="empty"
              color="orange"
              v-on="on"
              class="ml-3"
              @change="request()"
            ></v-switch>
          </template>
          <span>소진된 장소 숨기기</span>
        </v-tooltip>
      </v-toolbar>
    </v-content>
  </v-app>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=dce438490f21b3aaa6e6176c852d813a&libraries=services"></script>

<script>
import Bar from '@/components/Bar'
import Nav from '@/components/Nav'
import VueDaumMap from 'vue-daum-map'
import request from 'request'
import csv from 'csvtojson'

export default {
  name: 'Main',

  components: {
    Bar,
    Nav,
    VueDaumMap
  },

  data: () => ({
    appKey: 'dce438490f21b3aaa6e6176c852d813a',
    center: { lat: 37.5411, lng: 127.068 },
    lat: 37.5411,
    lng: 127.068,
    level: 4,
    mapTypeId: VueDaumMap.MapTypeId.NORMAL,
    libraries: ['services'],
    addr: null,
    buttonOverlay: [],
    cardOverlay: [],
    empty: false,
    dialog: localStorage.getItem('dialog') ? false : true
  }),

  watch: {
    '$store.state.tab': function () {
      this.request()
    }
  },

  methods: {
    close () {
      this.dialog = false
      localStorage.setItem('dialog', false)
    },
    load (map) {
      this.map = map
      this.request()
      this.location()
    },
    search () {
      var ps = new kakao.maps.services.Places()
      ps.keywordSearch(this.addr, placesSearchCB)

      function placesSearchCB (data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
          setCenter(data[0].y, data[0].x)
        }
      }

      let setCenter = (lat, lon) => {
        this.map.setLevel(4)
        this.map.setCenter(new kakao.maps.LatLng(lat, lon))
        this.request()
      }
    },
    location () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          let lat = pos.coords.latitude
          let lng = pos.coords.longitude

          setCenter(lat, lng)
        })
      }

      let setCenter = (lat, lng) => {
        this.map.setLevel(4)
        this.map.setCenter(new kakao.maps.LatLng(lat, lng))
        this.request()
      }
    },
    request () {
      this.remove()
      if (this.$store.state.tab === 0) {
        this.mask()
        this.triage()
        this.hospital()
      } else if (this.$store.state.tab === 1) {
        this.triage()
      } else if (this.$store.state.tab === 2) {
        this.hospital()
      } else if (this.$store.state.tab === 3) {
        this.mask()
      }
    },
    mask () {
      if (this.lat - 0.03 > this.center.lat || this.lat + 0.03 < this.center.lat || this.lng - 0.03 > this.center.lng || this.lng + 0.03 < this.center.lng) {
        this.lat = this.center.lat
        this.lng = this.center.lng
        axios.get(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${this.center.lat}&lng=${this.center.lng}&m=10000`)
        .then(res => {
          res.data.stores.forEach(e => {
            if(this.empty ? (e.remain_stat === 'plenty' || e.remain_stat === 'some' || e.remain_stat === 'few') : true) {
              var remain_stat = e.remain_stat === 'plenty' ? '100+' : e.remain_stat === 'some' ? '30+' : e.remain_stat === 'few' ? '1~30' : e.created_at ? '소진' : '자료 없음'
              var color = e.remain_stat === 'plenty' ? 'success' : e.remain_stat === 'some' ? 'warning' : e.remain_stat === 'few' ? 'danger' : 'dark'

              var button = `
                <button id="maskBtn${e.code}" class="btn btn-sm btn-${color}" onclick="document.getElementsByClassName('btn').forEach(e => { e.style.display = 'inline' }); document.getElementsByClassName('card').forEach(e => { e.style.display = 'none' });document.getElementById('maskCard${e.code}').style.display = 'block'; document.getElementById('maskBtn${e.code}').style.display = 'none';">${remain_stat}</button>
              `

              var card = `
                <div id="maskCard${e.code}" class="card" style="margin-left: -50%; width: 100%; min-width: 260px; display: none;">
                  <div class="card-body">
                    <button class="close" onclick="document.getElementById('maskCard${e.code}').style.display = 'none'; document.getElementById('maskBtn${e.code}').style.display = 'block'">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <small class="text-dark">${e.created_at ? e.created_at + ' 기준' : '기준 자료 없음'}</small>
                    <h5 class="card-title text-dark"><button class="btn btn-sm btn-${color}">${remain_stat}</button> ${e.name}</h5>
                    <h6 class="card-subtitle text-dark" style="white-space: normal;">${e.addr}</h6>
                    <p class="card-text text-dark">${e.stock_at ? e.stock_at + ' 입고' : '입고 자료 없음'}</p>
                    <a href="https://map.kakao.com/link/to/${e.name},${e.lat},${e.lng}" target="_blank" style="text-decoration: none;"><button class="btn btn-outline-primary btn-block">길찾기</button></a>
                  </div>
                </div>
              `

              let pos = new kakao.maps.LatLng(e.lat, e.lng)

              this.buttonOverlay.push(new kakao.maps.CustomOverlay({
                map: this.map,
                position: pos,
                content: button
              }))

              this.cardOverlay.push(new kakao.maps.CustomOverlay({
                map: this.map,
                position: pos,
                content: card,
                zIndex: 1
              }))
            }
          })
        })
      }
    },
    triage () {
      csv()
        .fromStream(request.get('https://코로나.info/선별진료소.csv'))
        .then((rows)=>{
          var ps = new kakao.maps.services.Places()

          for (const key in rows) {
            ps.keywordSearch(rows[key].주소, placesSearchCB)

            function placesSearchCB (data, status, pagination) {
              if (status === kakao.maps.services.Status.OK) {
                var button = `
                  <button id="triageBtn${key}" class="btn btn-sm btn-primary" onclick="document.getElementsByClassName('btn').forEach(e => { e.style.display = 'inline' }); document.getElementsByClassName('card').forEach(e => { e.style.display = 'none' });document.getElementById('triageCard${key}').style.display = 'block'; document.getElementById('triageBtn${key}').style.display = 'none';">${rows[key].의료기관명}</button>
                `

                var card = `
                  <div id="triageCard${key}" class="card" style="margin-left: -50%; width: 100%; min-width: 260px; display: none;">
                    <div class="card-body">
                      <button class="close" onclick="document.getElementById('triageCard${key}').style.display = 'none'; document.getElementById('triageBtn${key}').style.display = 'block'">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <small class="text-dark">${rows[key].기준일시 ? rows[key].기준일시 + ' 기준' : '기준 자료 없음'}</small>
                      <h5 class="card-title text-dark">${rows[key].의료기관명}</h5>
                      <h6 class="card-subtitle text-dark" style="white-space: normal;">${rows[key].주소} (${rows[key][`대표 전화번호`]})</h6>
                      <p class="card-text text-dark">${rows[key][`검체채취\n가능여부`] === 'O' ? '검채채취 가능' : '검채채취 불가'}</p>
                      <a href="https://map.kakao.com/link/to/${rows[key].의료기관명},${data[0].y},${data[0].x}" target="_blank" style="text-decoration: none;"><button class="btn btn-outline-primary btn-block">길찾기</button></a>
                    </div>
                  </div>
                `

                overlayPush(new kakao.maps.LatLng(data[0].y, data[0].x), button, card)
              }
            }

            var overlayPush = (pos, button, card) => {
              this.buttonOverlay.push(new kakao.maps.CustomOverlay({
                map: this.map,
                position: pos,
                content: button
              }))

              this.cardOverlay.push(new kakao.maps.CustomOverlay({
                map: this.map,
                position: pos,
                content: card,
                zIndex: 1
              }))
            }
          }
        })
    },
    hospital () {
      csv()
        .fromStream(request.get('https://코로나.info/국민안심병원.csv'))
        .then((rows)=>{
          var ps = new kakao.maps.services.Places()
          for (const key in rows) {
            ps.keywordSearch(rows[key].주소, placesSearchCB)

            function placesSearchCB (data, status, pagination) {
              if (status === kakao.maps.services.Status.OK) {
                var button = `
                  <button id="hospitalBtn${key}" class="btn btn-sm btn-light" onclick="document.getElementsByClassName('btn').forEach(e => { e.style.display = 'inline' }); document.getElementsByClassName('card').forEach(e => { e.style.display = 'none' });document.getElementById('hospitalCard${key}').style.display = 'block'; document.getElementById('hospitalBtn${key}').style.display = 'none';">${rows[key].기관명}</button>
                `

                var card = `
                  <div id="hospitalCard${key}" class="card" style="margin-left: -50%; width: 100%; min-width: 260px; display: none;">
                    <div class="card-body">
                      <button class="close" onclick="document.getElementById('hospitalCard${key}').style.display = 'none'; document.getElementById('hospitalBtn${key}').style.display = 'block'">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <small class="text-dark">${rows[key].기준일 ? rows[key].기준일 + ' 기준' : '기준 자료 없음'}</small>
                      <h5 class="card-title text-dark">${rows[key].기관명}</h5>
                      <h6 class="card-subtitle text-dark" style="white-space: normal;">${rows[key].주소} (${rows[key].전화번호})</h6>
                      <p class="text-dark">외래진료 ${rows[key][`신청유형\n(A: 외래진료, \nB: 외래진료 및 입원)`] === 'A' ? '' : '및 입원'} 운영</p>
                      <a href="https://map.kakao.com/link/to/${rows[key].기관명},${data[0].y},${data[0].x}" target="_blank" style="text-decoration: none;"><button class="btn btn-outline-primary btn-block">길찾기</button></a>
                    </div>
                  </div>
                `

                overlayPush(new kakao.maps.LatLng(data[0].y, data[0].x), button, card)
              }
            }

            var overlayPush = (pos, button, card) => {
              this.buttonOverlay.push(new kakao.maps.CustomOverlay({
                map: this.map,
                position: pos,
                content: button
              }))

              this.cardOverlay.push(new kakao.maps.CustomOverlay({
                map: this.map,
                position: pos,
                content: card,
                zIndex: 1
              }))
            }
          }
        })
    },
    remove () {
      this.buttonOverlay.forEach(e => {
        e.setMap(null)
      })
      this.cardOverlay.forEach(e => {
        e.setMap(null)
      })
      this.buttonOverlay = []
      this.cardOverlay = []
      this.delayCenter = { lat: 0, lng: 0 }
    }
  }
}
</script>
