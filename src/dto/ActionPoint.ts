import { Position } from "@/dto/Position";

export class ActionPoint {
    public static _id = 0;
    public id: number;
    public action: string;
    public position: Position;
    public earliest: number;
    public latest: number;
    public serviceTime: number;
    public waitingTime: number;

    constructor(action: string, position: Position, earliest: number, latest: number, serviceTime: number, waitingTime: number) {
        this.id = ActionPoint._id++;
        this.action = action;
        this.position = position;
        this.earliest = earliest;
        this.latest = latest;
        this.serviceTime = serviceTime;
        this.waitingTime = waitingTime;
    }
}
