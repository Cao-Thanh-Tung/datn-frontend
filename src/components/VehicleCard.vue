<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Vehicle } from "@/dto/Vehicle";
import { getTimeString } from "@/service/convert";
import eventBus from "@/eventBus";
const props = defineProps<{
    vehicle: Vehicle;
    deleteFunc: (vid: number) => void;
}>();
type ParkInfo = {
    positionId: number,
    name: String,
    vehicleId: number,
    lat: number,
    lng: number
}
const hasShow = ref(false);
const drawPark = () => {
    hasShow.value = true;
    const parkInfo: ParkInfo = {
        positionId: props.vehicle.park.id,
        name: props.vehicle.park.name,
        vehicleId: props.vehicle.id,
        lat: props.vehicle.park.lat,
        lng: props.vehicle.park.lon
    }
    eventBus.emit("drawPark", {
        vehicleId: props.vehicle.id,
        parkInfo: parkInfo,
    })
}
const eraserPark = () => {
    hasShow.value = false;
    eventBus.emit("eraserPark", {
        vehicleId: props.vehicle.id,
    })
}
</script>
<template>
    <div class="vehicle-card">
        <div>ID: {{ vehicle.id }} </div>
        <div>Capacity: {{ vehicle.capacity }} </div>
        <div>Park: {{ vehicle.park.id + " - " + vehicle.park.name }} </div>
        <div>Work time: {{ getTimeString(vehicle.earliest) + " -> " + getTimeString(vehicle.latest) }}</div>
        <div class="tool">
            <a-button v-if="!hasShow" style="width: 100%" @click="drawPark">
                Show Map
            </a-button>
            <a-button v-else style="width: 100%" @click="eraserPark">
                Erase
            </a-button>
            <a-button danger style="width: 100%" @click="() => { eraserPark(); deleteFunc(vehicle.id); }">
                <template #icon>
                    <DeleteOutlined />
                </template>
            </a-button>
        </div>
    </div>
</template>
<style scope>
.tool {
    display: flex;
    justify-content: space-evenly;
}

.vehicle-card {
    width: 100%;
    border: 1px solid black;
    margin-top: 8px;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding-left: 12px;
    padding-right: 8px;

}
</style>
