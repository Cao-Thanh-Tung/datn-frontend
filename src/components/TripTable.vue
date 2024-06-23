<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Route } from '../dto/Route';
import { getTimeString } from "@/service/convert";
import OrderCard from "./OrderCard.vue";
import { ActionPoint } from "@/dto/ActionPoint";
const props = defineProps<{
    route: Route;
}>();
let data: any[] = [];
const arrivalTimes = props.route.arrivalTimes;
const leaveTimes = props.route.leaveTimes;
const orders = props.route.orderXES;
for (let i = 0; i < props.route.pointXES.length; i++) {
    let actionPoint: ActionPoint = props.route.pointXES[i];
    let order = null;
    for (let j = 0; j < orders.length; j++) {
        if (orders[j].delivery.id == actionPoint.id) {
            order = orders[j];
            break;
        } else if (orders[j].pickup.id == actionPoint.id) {
            order = orders[j];
            break;
        }
    }
    if (actionPoint.action == "delivery") {
        data.push({
            "index": i,
            "arrivalTime": getTimeString(arrivalTimes[i]),
            "leaveTime": getTimeString(leaveTimes[i]),
            "positionId": actionPoint.position.id,
            "positionName": actionPoint.position.name,
            "earliest": getTimeString(actionPoint.earliest),
            "latest": getTimeString(actionPoint.latest),
            "action": actionPoint.action,
            "orderId": order?.id,
            "demand": order!.demand * (-1),
        })
    } else {
        data.push({
            "index": i,
            "arrivalTime": getTimeString(arrivalTimes[i]),
            "leaveTime": getTimeString(leaveTimes[i]),
            "positionId": actionPoint.position.id,
            "positionName": actionPoint.position.name,
            "earliest": getTimeString(actionPoint.earliest),
            "latest": getTimeString(actionPoint.latest),
            "action": actionPoint.action,
            "orderId": order?.id,
            "demand": order?.demand,
        })
    }

}
const columns = [
    {
        name: 'Num',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: 'Position Id',
        dataIndex: 'positionId',
        key: 'positionId',
    },
    {
        title: 'Position Name',
        dataIndex: 'positionName',
        key: 'positionName',
    },

    {
        title: 'Arrival Time',
        key: 'arrivalTime',
        dataIndex: 'arrivalTime',
    },
    {
        title: 'Leave Time',
        key: 'leaveTime',
        dataIndex: 'leaveTime',
    },
    {
        title: 'Earliest',
        key: 'earliest',
        dataIndex: 'earliest',
    },
    {
        title: 'Latest',
        key: 'latest',
        dataIndex: 'latest',
    },
    {
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
    },
    {
        title: 'OrderId',
        key: 'orderId',
        dataIndex: 'orderId',
    },
    {
        title: 'Demand',
        key: 'demand',
        dataIndex: 'demand',
    },
];

</script>
<template>
    <div>
        <a-table :columns="columns" :data-source="data"></a-table>
    </div>
</template>
<style scoped></style>
