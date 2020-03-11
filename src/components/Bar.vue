<template>
  <v-app-bar
    app
    color="#9146ff"
    dark
  >
    <v-app-bar-nav-icon @click="$store.state.drawer = true"></v-app-bar-nav-icon>

    <v-toolbar-title>코로나.info</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon @click="$store.state.gps += 1">mdi-crosshairs-gps</v-icon>
    </v-btn>

    <v-toolbar-items>
      <v-text-field
        class="mt-1"
        solo-inverted
        clearable
        v-model="addr"
        placeholder="장소 검색"
        prepend-inner-icon="mdi-magnify"
        color="#9146ff"
        @keyup.native.enter="$store.state.addr = addr"
      >
      </v-text-field>
    </v-toolbar-items>

    <template v-slot:extension>
      <v-tabs
        align-with-title
        slider-color="white"
        color="white"
      >
        <v-tab @click="$store.state.tab = '공적마스크 판매처'">공적마스크 판매처</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>
