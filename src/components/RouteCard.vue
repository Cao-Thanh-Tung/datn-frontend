<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Vehicle } from "@/dto/Vehicle";
import { Route } from '../dto/Route';
import { Order } from "@/dto/Order";
import OrderCard from "./OrderCard.vue";
import TripTable from "./TripTable.vue";
import eventBus from '@/eventBus';
const props = defineProps<{
    route: Route;
    index: number;
}>();
const getOrderIdsString = (route: Route): String => {
    return route.orderXES.map((order: Order) => { return order.id }).join(", ");
}
const vehicle = props.route.vehicle as Vehicle;
const seeOrder = ref(false);
const seeTrip = ref(false);

const toggle = () => {
    seeOrder.value = !seeOrder.value;
}
const showTrip = () => {
    seeTrip.value = true;
}
const handleOk = (e: MouseEvent) => {
    console.log(e);
    seeTrip.value = false;
};
const hasDraw = ref(false);
type Info = {
    orderId: number,
    type: string,
}
const drawRoute = () => {
    hasDraw.value = true;
    const infos: Info[] = [];
    for (let i = 0; i < props.route.pointXES.length; i++) {
        let orderIndex: number;
        if (props.route.pointXES[i].action == "pickup") {
            for (let j = 0; j < props.route.orderXES.length; j++) {
                if (props.route.orderXES[j].pickup.id == props.route.pointXES[i].id) {
                    orderIndex = props.route.orderXES[j].id;
                    break;
                }
            }
            infos.push({
                orderId: orderIndex!, type: "pickup",
            })
        } else if (props.route.pointXES[i].action == "delivery") {
            for (let j = 0; j < props.route.orderXES.length; j++) {
                if (props.route.orderXES[j].delivery.id == props.route.pointXES[i].id) {
                    orderIndex = props.route.orderXES[j].id;
                    break;
                }
            }
            infos.push({
                orderId: orderIndex!, type: "delivery",
            })
        } else {
            infos.push({
                orderId: -1, type: "park",
            })
        }


    }
    eventBus.emit("drawRoute", {
        routeId: props.index,
        wayPoints: props.route.pointXES.map(point => { return { lat: point.position.lat, lng: point.position.lon } }),
        infos: infos
    });
}
const eraserRoute = () => {
    hasDraw.value = false;
    eventBus.emit("eraserRoute", {
        routeId: props.index
    })
}
</script>
<template>
    <div class="route-car">
        <div>Route {{ index }}</div>
        <div>VehicleId: {{ vehicle.id }} capacity: {{ route.vehicle.capacity }}</div>
        <div>Total demand: {{ route.totalWeight }}</div>
        <div>Total distance: {{ route.totalDistance }}</div>
        <div>Total duration: {{ route.totalDuration }}</div>
        <div>Serve orders: {{ getOrderIdsString(route) }}</div>
        <div>
            <div class="tools">
                <a-button style="width: 100%" @click="showTrip">
                    Show trip
                </a-button>
                <a-button v-if="!hasDraw" style="width: 100%" @click="drawRoute">
                    Show map
                </a-button>
                <a-button v-else style="width: 100%" @click="eraserRoute">
                    Eraser map
                </a-button>
            </div>
            <a-button style="width: 100%" @click="toggle">
                Show orders
            </a-button>
        </div>
        <div class="route-orders" v-if="seeOrder">
            <p>Serve orders: </p>
            <OrderCard v-for="(order, index) in route.orderXES" :key="index" :order="order" :tool="false"
                :delete-func="(oid: number) => { }" />
        </div>
    </div>
    <a-modal v-model:open="seeTrip" title="Route Detail" @ok="handleOk" style="width:80%">
        <TripTable :route="route" />
    </a-modal>
</template>
<style scoped>
.tools {
    display: flex;
    justify-content: space-evenly;
}

.route-car {
    margin-top: 12px;
    margin-left: 4px;
    margin-bottom: 8px;
    border: 1px solid black;
    box-sizing: border-box;
    padding: 4px;
}
</style>
