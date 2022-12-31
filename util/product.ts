import { array, number } from "fp-ts";

export const product = array.reduce(1, number.SemigroupProduct.concat);
