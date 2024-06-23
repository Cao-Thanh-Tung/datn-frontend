<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { message } from "ant-design-vue";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Order } from '../dto/Order';
import { getTimeString } from "@/service/convert";
import eventBus from '@/eventBus';
const props = defineProps<{
    order: Order;
    deleteFunc: (oid: number) => void;
    tool: boolean
}>();
const hasShow = ref(false);
const drawOrder = () => {
    hasShow.value = true;
    eventBus.emit("drawOrder", {
        order: props.order
    })
}
const eraseOrder = () => {
    hasShow.value = false;
    eventBus.emit("eraserOrder", {
        orderId: props.order.id
    })
}
</script>
<template>
    <div class="order-card">
        <div>ID: {{ order.id }} </div>
        <div>Demand: {{ order.demand }} kg</div>
        <div>Pickup: {{ order.pickup.position.id + " - " + order.pickup.position.name }}
        </div>
        <div>Pick time window: {{ getTimeString(order.pickup.earliest) + " -> " + getTimeString(order.pickup.latest) }}
        </div>
        <div> Wait time: {{ order.pickup.waitingTime }}s, Serve time: {{ order.pickup.serviceTime }}s
        </div>
        <div>Delivery: {{ order.delivery.position.id + " - " +
            order.delivery.position.name
            }}</div>
        <div>Delivery time window: {{ getTimeString(order.pickup.earliest) + " -> " + getTimeString(order.pickup.latest)
            }}</div>
        <div> Wait time: {{ order.delivery.waitingTime }}s, Serve time: {{ order.delivery.serviceTime
            }}s
        </div>

        <div class="tool" v-if="tool">
            <a-button v-if="!hasShow" style="width: 100%" @click="drawOrder">
                Show Map
            </a-button>
            <a-button v-else style="width: 100%" @click="eraseOrder">
                Erase
            </a-button>
            <a-button danger style="width: 100%" @click="() => { eraseOrder(); deleteFunc(order.id) }">
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

.order-card {
    width: 100%;
    border: 1px solid black;
    margin-top: 8px;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding-left: 12px;
    padding-right: 8px;

}
</style>
