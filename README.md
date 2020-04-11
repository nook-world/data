# @nook-world/data

> Static data used across nook.world applications

### Pre-Requisites

All `@nook-world` packages are published on GitHub. To use them in your
application, it's recommended that you configure your npm client to always look
for `@nook-world` packages on GitHub.

You can run the following command:

```bash
npm config set '@nook-world:registry' 'https://https://npm.pkg.github.com/'
```

This will make sure that, whenever you install something from the `@nook-world`
namespace, it will look for it on GitHub.

### Installation

```bash
npm install @nook-world/data
```

### Usage

```javascript
const bugs = require("@nook-world/data/critters/bugs");
// => Array of all bugs
// => [{bug}, {bug}]
const Tarantula = require("@nook-world/data/critter/bugs/Tarantula");
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

---

**@nook-world/data** © 2020+\*\*
