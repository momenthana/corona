<template>
  <v-app>
    <Main/>
  </v-app>
</template>

<script>
import Main from './components/Main'

export default {
  name: 'App',

  components: {
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
