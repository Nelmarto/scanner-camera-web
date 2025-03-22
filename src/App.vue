<template>
  <div class="app">
    <router-view></router-view>
    <img :src="import.meta.env.BASE_URL + 'logo.png'" alt="Logo" class="logo" />
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
