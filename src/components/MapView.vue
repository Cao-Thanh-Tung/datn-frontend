<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parksList, positionsList } from '@/dto/Position';
import eventBus from '@/eventBus';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import type { Route } from '@/dto/Route';
import type { Order } from '@/dto/Order';

const mapContainer = ref(null)
let map: L.Map;
let routingControl: L.Routing.Control | null = null;
const routes: Map<number, L.Routing.Control> = new Map();
const routeList: L.Routing.Control[] = [];
type point = {
    lat: number,
    lng: number
}
const colors = [
    '#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF',
    '#FF33FF', '#FF3366', '#3366FF', '#33FF66', '#6633FF',
    '#FF6633', '#33FF33', '#6633FF', '#FF33FF', '#FFCC33',
    '#33FFCC', '#CC33FF', '#FF33CC', '#FFCCCC', '#CCFF33',
    '#CCCCFF', '#33CCFF', '#33FFCC', '#FF66FF', '#FF6600',
    '#00FF66', '#6600FF', '#FF0066', '#FF6600', '#66FF00',
    '#0066FF', '#FF0066', '#FF99CC', '#CCFF99', '#99CCFF',
    '#FF99CC', '#99FFCC', '#CC99FF', '#FFCC99', '#FFCCCC',
    '#CCFFFF', '#FFFFCC', '#CCCCFF', '#FFCCFF', '#FFCCFF',
    '#CCFFFF', '#FFFFCC', '#CCCCFF', '#FFCCFF', '#FFCCFF'
];
const drawAllRoutes = (event: any) => {
    const ways: Route[] = event.wayPoints;
    if (routeList.length != 0) {
        return;
    }

    for (let i = 0; i < ways.length; i++) {
        if (ways[i].orderXES.length == 0) {
            continue;
        }
        const color = colors[i % colors.length];
        const wayPoints = ways[i].pointXES;
        const way = wayPoints.map(point => L.latLng(point.position.lat, point.position.lon));
        const route = L.Routing.control({
            waypoints: way,
            routeWhileDragging: true,
            addWaypoints: false,
            draggableWaypoints: false, // Không cho phép kéo các điểm
            removeWaypoints: false, // Không cho phép xóa các điểm
            show: false,
            lineOptions: {
                styles: [{ color: color, weight: 5 }]
            },
            createMarker: function (j: number, waypoint: any, n: number) {
                const marker = L.marker(waypoint.latLng).bindPopup(`Route ${i}\nIndex ${j + 1}\n`);
                return marker;
            }
        }).addTo(map);
        routeList.push(route);
    }
}
const deleteAllRoute = (event: any) => {
    for (const route of routeList) {
        map.removeControl(route);
    }
    routeList.splice(0, routeList.length);
}
type Info = {
    orderId: number,
    type: string,
}
const drawRoute = (event: any) => {
    console.log(event);
    const routeId = event.routeId;
    const wayPoints: point[] = event.wayPoints;
    const info: Info[] = event.infos;
    if (!routes.has(routeId)) {
        const route = L.Routing.control({
            waypoints: wayPoints.map(wayPoint => L.latLng(wayPoint.lat, wayPoint.lng)),
            routeWhileDragging: true,
            addWaypoints: false,
            createMarker: function (j: number, waypoint: any, n: number) {
                if (info[j].type == "park") {
                    const marker = L.marker(waypoint.latLng).bindPopup(`Route ${routeId}\n \n Type: park`);
                    return marker;
                } else {
                    const marker = L.marker(waypoint.latLng).bindPopup(`Route ${routeId}\n Index ${j + 1}\n OrderId: ${info[j].orderId} \n Action: ${info[j].type}`);
                    return marker;
                }
            }

        }).addTo(map);
        routes.set(routeId, route);
    }
}
const eraserRoute = (event: any) => {
    const routeId = event.routeId;
    if (routes.has(routeId)) {
        const route = routes.get(routeId);
        map.removeControl(route!);
        routes.delete(routeId);
    }
};
const clearRoute = (event: any) => {
    routes.forEach((value, key) => {
        map.removeControl(value!);
    })
    routes.clear();
}
type ParkInfo = {
    positionId: number,
    name: String,
    vehicleId: number,
    lat: number,
    lng: number
}
const parkMap: Map<number, L.Marker<any>> = new Map();
const drawPark = (event: any) => {
    const vehicleId: number = event.vehicleId;
    const parkInfo: ParkInfo = event.parkInfo;
    if (!parkMap.has(vehicleId)) {
        const marker = L.marker([parkInfo.lat, parkInfo.lng]).addTo(map)
            .bindPopup(`Position Id: ${parkInfo.positionId}<br>Position Name: ${parkInfo.name} <br> Vehicle Id: ${parkInfo.vehicleId}`)
            .openPopup();
        parkMap.set(vehicleId, marker);
    }
}
const eraserPark = (event: any) => {
    const vehicleId: number = event.vehicleId;
    if (parkMap.has(vehicleId)) {
        const park = parkMap.get(vehicleId);
        map.removeLayer(park!);
        parkMap.delete(vehicleId);
    }
}
const deleteAllParks = (event: any) => {
    parkMap.forEach((value, key) => {
        map.removeLayer(value);
    })
    parkMap.clear();
}

