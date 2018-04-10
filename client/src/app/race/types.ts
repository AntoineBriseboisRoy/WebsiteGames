import { Skybox } from "./skybox/skybox";
import { AmbientLight } from "three";

export default {
    Car: Symbol("Car")
};

export type Tuple = [Skybox, AmbientLight];
