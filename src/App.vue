<template>
  <v-app>
    <Bar/>
    <Nav/>
    <Main/>
  </v-app>
</template>

<script>
import Bar from './components/Bar'
import Nav from './components/Nav'
import Main from './components/Main'

export default {
  name: 'App',

  components: {
    Bar,
    Nav,
    Main
  },

  mounted () {
    const dark = window.matchMedia('(prefers-color-scheme: dark)')
    this.$vuetify.theme.dark = dark.matches
    dark.addEventListener('change', () => {
      this.$vuetify.theme.dark = dark.matches
    })
  }
}
</script>
