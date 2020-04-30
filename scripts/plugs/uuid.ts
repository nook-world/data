import deepmap from "deep-map";
import { v5 as uuidGen } from "uuid";

const NAMESPACE = "3430238a-4323-42b7-965f-a8fe9227daef";

type GenOb = {
  [key: string]: any;
};

type UUIDInput = string | GenOb;

export const uuid = (data) => {
  return uuidGen(data, NAMESPACE);
};
