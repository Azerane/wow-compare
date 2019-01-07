import apiServices from '../services/api';

export const raiderIoSuccess = player => ({
  type: 'RAIDERIO_SUCCESS',
  player,
});

export const raiderIoFailure = error => ({
  type: 'RAIDERIO_FAILURE',
  error,
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

export const warcraftLogFailure = error => ({
  type: 'WARCRAFTLOG_FAILURE',
  error,
});

export const warcraftLogRequest = (playerName, playerRealm) => (dispatch) => {
  dispatch({
    type: 'WARCRAFTLOG_REQUEST',
  });
  return apiServices.getWarcraftLog(playerName, playerRealm);
};
