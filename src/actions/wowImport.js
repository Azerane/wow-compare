import wowImportService from '../services/wowImport';

export const getPlayersSuccessAction = players => ({
  type: 'WOW_IMPORT_SUCCESS',
  players,
});

export const getPlayersFailureAction = error => ({
  type: 'WOW_IMPORT_FAILURE',
  error,
});

export const getPlayersRequestAction = importedString => (dispatch) => {
  dispatch({
    type: 'WOW_IMPORT_REQUEST',
  });
  return wowImportService.importPlayersFromJSON(importedString);
};
