<script setup lang="ts">
import { ref, watch, reactive, type Ref } from "vue";
import { message } from "ant-design-vue";
import { CloseOutlined } from "@ant-design/icons-vue";
import { Input as DataInput, distanceTypes } from "@/dto/Input";
import { GenerateTestData } from "@/service/generateExample";
import { Vehicle } from "@/dto/Vehicle";
import { Order } from "@/dto/Order";
import { parksList, positionsList } from "@/dto/Position";
import { solvePost } from "@/api";
import VehicleCard from "./VehicleCard.vue";
import OrderCard from "./OrderCard.vue";
import { objectiveList, constraintList, strategies } from '../dto/Input';
import { Solution } from "@/dto/Solution";
import Result from "./Result.vue";
import eventBus from '@/eventBus';
import VehicleCreateCard from "./VehicleCreateCard.vue";
import OrderCreateCard from "./OrderCreateCard.vue";
const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const open = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    open.value = newValue;
});

const close = () => {
    open.value = !open.value;
    emit("update:modelValue", open.value);
};
const clearMap = () => {
    eventBus.emit('clearRoute');
    eventBus.emit('deleteAllRoute');
}
const solution: Ref<Solution | null> = ref(null);

const solve = async () => {
    clearMap();
    message.info("Solving");
    solution.value = await solvePost(dataInput as DataInput);
    if (solution.value == null) {
        message.error("Solved failed")
    } else {
        message.info("Solved");
    }
    emitDrawAllRoute();
}
const activeKey = ref('1');

const dataInput = reactive(new DataInput());

const genRandomVehicles = (n: number) => {
    dataInput.vehicles.unshift(...GenerateTestData.generateVehicle(n));
};
const clearAllVehicles = () => {
    // delete all vehicles
    eventBus.emit("deleteAllParks");
    dataInput.vehicles.splice(0, dataInput.vehicles.length);
}

const deleteVehicle = (vid: number) => {
    // remove the vehicle with the given id
    for (let i = 0; i < dataInput.vehicles.length; i++) {
        if (dataInput.vehicles[i].id == vid) {
            dataInput.vehicles.splice(i, 1);
        }
    }
}

const genRandomOrders = (n: number) => {
    dataInput.orders.unshift(...GenerateTestData.generateOrder(n));
}
const clearAllOrders = () => {
    eventBus.emit("deleteAllOrders");
    dataInput.orders.splice(0, dataInput.orders.length);
}
const deleteOrder = (oid: number) => {
    for (let i = 0; i < dataInput.orders.length; i++) {
        if (dataInput.orders[i].id == oid) {
            dataInput.orders.splice(i, 1);
        }
    }
}

const distanceTypeSelectList = distanceTypes.map(distanceType => { return { value: distanceType } });
const constraintSelectList = constraintList.map(constraint => { return { value: constraint } });
const objectiveSelectList = objectiveList.map(objective => { return { value: objective } });
const strategiesSelectList = strategies.map(strategy => { return { value: strategy } });


const emitDeleteAllRoute = () => {
    eventBus.emit('deleteAllRoute');
};
const emitDrawAllRoute = () => {
    eventBus.emit('drawAllRoutes', {
        wayPoints: solution.value?.routes
    });
}

const isShowCreateVehicle = ref(false);
const createVehicle = (vehicle: Vehicle) => {
    isShowCreateVehicle.value = false;
    dataInput.vehicles.unshift(vehicle);
}
const cancelCreateVehicle = () => {
    isShowCreateVehicle.value = false;
}
const openCreateVehicleForm = () => {
    isShowCreateVehicle.value = true;
}

const isShowCreateOrder = ref(false);
const createOrder = (order: Order) => {
    isShowCreateOrder.value = false;
    dataInput.orders.unshift(order);
}
const cancelCreateOrder = () => {
    isShowCreateOrder.value = false;
}
const openCreateOrderForm = () => {
    isShowCreateOrder.value = true;
    console.log(isShowCreateVehicle.value);
}

const isShowAllPositions = ref(false);
const isShowAllParks = ref(false);
const showAllPositions = () => {
    isShowAllPositions.value = true;
    eventBus.emit("drawAllPositionArray");
}
const showAllParks = () => {
    isShowAllParks.value = true;
    eventBus.emit("drawAllParkArray");
}
const eraserAllPositions = () => {
    isShowAllPositions.value = false;
    eventBus.emit("eraserAllPositionArray");
}
const eraserAllParks = () => {
    isShowAllParks.value = false;
    eventBus.emit("eraserAllParkArray");
}
</script>

