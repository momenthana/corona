<template>
  <v-app-bar
    app
    color="#9146ff"
    dark
  >
    <v-app-bar-nav-icon @click="$store.state.drawer = true"></v-app-bar-nav-icon>

    <v-toolbar-title>코로나.info</v-toolbar-title>

    <template v-slot:extension>
      <v-tabs
        :align-with-title="!$vuetify.breakpoint.xsOnly"
        slider-color="white"
        color="white"
        v-model="$store.state.tab"
      >
        <v-tab>전체</v-tab>
        <v-tab>선별진료소</v-tab>
        <v-tab>국민안심병원</v-tab>
        <v-tab>공적마스크 판매처</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>
