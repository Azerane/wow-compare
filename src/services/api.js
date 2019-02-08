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

const getRaidProgressionGrade = (raidProgression) => {
  const raidLength = config.wow_raid.encounters.length;
  let grade = 0;
  if (raidProgression.mythic_bosses_killed >= raidLength / 3) grade = 4;
  else if (raidProgression.heroic_bosses_killed >= raidLength) grade = 3;
  else if (raidProgression.heroic_bosses_killed >= raidLength / 2) grade = 2;
  else if (raidProgression.normal_bosses_killed >= raidLength) grade = 1;
  else grade = 0;
  return grade;
};

const getRaideIoScoreGrade = (score) => {
  let grade = 0;
  if (score >= 1500) grade = 4;
  else if (score >= 1000) grade = 3;
  else if (score >= 750) grade = 2;
  else if (score >= 500) grade = 1;
  else grade = 0;
  return grade;
};

const getParseGrade = (parse) => {
  let grade = 0;
  if (parse >= 80) grade = 4;
  else if (parse >= 60) grade = 3;
  else if (parse >= 45) grade = 2;
  else if (parse >= 30) grade = 1;
  else grade = 0;
  return grade;
};

const getIlvlGrade = (ilvl) => {
  let grade = 0;
  if (ilvl >= 415) grade = 4;
  else if (ilvl >= 400) grade = 3;
  else if (ilvl >= 390) grade = 2;
  else if (ilvl >= 380) grade = 1;
  else grade = 0;
  return grade;
};

async function getGrades(playerName, playerRealm, data) {
  const {
    raidProgression, raiderIoScore, ilvl, parseAvg,
  } = data;
  const progressionGrade = getRaidProgressionGrade(raidProgression);
  const scoreGrade = getRaideIoScoreGrade(raiderIoScore);
  const ilvlGrade = getIlvlGrade(ilvl);
  const parseGrade = getParseGrade(parseAvg);
  const total = ((progressionGrade + scoreGrade + ilvlGrade + parseGrade) * 14) / 16;
  return {
    name: playerName,
    realm: playerRealm,
    grades: {
      progression: progressionGrade,
      score: scoreGrade,
      ilvl: ilvlGrade,
      parse: parseGrade,
      total,
    },
  };
}

const apiServices = {
  getRaiderIo,
  getWarcraftLog,
  getGrades,
};

export default apiServices;
