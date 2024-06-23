import { Position } from "@/dto/Position";

export class Vehicle {
    static _id = 0;
    public id: number;
    public capacity: number;
    public park: Position;
    public earliest: number;
    public latest: number;
    constructor(capacity: number, park: Position, earliest: number, latest: number) {
        this.id = Vehicle._id++;
        this.capacity = capacity;
        this.park = park;
        this.earliest = earliest;
        this.latest = latest
    }
} 