<template>
    <div :class="{ menu: true, menuOpen: open, menuClose: !open }">
        <div class="header">
            <a-button @click="close">
                <CloseOutlined />
            </a-button>
            <span>Author: Cao Thanh Tung</span>
            <a-button type="primary" @click="solve">
                Solve
            </a-button>
        </div>
        <div>
            <a-tabs v-model:activeKey="activeKey" centered>
                <a-tab-pane key="1" tab="Vehicles">
                    <div class="header">
                        <a-button type="primary" @click="() => genRandomVehicles(10)">Gen Random 10</a-button>
                        <a-button type="primary" @click="openCreateVehicleForm">Create</a-button>
                        <a-button danger @click="() => clearAllVehicles()">Clear all</a-button>
                    </div>
                    <p> Total of vehicle: {{ dataInput.vehicles.length }}</p>
                    <VehicleCreateCard v-if="isShowCreateVehicle" :cancel-func="cancelCreateVehicle"
                        :create-func="createVehicle"></VehicleCreateCard>
                    <div class="list">
                        <VehicleCard v-for="(vehicle, index) in dataInput.vehicles as Vehicle[]" :key="index"
                            :vehicle="vehicle" :delete-func="deleteVehicle"></VehicleCard>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Orders" force-render>
                    <div class="header">
                        <a-button type="primary" @click="() => { genRandomOrders(10) }">Gen Random 10</a-button>
                        <a-button type="primary" @click="openCreateOrderForm">Create</a-button>
                        <a-button danger @click="clearAllOrders">Clear all</a-button>
                    </div>
                    <p> Total of order: {{ dataInput.orders.length }}</p>
                    <OrderCreateCard v-if="isShowCreateOrder" :cancel-func="cancelCreateOrder"
                        :create-func="createOrder"></OrderCreateCard>
                    <div class="list">
                        <OrderCard v-for="(order, index) in dataInput.orders as Order[]" :key="index" :order="order"
                            :delete-func="deleteOrder" :tool="true" />
                    </div>
                </a-tab-pane>
                <a-tab-pane key="3" tab="Config">
                    <div class="header">
                        <a-button type="primary" @click="() => { dataInput.resetConfig() }">Reset default
                            config</a-button>
                    </div>
                    <div>
                        <p>Choose distance type:</p>
                        <a-select v-model:value="dataInput.distanceType" :options="distanceTypeSelectList" size="large"
                            style="width: 100%">
                        </a-select>
                        <p>Choose constraints:</p>
                        <a-select v-model:value="dataInput.constraints" :options="constraintSelectList" size="large"
                            mode="tags" style="width: 100%">
                        </a-select>
                        <p>Choose objectives:</p>
                        <a-select v-model:value="dataInput.objectives" :options="objectiveSelectList" size="large"
                            mode="tags" style="width: 100%">
                        </a-select>
                        <p>Choose strategy:</p>
                        <a-select v-model:value="dataInput.strategy" :options="strategiesSelectList" size="large"
                            style="width: 100%">
                        </a-select>
                        <p>Num of Shuffle: </p> <a-input type="number" v-model:value="dataInput.numShuffle"></a-input>
                    </div>

                </a-tab-pane>
                <a-tab-pane key="4" tab="Result">
                    <div class="header">
                        <a-button type="primary" @click="emitDrawAllRoute">See Map</a-button>
                        <a-button type="primary" @click="solve">Resolve</a-button>
                        <a-button danger @click="emitDeleteAllRoute">Eraser Map</a-button>
                    </div>
                    <div class="list">
                        <p v-if="solution == null" style="text-align: center; margin-top: 20px; font-size: 16px;">No
                            result</p>
                        <div v-else>
                            <Result :solution="solution!" />
                        </div>

                    </div>
                </a-tab-pane>
            </a-tabs>
            <div class="header">
                <a-button style="width: 100%" v-if="!isShowAllParks" @click="showAllParks">Show all parks</a-button>
                <a-button style="width: 100%" v-else @click="eraserAllParks">Eraser parks</a-button>
                <a-button style="width: 100%" v-if="!isShowAllPositions" @click="showAllPositions">Show all
                    positions</a-button>
                <a-button style="width: 100%" v-else @click="eraserAllPositions">Eraser positions</a-button>
            </div>

        </div>
    </div>
</template>


<style scoped>
.list {
    margin-top: 8px;
    overflow-y: scroll;
    height: 500px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.menu {
    height: 100vh;
    width: 300px;
    background-color: white;
    box-shadow: inset;
    position: absolute;
    z-index: 20;
    transition: left 1s;
    color: black;
    padding: 4px;
}

.menuClose {
    left: 100%;
}

.menuOpen {
    left: calc(100% - 300px);
}
</style>
