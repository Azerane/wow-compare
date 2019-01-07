import axios from 'axios';
import config from '../config';

const reformatData = (warcraftLogParses, playerName, playerRealm) => {
  const parses = {};
  config.wow_raid.encounters.forEach((encounter) => {
    parses[encounter.id] = {
      id: encounter.id,
      name: encounter.name,
      parses: [],
    };
  });
  warcraftLogParses.forEach((parse) => {
    parses[parse.encounterID].parses.push(parse);
  });
  return {
    name: playerName,
    realm: playerRealm,
    parses,
  };
};

async function getRaiderIo(playerName, playerRealm) {
  return axios
    .get('https://raider.io/api/v1/characters/profile?', {
      params: {
        region: 'eu',
        realm: playerRealm,
        name: playerName,
        fields: 'gear,raid_progression,mythic_plus_scores',
      },
    })
    .then(response => response.data)
    .catch((error) => {
      throw error;
    });
}

async function getWarcraftLog(playerName, playerRealm) {
  return axios
    .get(`https://www.warcraftlogs.com/v1/parses/character/${playerName}/${playerRealm}/eu`, {
      params: {
        api_key: config.api_key.warcraft_log,
      },
    })
    .then(response => reformatData(response.data, playerName, playerRealm))
    .catch((error) => {
      throw error;
    });
}

const apiServices = {
  getRaiderIo,
  getWarcraftLog,
};

export default apiServices;
