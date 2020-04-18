# @nook-world/data

> Static data used across nook.world applications

### Pre-Requisites

All `@nook-world` packages are published on GitHub. To use them in your application, it's recommended that you configure your npm client to always look for `@nook-world` packages on GitHub.

You can run the following command:

```bash
npm config set '@nook-world:registry' 'https://https://npm.pkg.github.com/'
```

This will make sure that, whenever you install something from the `@nook-world` namespace, it will look for it on GitHub.

You might need to configure a personal access token to download the packages. You can create one [clicking here](https://github.com/settings/tokens/new?description=Github%20Packages&scopes=read:packages,write:packages).

After you create the token, you can execute the following command to save it to your `.npmrc` file:

```bash
npm config set //npm.pkg.github.com/:_authToken [YOUR TOKEN HERE]
```

You only have to do this once.

### Installation

```bash
npm install @nook-world/data
```

### Usage

```javascript
const bugs = require("@nook-world/bugs");
// => Array of all bugs
// => [{bug}, {bug}]
const Tarantula = require("@nook-world/bugs/Tarantula");
// => Just the Tarantula object
//{
//  name: "Tarantula",
//  location: "On ground",
//  price: 8000,
//  times: [{ start: 19, end: 4 }],
//  months: { north: [{ start: 11, end: 4 }], south: [{ start: 5, end: 10 }] },
//  type: "Bug",
//  activeMonths: { north: [1, 2, 3, 4, 11, 12], south: [5, 6, 7, 8, 9, 10] },
//  activeHours: [0, 1, 2, 3, 4, 19, 20, 21, 22, 23],
//  allYear: false,
//  allDay: false,
//  id: 79,
//};
```

### Development

The project is structured in a `.jsonl` format. All the files are located in the `src` folder. Here's an example from [`src/bugs.jsonl`](src/bugs.jsonl):

```json
{"name":"Common Butterfly","location":"Flying","price":160,"times":[{"start":4,"end":19}],"months":{"north":[{"start":9,"end":6}],"south":[{"start":3,"end":12}]},"type":"Bug","activeMonths":{"north":[1,2,3,4,5,6,9,10,11,12],"south":[3,4,5,6,7,8,9,10,11,12]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"allYear":false,"allDay":false,"id":1}
{"name":"Yellow Butterfly","location":"Flying","price":160,"times":[{"start":4,"end":19}],"months":{"north":[{"start":3,"end":6},{"start":9,"end":10}],"south":[{"start":3,"end":4},{"start":9,"end":12}]},"type":"Bug","activeMonths":{"north":[3,4,5,6,9,10],"south":[3,4,9,10,11,12]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"allYear":false,"allDay":false,"id":2}
{"name":"Tiger Butterfly","location":"Flying","price":240,"times":[{"start":4,"end":19}],"months":{"north":[{"start":3,"end":9}],"south":[{"start":9,"end":3}]},"type":"Bug","activeMonths":{"north":[3,4,5,6,7,8,9],"south":[1,2,3,9,10,11,12]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"allYear":false,"allDay":false,"id":3}
{"name":"Peacock Butterfly","location":"Flying","price":2500,"times":[{"start":4,"end":19}],"months":{"north":[{"start":3,"end":6}],"south":[{"start":9,"end":12}]},"type":"Bug","activeMonths":{"north":[3,4,5,6],"south":[9,10,11,12]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"allYear":false,"allDay":false,"id":4}
{"name":"Common Bluebottle","location":"Flying","price":300,"times":[{"start":4,"end":19}],"months":{"north":[{"start":4,"end":8}],"south":[{"start":10,"end":2}]},"type":"Bug","activeMonths":{"north":[4,5,6,7,8],"south":[1,2,10,11,12]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"allYear":false,"allDay":false,"id":5}
{"name":"Paper Kite Butterfly","location":"Flying","price":1000,"times":[{"start":8,"end":19}],"months":"All","type":"Bug","activeMonths":{"north":[1,2,3,4,5,6,7,8,9,10,11,12],"south":[1,2,3,4,5,6,7,8,9,10,11,12]},"activeHours":[8,9,10,11,12,13,14,15,16,17,18,19],"allYear":true,"allDay":false,"id":6}
{"name":"Great Purple Emperor","location":"Flying","price":3000,"times":[{"start":4,"end":19}],"months":{"north":[{"start":5,"end":8}],"south":[{"start":11,"end":2}]},"type":"Bug","activeMonths":{"north":[5,6,7,8],"south":[1,2,11,12]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"allYear":false,"allDay":false,"id":7}
{"name":"Monarch Butterfly","location":"Flying","price":140,"times":[{"start":4,"end":17}],"months":{"north":[{"start":9,"end":11}],"south":[{"start":3,"end":5}]},"type":"Bug","activeMonths":{"north":[9,10,11],"south":[3,4,5]},"activeHours":[4,5,6,7,8,9,10,11,12,13,14,15,16,17],"allYear":false,"allDay":false,"id":8}
{"name":"Emperor Butterfly","location":"Flying","price":4000,"times":[{"start":17,"end":8}],"months":{"north":[{"start":6,"end":9},{"start":12,"end":3}],"south":[{"start":12,"end":3},{"start":6,"end":9}]},"type":"Bug","activeMonths":{"north":[1,2,3,6,7,8,9,12],"south":[1,2,3,6,7,8,9,12]},"activeHours":[0,1,2,3,4,5,6,7,8,17,18,19,20,21,22,23],"allYear":false,"allDay":false,"id":9}
{"name":"Agrias Butterfly","location":"Flying","price":3000,"times":[{"start":8,"end":17}],"months":{"north":[{"start":4,"end":9}],"south":[{"start":11,"end":3}]},"type":"Bug","activeMonths":{"north":[4,5,6,7,8,9],"south":[1,2,3,11,12]},"activeHours":[8,9,10,11,12,13,14,15,16,17],"allYear":false,"allDay":false,"id":10}
[...]
```

Each line of the file is a JSON object. The advantage here over a traditional JSON file (where you would have all these objects inside an array) is that we are able to parse a single line instead of having to parse the whole file.

Edit the line where you need to make changes or add a new line **to the bottom of the file**. If the file has IDs, you should increment the last ID by one for the new object.

### Publishing changes

After you made your changes, create a pull-request against the `master` branch. After you changes have been approved and merged, [@isabelle-nw](/isabelle-nw) will create a new version and publish automatically.

---

**@nook-world/data** © 2020+\*\*
