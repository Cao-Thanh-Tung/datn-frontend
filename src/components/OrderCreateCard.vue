<script setup lang="ts">
import { reactive } from 'vue';
import { Vehicle } from '../dto/Vehicle';
import { message } from 'ant-design-vue';
import { Position, positionsList } from '../dto/Position';
import { ActionPoint } from '@/dto/ActionPoint';
import { Order } from '@/dto/Order';
const props = defineProps<{
    createFunc: (order: Order) => void;
    cancelFunc: () => void;
}>();
const orderInfo = reactive({
    demand: 0,
    pickupPoint: `[${positionsList[0].id}] - ${positionsList[0].name}`,
    pEarliest: 14400,
    pLatest: 79200,
    pServiceTime: 300,
    pWaitingTime: 300,
    deliveryPoint: `[${positionsList[1].id}] - ${positionsList[1].name}`,
    dEarliest: 14400,
    dLatest: 79200,
    dServiceTime: 300,
    dWaitingTime: 300,
})
const validate = () => {
    const d = 60 * 60 * 24;
    const checkPoint = orderInfo.pickupPoint == null || orderInfo.deliveryPoint == null;
    const checkEarliest = orderInfo.pEarliest > d || orderInfo.dEarliest > d || orderInfo.pEarliest < 0 || orderInfo.dEarliest < 0;
    const checkLatest = orderInfo.pLatest > d || orderInfo.dLatest > d || orderInfo.pLatest < 0 || orderInfo.dLatest < 0;
    const checkWaitingTime = orderInfo.pWaitingTime < 0 || orderInfo.dWaitingTime < 0;
    const checkServiceTime = orderInfo.pServiceTime < 0 || orderInfo.dServiceTime < 0;
    const v: boolean = checkPoint || checkEarliest || checkLatest || checkWaitingTime || checkServiceTime;
    return v;
}
const save = () => {
    if (validate()) {
        message.info("Info wrong or lack");
    } else {
        let pickup: Position | null = null;
        let delivery: Position | null = null;
        for (let i = 0; i < positionsList.length; i++) {
            if (orderInfo.pickupPoint == `[${positionsList[i].id}] - ${positionsList[i].name}`) {
                pickup = positionsList[i];
            }
            if (orderInfo.deliveryPoint == `[${positionsList[i].id}] - ${positionsList[i].name}`) {
                delivery = positionsList[i];
            }
            if (pickup != null && delivery != null) {
                break;
            }
        }
        const pickupP: ActionPoint = new ActionPoint("pickup", pickup!, orderInfo.pEarliest, orderInfo.pLatest, orderInfo.pServiceTime, orderInfo.pWaitingTime);
        const deliveryP: ActionPoint = new ActionPoint("delivery", delivery!, orderInfo.dEarliest, orderInfo.dLatest, orderInfo.dServiceTime, orderInfo.dWaitingTime);
        const order: Order = new Order(orderInfo.demand, pickupP, deliveryP);
        props.createFunc(order);
    }
}
console.log("dsdsdsdssdsd");
const positionSelectList = positionsList.map(position => { return { value: `[${position.id}] - ${position.name}` } });
</script>
<template>
    <div class="create-box">
        <p>Demand: </p>
        <a-input type="number" v-model:value="orderInfo.demand"></a-input>
        <p>Pickup Position: </p>
        <a-select v-model:value="orderInfo.pickupPoint" :options="positionSelectList" size="large"
            style="width: 100%"></a-select>
        <p>Pickup Earliest: </p>
        <a-input type="number" v-model:value="orderInfo.pEarliest"></a-input>
        <p>Pickup Latest: </p>
        <a-input type="number" v-model:value="orderInfo.pLatest"></a-input>
        <p>Pickup Service Time(s):</p>
        <a-input type="number" v-model:value="orderInfo.pServiceTime"></a-input>
        <p>Pickup Waiting Time(s): </p>
        <a-input type="number" v-model:value="orderInfo.pWaitingTime"></a-input>

        <p>Delivery Position: </p>
        <a-select v-model:value="orderInfo.deliveryPoint" :options="positionSelectList" size="large"
            style="width: 100%"></a-select>
        <p>Delivery Earliest: </p>
        <a-input type="number" v-model:value="orderInfo.dEarliest"></a-input>
        <p>Delivery Latest: </p>
        <a-input type="number" v-model:value="orderInfo.dLatest"></a-input>
        <p>Delivery Service Time(s):</p>
        <a-input type="number" v-model:value="orderInfo.dServiceTime"></a-input>
        <p>Delivery Waiting Time(s): </p>
        <a-input type="number" v-model:value="orderInfo.dWaitingTime"></a-input>
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
    height: 300px;
    overflow: scroll;
}

.tool {
    display: flex;
    justify-content: space-evenly;
}
</style>
