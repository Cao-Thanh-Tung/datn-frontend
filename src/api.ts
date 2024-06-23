import axios from "axios";
import { Input as DataInput } from "@/dto/Input";
import { Solution } from "@/dto/Solution";
export async function solvePost(dataInput: DataInput): Promise<Solution | null>{
    let solution: Solution | null = null;
    try {
        solution  = (await axios.post('http://localhost:8080/api/solve',
            dataInput
        )).data as Solution;
    } catch (error) {
        console.error('There was an error!', error);
    }
    return solution;
};
