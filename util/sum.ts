import { array, number } from "fp-ts";

export const sum = array.reduce(0, number.SemigroupSum.concat);
