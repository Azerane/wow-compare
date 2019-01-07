const config = {
  api_key: {
    warcraft_log: 'cfefded20019450f0d52da21e65324a2',
  },
  wow_raid: {
    id: 19,
    name: 'Uldir',
    frozen: false,
    encounters: [
      {
        id: 2144,
        name: 'Taloc',
        npcID: 137119,
      },
      {
        id: 2141,
        name: 'MOTHER',
        npcID: 135452,
      },
      {
        id: 2128,
        name: 'Fetid Devourer',
        npcID: 133298,
      },
      {
        id: 2136,
        name: "Zek'voz",
        npcID: 134445,
      },
      {
        id: 2134,
        name: 'Vectis',
        npcID: 134442,
      },
      {
        id: 2145,
        name: 'Zul',
        npcID: 138967,
      },
      {
        id: 2135,
        name: 'Mythrax',
        npcID: 134546,
      },
      {
        id: 2122,
        name: "G'huun",
        npcID: 132998,
      },
    ],
    brackets: {
      min: 340,
      max: 397,
      bucket: 3,
      type: 'Item Level',
    },
    partitions: [
      {
        name: '8.0',
        compact: '8.0',
      },
      {
        name: '8.1',
        compact: '8.1',
        default: true,
      },
    ],
  },
};

export default config;
