<template>
  <div class="app">
    <img src="/scanner-camera-web/logo.png" alt="Logo" class="logo" />
    <router-view />
  </div>
</template>

<style>
.logo {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 100px;
  height: auto;
  z-index: 1000;
}
</style>
