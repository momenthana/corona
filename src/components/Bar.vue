<template>
  <v-app-bar
    app
    color="#9146ff"
    dark
    shrink-on-scroll
    prominent
    fade-img-on-scroll
    scroll-target="#scrolling-techniques"
  >
    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-toolbar-title>코로나 INFO</v-toolbar-title>

    <template v-slot:extension>
      <v-tabs align-with-title>
        <v-tab>A</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>
