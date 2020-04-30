import * as acnhTravel from "../acnh-travel.json";
import { writeFileSync as write } from "fs-extra";

const createFile = ([name, content]) => {
  const filename = `out/${name}.jsonl`;
  console.log(`Writing ${filename}`);
  write(
    filename,
    Object.values(content)
      .map((x) => JSON.stringify(x))
      .join("\n")
  );
  return [name, content];
};

const pluck = (fromObject) => (key) => {
  return fromObject[key];
};

export const pluckFrom = (keyToMatch) => (keysToPluck: string[] | "all") => (
  objectEntries
) => {
  const [currentKey, fromObjectArray] = objectEntries;
  if (keyToMatch !== currentKey || keysToPluck === "all") {
    return objectEntries;
  }
  const plucked = fromObjectArray.map((fromObject) => {
    const pluckFromObject = pluck(fromObject);
    return keysToPluck.reduce((plucked, keyToPluck) => {
      if (!pluckFromObject(keyToPluck)) {
        return plucked;
      }
      return {
        ...plucked,
        [keyToPluck]: pluckFromObject(keyToPluck),
      };
    }, {});
  });
  return [currentKey, plucked];
};

(function () {
  Object.entries(acnhTravel)
    .filter(([key, value]) => {
      return Array.isArray(value) && (value as any[]).length > 0;
    })
    .map(createFile);
})();
