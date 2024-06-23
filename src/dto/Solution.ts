import { Route } from "@/dto/Route";
import { Order } from "@/dto/Order";
export class Solution {
 public numVehicleUsed!: number;
  public totalDistance!: number; // km
  public totalServeAbleOrder!: number;
  public totalDuration!: number; // s
  public totalDemand!: number;
  public earliestTime!: number; // s
  public latestTime!: number; // s
  public routes!: Route[];
  public unServeAbleOrders!: Order[];
}
