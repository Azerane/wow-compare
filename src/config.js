const config = {
  api_key: {
    warcraft_log: 'cfefded20019450f0d52da21e65324a2',
  },
  wow_raid: {
    id: 21,
    name: "Battle of Dazar'alor",
    frozen: false,
    encounters: [
      {
        id: 2265,
        name: 'Champion of the Light',
        npcID: 144680,
      },
      {
        id: 2266,
        name: 'Jadefire Masters',
        npcID: 144690,
      },
      {
        id: 2263,
        name: 'Grong',
        npcID: 144637,
      },
      {
        id: 2271,
        name: 'Opulence',
        npcID: 145261,
      },
      {
        id: 2268,
        name: 'Conclave of the Chosen',
        npcID: 144747,
      },
      {
        id: 2272,
        name: 'King Rastakhan',
        npcID: 145616,
      },
      {
        id: 2276,
        name: 'Mekkatorque',
        npcID: 144796,
      },
      {
        id: 2280,
        name: 'Stormwall Blockade',
        npcID: 146256,
      },
      {
        id: 2281,
        name: 'Lady Jaina Proudmoore',
        npcID: 146416,
      },
    ],
    brackets: {
      min: 370,
      max: 427,
      bucket: 3,
      type: 'Item Level',
    },
  },
};

export default config;
