import { Vehicle } from "@/dto/Vehicle";
import { ActionPoint } from "@/dto/ActionPoint";
import { Order } from "@/dto/Order";
export class Route {
    public vehicle!: Vehicle;
    public totalDistance!: number;
    public totalDuration!: number;
    public totalWeight!: number;
    public totalStopPoints!: number;
    public pointXES!: ActionPoint[];
    public orderXES!: Order[];
    public arrivalTimes!: number[];
    public leaveTimes!: number[];
    public accumulateDemands!: number[];
    public accumulateDistances!: number[];

    public isEmptyRoute(): boolean {
        if (this.orderXES.length == 0) {
            return true;
        }else{
            return false;
        }

    }
}