type OrderMark = {
    pickup: L.Marker,
    delivery: L.Marker,
}
const orderMap: Map<number, OrderMark> = new Map<number, OrderMark>();
const drawOrder = (event: any) => {
    const order: Order = event.order;
    if (!orderMap.has(order.id)) {
        const markerPickup = L.marker([order.pickup.position.lat, order.pickup.position.lon]).addTo(map)
            .bindPopup(`Order Id: ${order.id} <br> Position Id: ${order.pickup.position.id}<br>Position Name: ${order.pickup.position.name} <br> Action: pickup`)
            .openPopup();
        const markerDelivery = L.marker([order.delivery.position.lat, order.delivery.position.lon]).addTo(map)
            .bindPopup(`Order Id: ${order.id} <br> Position Id: ${order.delivery.position.id}<br>Position Name: ${order.delivery.position.name} <br> Action: delivery`)
            .openPopup();
        const orderMark: OrderMark = {
            pickup: markerPickup,
            delivery: markerDelivery,
        }
        orderMap.set(order.id, orderMark);
    }
}
const eraserOrder = (event: any) => {
    const orderId: number = event.orderId;
    if (orderMap.has(orderId)) {
        const orderMark = orderMap.get(orderId);
        map.removeLayer(orderMark!.pickup);
        map.removeLayer(orderMark!.delivery);
        orderMap.delete(orderId);
    }
}
const deleteAllOrders = (event: any) => {
    orderMap.forEach((value, key) => {
        map.removeLayer(value.pickup);
        map.removeLayer(value.delivery);
    })
    orderMap.clear();
}

const allParkArray: L.Marker[] = [];
const allPositionArray: L.Marker[] = [];
const drawAllParkArray = (event: any) => {
    for (let i = 0; i < parksList.length; i++) {
        const marker = L.marker([parksList[i].lat, parksList[i].lon]).addTo(map)
            .bindPopup(`Park Id: ${parksList[i].id}<br>Position Name: ${parksList[i].name}<br>Lat: ${parksList[i].lat}<br>Lon: ${parksList[i].lon}`)
            .openPopup();
        allParkArray.push(marker);
    }
}
const eraserAllParkArray = (event: any) => {
    for (let i = 0; i < allParkArray.length; i++) {
        map.removeLayer(allParkArray[i]);
    }
    allParkArray.splice(0, allParkArray.length);
}

const drawAllPositionArray = (event: any) => {
    for (let i = 0; i < positionsList.length; i++) {
        const marker = L.marker([positionsList[i].lat, positionsList[i].lon]).addTo(map)
            .bindPopup(`Position Id: ${positionsList[i].id}<br>Position Name: ${positionsList[i].name}<br>Lat: ${positionsList[i].lat}<br>Lon: ${positionsList[i].lon}`)
            .openPopup();
        allPositionArray.push(marker);
    }
}
const eraserAllPositionArray = (event: any) => {
    for (let i = 0; i < allPositionArray.length; i++) {
        map.removeLayer(allPositionArray[i]);
    }
    allPositionArray.splice(0, allPositionArray.length);
}
onMounted(() => {
    map = L.map(mapContainer?.value!).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    eventBus.on('drawRoute', drawRoute);
    eventBus.on('clearRoute', clearRoute);
    eventBus.on('eraserRoute', eraserRoute);
    eventBus.on('deleteAllRoute', deleteAllRoute);
    eventBus.on('drawAllRoutes', drawAllRoutes);
    eventBus.on('drawPark', drawPark);
    eventBus.on('eraserPark', eraserPark);
    eventBus.on('deleteAllParks', deleteAllParks);
    eventBus.on('drawOrder', drawOrder);
    eventBus.on('eraserOrder', eraserOrder);
    eventBus.on('deleteAllOrders', deleteAllOrders);
    eventBus.on('drawAllParkArray', drawAllParkArray);
    eventBus.on('eraserAllParkArray', eraserAllParkArray);
    eventBus.on('drawAllPositionArray', drawAllPositionArray);
    eventBus.on('eraserAllPositionArray', eraserAllPositionArray);
})


</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100vh;
}
</style>
