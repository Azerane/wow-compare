import apiServices from '../services/api';

export const raiderIoSuccess = player => ({
  type: 'RAIDERIO_SUCCESS',
  player,
});

export const raiderIoFailure = player => ({
  type: 'RAIDERIO_FAILURE',
  player,
});

export const raiderIoRequest = (playerName, playerRealm) => (dispatch) => {
  dispatch({
    type: 'RAIDERIO_REQUEST',
  });
  return apiServices.getRaiderIo(playerName, playerRealm);
};

export const warcraftLogSuccess = player => ({
  type: 'WARCRAFTLOG_SUCCESS',
  player,
});

export const warcraftLogFailure = player => ({
  type: 'WARCRAFTLOG_FAILURE',
  player,
});

export const warcraftLogRequest = (playerName, playerRealm, metrics) => (dispatch) => {
  dispatch({
    type: 'WARCRAFTLOG_REQUEST',
  });
  return apiServices.getWarcraftLog(playerName, playerRealm, metrics);
};

export const gradesSuccess = player => ({
  type: 'GRADES_SUCCESS',
  player,
});

export const gradesFailure = player => ({
  type: 'GRADES_FAILURE',
  player,
});

export const gradesRequest = (playerName, playerRealm, data) => (dispatch) => {
  dispatch({
    type: 'GRADES_REQUEST',
  });
  return apiServices.getGrades(playerName, playerRealm, data);
};
