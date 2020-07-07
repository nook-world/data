# @nook-world/data

> Static data used across nook.world applications

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
[...]
```

Each line of the file is a JSON object. The advantage here over a traditional JSON file (where you would have all these objects inside an array) is that we are able to parse a single line instead of having to parse the whole file.

Edit the line where you need to make changes or add a new line **to the bottom of the file**. If the file has IDs, you should increment the last ID by one for the new object.

### Publishing changes

After you made your changes, create a pull-request against the `master` branch. After you changes have been approved and merged, [@isabelle-nw](/isabelle-nw) will create a new version and publish automatically.

### Adding new sources

If you want to add a new source, add the corresponding file to the `src/` folder
and edit the `meta.jsonl` file with the configuration required.

Here's an example:

```json
{"source": "src/bugs.jsonl", "type": "collection", "output": "./bugs.js"}
{"source": "src/bugs.jsonl", "type": "pluck", "output": "./bug/{name}.js"}
```

##### `source: string`

This is the path to a `jsonl` file, relative to `meta.jsonl`. Each line of this
file should be a valid JSON.

##### `type: "collection" | "pluck"`

Which type of generator to apply to this source file. The `collection` type,
simply put, transforms the `jsonl` file into a traditional `json`. The `pluck`
type will extract each line to it's own file.

##### `output: string`

The name of the file you wish to generate. You can nest any number of subfolders
and they will be created if they do not yet exist. You can use a property name to
generate the file name for each item when using the `pluck` type generator. For the example above, `{name}` would be
replaced with `Common Butterfly` for the first line of the file. You can also
traverse the path using dot notation: `{details.name}` would reach into details and get the value of name.

---

**@nook-world/data** © 2020+
