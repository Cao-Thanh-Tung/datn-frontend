import type { Vehicle } from "@/dto/Vehicle";
import type { Order } from "@/dto/Order";

export const distanceTypes = ["OSM", "HAVERSINE", "VINCENTY"];
export const constraintList = ["TIME_WINDOW_CONSTRAINT", "CAPACITY_CONSTRAINT"];
export const objectiveList = ["MAX_SERVE_ABLE_ORDER_OBJECTIVE", "MIN_DISTANCE_OBJECTIVE", "MIN_DURATION_OBJECTIVE"];
export const strategies = ["FIRST_FIT_ORDER_ASSIGN_STRATEGY", "MIN_DISTANCE_FIT_ORDER_ASSIGN_STRATEGY", "ROUND_ROBIN_ORDER_ASSIGN_STRATEGY", "SHUFFLE_FIRST_FIT_STRATEGY", "SHUFFLE_MIN_DISTANCE_FIT_STRATEGY", "SHUFFLE_ROUND_ROBIN_STRATEGY"];

const defaultConfig = {
    distanceType: distanceTypes[0],
    constraints: [...constraintList],
    objectives: [...objectiveList],
    strategy: strategies[0],
    numShuffle: 30,
}

export class Input {
    vehicles: Vehicle[] = [];
    orders: Order[] = [];
    distanceType: String = distanceTypes[0];
    constraints: String[] = [];
    objectives: String[] = [];
    strategy: String = strategies[0];
    numShuffle: number = 30;

    constructor(){
        this.vehicles = [];
        this.orders = [];
        this.distanceType = defaultConfig.distanceType;
        this.constraints = [...defaultConfig.constraints];
        this.objectives = [...defaultConfig.objectives];
        this.strategy = defaultConfig.strategy;
        this.numShuffle = defaultConfig.numShuffle;
    }

    resetConfig() {
        this.distanceType = defaultConfig.distanceType;
        this.constraints = [...defaultConfig.constraints];
        this.objectives = [...defaultConfig.objectives];
        this.strategy = defaultConfig.strategy;
        this.numShuffle = defaultConfig.numShuffle;
    }
}
