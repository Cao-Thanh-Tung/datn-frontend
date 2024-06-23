<script setup lang="ts">
import MapView from "./components/MapView.vue";
import { DoubleLeftOutlined } from "@ant-design/icons-vue";
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import { onMounted, onUnmounted } from 'vue';
import { h } from 'vue';
import moment from "moment";
import Menu from "./components/Menu.vue";

const open = ref<boolean>(false);


const showDrawer = () => {
  open.value = true;
};



</script>

<template>
  <div class="main-screen">
    <div class="map-container">
      <map-view />
    </div>
    <!-- <a-button danger class="menu-toggle">Default</a-button> -->
    <a-float-button type="primary" shape="round" size="large" @click="showDrawer" class="menu-toggle" tooltip="Menu">
      <template #icon>
        <DoubleLeftOutlined />
      </template>
    </a-float-button>
    <Menu v-model="open"></Menu>
  </div>
</template>


<style scoped>
.main-screen {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.menu-toggle {
  color: black;
  /* position: absolute; */
  z-index: 10;
  top: 4px;
  right: 4px;
  background-color: white;
  /* padding: 6px; */
  border-radius: 10px;
  /* border: 1px solid black;
  cursor: pointer; */
}
</style>
