import axios from 'axios';
import moment from 'moment';
import config from '../config';

const reformatData = (warcraftLogParses, playerName, playerRealm) => {
  const parses = {};
  let parseMax = 0;
  let parseAvg = 0;
  let metricMax = 0;
  let metricAvg = 0;
  config.wow_raid.encounters.forEach((encounter) => {
    parses[encounter.id] = {
      id: encounter.id,
      name: encounter.name,
      parses: [],
    };
  });
  warcraftLogParses.forEach((parse) => {
    if (parse.percentile > parseMax) parseMax = parse.percentile;
    parseAvg += parse.percentile;
    if (parse.total > metricMax) metricMax = parse.total;
    metricAvg += parse.total;
    parses[parse.encounterID].parses.push(parse);
  });
  if (warcraftLogParses.length !== 0) {
    metricAvg /= warcraftLogParses.length;
  }
  if (warcraftLogParses.length !== 0) {
    parseAvg /= warcraftLogParses.length;
  }

  return {
    name: playerName,
    realm: playerRealm,
    data: parses,
    parseAvg,
    parseMax,
    metricMax,
    metricAvg,
  };
};

const saveWacraftLogResult = (playerName, playerRealm, result) => {
  localStorage.setItem(
    `${playerName},${playerRealm}`,
    JSON.stringify({ ...result, timestamp: moment().format() }),
  );
};

const getWarcraftLogResult = (playerName, playerRealm) => {
  const result = JSON.parse(localStorage.getItem(`${playerName},${playerRealm}`));
  if (result && moment(result.timestamp).isSameOrAfter(moment().subtract(1, 'days'))) {
    return result;
  }
  return null;
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

async function getWarcraftLog(playerName, playerRealm, metrics) {
  const oldData = getWarcraftLogResult(playerName, playerRealm);
  if (oldData) {
    const promise = new Promise((resolve, reject) => {
      resolve(oldData);
    });

    return promise.then(res => res);
  }
  return axios
    .get(`https://www.warcraftlogs.com/v1/parses/character/${playerName}/${playerRealm}/eu`, {
      params: {
        api_key: config.api_key.warcraft_log,
        metric: metrics,
      },
    })
    .then((response) => {
      const data = reformatData(response.data, playerName, playerRealm);
      saveWacraftLogResult(playerName, playerRealm, data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

const apiServices = {
  getRaiderIo,
  getWarcraftLog,
};

export default apiServices;
