import { ActionPoint } from "@/dto/ActionPoint";
export class Order {
    static _id = 0;
    public id: number;
    public demand: number;
    public pickup: ActionPoint;
    public delivery: ActionPoint;
    
    constructor(demand: number, pickup: ActionPoint, delivery: ActionPoint) {
        this.id = Order._id++; Order._id;
        this.demand = demand;
        this.pickup = pickup;
        this.delivery = delivery;
    }
}
