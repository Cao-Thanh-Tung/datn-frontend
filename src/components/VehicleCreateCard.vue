<script setup lang="ts">
import { reactive } from 'vue';
import { Vehicle } from '../dto/Vehicle';
import { message } from 'ant-design-vue';
import { Position, parksList } from '../dto/Position';
const props = defineProps<{
    createFunc: (vehicle: Vehicle) => void;
    cancelFunc: () => void;
}>();
const vehicleInfo = reactive({
    capacity: 0,
    park: `[${parksList[0].id}] - ${parksList[0].name}`,
    earliest: 14400,
    latest: 79200,
})
const save = () => {
    if (vehicleInfo.park == null || vehicleInfo.earliest < 0 || vehicleInfo.latest < 0 || vehicleInfo.earliest > 60 * 60 * 24 || vehicleInfo.latest > 60 * 60 * 24) {
        message.info("Info wrong or lack");
    } else {
        let park: Position;
        for (let i = 0; i < parksList.length; i++) {
            if (vehicleInfo.park == `[${parksList[i].id}] - ${parksList[i].name}`) {
                park = parksList[i];
                break;
            }
        }
        const vehicle = new Vehicle(vehicleInfo.capacity, park!, vehicleInfo.earliest, vehicleInfo.latest);
        props.createFunc(vehicle);
    }
}
const parkSelectList = parksList.map(park => { return { value: `[${park.id}] - ${park.name}` } });
</script>
<template>
    <div class="create-box">
        <p>Capacity: </p>
        <a-input type="number" v-model:value="vehicleInfo.capacity"></a-input>
        <p>Park: </p>
        <a-select v-model:value="vehicleInfo.park" :options="parkSelectList" size="large"
            style="width: 100%"></a-select>
        <p>Earliest: </p>
        <a-input type="number" v-model:value="vehicleInfo.earliest"></a-input>
        <p>Latest: </p>
        <a-input type="number" v-model:value="vehicleInfo.latest"></a-input>
        <div class="tool">
            <a-button style="width: 100%" @click="save">
                Save
            </a-button>
            <a-button danger style="width: 100%" @click="cancelFunc">
                Cancel
            </a-button>
        </div>
    </div>
</template>
<style scoped>
.create-box {
    width: 100%;
    border: 1px solid black;
    margin-top: 8px;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding-left: 12px;
    padding-right: 8px;
}

.tool {
    display: flex;
    justify-content: space-evenly;
}
</style>
