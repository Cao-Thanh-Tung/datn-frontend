import { Position, positionsList, parksList } from '@/dto/Position';
import { Vehicle } from '@/dto/Vehicle';
import { Order } from '@/dto/Order';
import { ActionPoint } from '@/dto/ActionPoint';
export class GenerateTestData {
    static capacities: number[] = [2000, 5000, 7000, 10000];

    static getRandPosition(): Position {
        const len = positionsList.length;
        return positionsList[Math.floor(Math.random() * len) % len];
    }

    static getRandPark(): Position {
        const len = parksList.length;
        return parksList[Math.floor(Math.random() * len) % len];
    }

    static getOtherRandPosition(p: Position): Position {
        let temp = this.getRandPosition();
        const len = positionsList.length;
        if (temp.id === p.id) {
            temp = positionsList[(temp.id + 20) % len];
        }
        return temp;
    }

    static getRandCapacity(): number {
        return this.capacities[Math.floor(Math.random() * 4) % 4];
    }

    static getRandDemand(): number {
        return Math.random() * 1000;
    }

    static getRandTimeWindow(): number[] {
        const firstTime = Math.random() * 10 + 5;
        const secondTime = firstTime + Math.random() * 0.5 + 0.5;
        const firstTime1 = secondTime + Math.random() * 2 + 3;
        const secondTime1 = firstTime1 + Math.random() * 0.5 + 0.5;
        return [firstTime, secondTime, firstTime1, secondTime1];
    }

    static generateVehicle(vNum: number): Vehicle[] {
        const hourTime = 60 * 60;
        const vehicles: Vehicle[] = new Array(vNum);
        for (let i = 0; i < vNum; i++) {
            vehicles[i] = new Vehicle(this.getRandCapacity(), this.getRandPark(), hourTime * 4, hourTime * 22);
        }
        return vehicles;
    }

    static generateOrder(oNum: number): Order[] {
        const hourTime = 60 * 60;
        const orders: Order[] = new Array(oNum);
        for (let i = 0; i < oNum; i++) {
            const rangeTime = this.getRandTimeWindow();
            const pickupPosition = this.getRandPosition();
            const pickupPoint = new ActionPoint("pickup", pickupPosition, Math.round(rangeTime[0] * hourTime), Math.round(rangeTime[1] * hourTime), 5 * 60, 5 * 60);
            const deliveryPosition = this.getOtherRandPosition(pickupPosition);
            const deliveryPoint = new ActionPoint("delivery", deliveryPosition, Math.round(rangeTime[2] * hourTime), Math.round(rangeTime[3] * hourTime), 5 * 60, 5 * 60);
            orders[i] = new Order(this.getRandDemand(), pickupPoint, deliveryPoint);
        }
        return orders;
    }
}
