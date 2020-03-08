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
    window.kakao && windows.kakao.map ? this.init() : this.script()
  },

  methods: {
    script () {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.init)
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=7d198afd202dd41605415274c11f620a`
      document.head.appendChild(script)
    },
    init () {
      var container = document.getElementById('map')
      var options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      }

      var map = new kakao.maps.Map(container, options)
    }
  }
}
</script>
