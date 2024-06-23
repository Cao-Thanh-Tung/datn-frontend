<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Vehicle } from "@/dto/Vehicle";
import { Solution } from '../dto/Solution';
import OrderCard from "./OrderCard.vue";
import RouteCard from "./RouteCard.vue";
import { Route } from "@/dto/Route";
import { getTimeString } from "@/service/convert";
const props = defineProps<{
    solution: Solution;
}>();
console.log(props.solution);
</script>
<template>
    <div class="container">
        <p>Summary:</p>
        <div class="summary">
            <div> Num of used vehicle: {{ solution.numVehicleUsed }} </div>
            <div> Num of serve order: {{ solution.totalServeAbleOrder }} </div>
            <div> Total distance: {{ solution.totalDistance }} km</div>
            <div> Total duration: {{ solution.totalDuration }} s</div>
            <div> Total demand: {{ solution.totalDemand }} kg</div>
            <div> Start time: {{ getTimeString(solution.earliestTime) }}</div>
            <div> End time: {{ getTimeString(solution.latestTime) }}</div>
        </div>
        <p>List route: </p>
        <hr />
        <div class="routeList">
            <RouteCard
                v-for="(route, index) in solution.routes.filter((route: Route) => { return route.orderXES.length > 0; })"
                :key="index" :route="route" :index="index" />
        </div>
        <p v-if="solution.unServeAbleOrders.length != 0"> Can't serve able orders: </p>
        <hr />
        <div class="un-serve-able-order-list">
            <OrderCard v-for="(order, index) in solution.unServeAbleOrders" :key="index" :order="order" :tool="false"
                :delete-func="(oid: number) => { }" />
        </div>
    </div>
</template>
<style scope>
.summary {
    margin-top: 12px;
    margin-left: 4px;
    margin-bottom: 8px;
    border: 1px solid black;
    box-sizing: border-box;
    padding: 4px;
}

.routeList {
    margin-top: 12px;
}

.un-serve-able-order-list {
    margin-top: 12px;
}
</style>
