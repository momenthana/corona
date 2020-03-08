<template>
  <v-content>
    <div id="map" style="width:100vw;height:100%;"></div>
  </v-content>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=7d198afd202dd41605415274c11f620a"></script>

<script>
export default {
  name: 'Main',

  mounted () {
    this.script()
  },

  watch: {
    '$store.state.tab': () => {
      console.log(1)
    }
  },

  methods: {
    script () {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.init)
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=7d198afd202dd41605415274c11f620a&libraries=services`
      document.head.appendChild(script)
    },
    init () {
      var container = document.getElementById('map')
      var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      }

      var map = new kakao.maps.Map(container, options)

      var mapTypeControl = new kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)

      var zoomControl = new kakao.maps.ZoomControl()
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var lat = position.coords.latitude
          var lon = position.coords.longitude
          var locPosition = new kakao.maps.LatLng(lat, lon)
          map.panTo(locPosition)
        })
      }

      var geocoder = new kakao.maps.services.Geocoder()
      geocoder.addressSearch('서울특별시 강남구 선릉로 668 (삼성동)', function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          var marker = new kakao.maps.Marker({
              map: map,
              position: coords
          })

          var infowindow = new kakao.maps.InfoWindow({
              content: `<div></div>`
          })

          infowindow.open(map, marker)
        }
      })
    }
  }
}
</script>
