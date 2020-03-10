<template>
  <v-app-bar
    app
    color="#9146ff"
    dark
    prominent
  >
    <v-app-bar-nav-icon @click="$store.state.drawer = true"></v-app-bar-nav-icon>

    <v-toolbar-title>코로나.info</v-toolbar-title>

    <template v-slot:extension>
      <v-tabs
        align-with-title
        slider-color="white"
      >
        <v-tab @click="$store.state.tab = '공적마스크 판매처'">공적마스크 판매처</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>
