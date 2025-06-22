import {Body} from "matter-js";

export type MapResult = {
    walls: Body[];
    startBlock: Body;
    goalBlock: Body;
};