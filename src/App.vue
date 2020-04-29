<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Encrypter msg="Welcome to EncrypterJS"/>
  </div>
</template>

<script>
import Encrypter from './components/Encrypter.vue'

export default {
  name: 'app',
  components: {
    Encrypter
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
