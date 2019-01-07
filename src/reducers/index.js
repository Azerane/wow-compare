import { combineReducers } from 'redux';

function findPlayer(playerName, playerRealm, players) {
  let base = '';
  let indexFinded = 0;
  players.group.forEach((player, index) => {
    if (
      player.name.toLowerCase() === playerName.toLowerCase()
      && player.realm.toLowerCase().replace('-', ' ') === playerRealm.toLowerCase()
    ) {
      base = 'group';
      indexFinded = index;
    }
  });
  players.queue.forEach((player, index) => {
    if (
      player.name.toLowerCase() === playerName.toLowerCase()
      && player.realm.toLowerCase().replace('-', ' ') === playerRealm.toLowerCase()
    ) {
      base = 'queue';
      indexFinded = index;
    }
  });
  if (base !== '') {
    return {
      base,
      playerName,
      playerRealm,
      index: indexFinded,
    };
  }
  return null;
}

function baseReducer(state = {}, action) {
  switch (action.type) {
    case 'WOW_IMPORT_SUCCESS':
      return Object.assign({}, state, {
        players: action.players,
      });
    case 'RAIDERIO_SUCCESS': {
      const playersFromState = state.players;
      const findedPlayer = findPlayer(action.player.name, action.player.realm, playersFromState);
      if (findedPlayer) {
        if (findedPlayer.base === 'group') {
          return Object.assign({}, state, {
            players: {
              group: playersFromState.group
                .slice(0, findedPlayer.index)
                .concat({ ...playersFromState.group[findedPlayer.index], ...action.player })
                .concat(
                  playersFromState.group.slice(
                    findedPlayer.index + 1,
                    playersFromState.group.length,
                  ),
                ),
              queue: playersFromState.queue,
            },
          });
        }
        return Object.assign({}, state, {
          players: {
            queue: playersFromState.queue
              .slice(0, findedPlayer.index)
              .concat({ ...playersFromState.queue[findedPlayer.index], ...action.player })
              .concat(
                playersFromState.queue.slice(findedPlayer.index + 1, playersFromState.queue.length),
              ),
            group: playersFromState.group,
          },
        });
      }
      return Object.assign({}, state, {});
    }
    case 'WARCRAFTLOG_SUCCESS': {
      const playersFromState = state.players;
      const findedPlayer = findPlayer(action.player.name, action.player.realm, playersFromState);
      if (findedPlayer) {
        if (findedPlayer.base === 'group') {
          return Object.assign({}, state, {
            players: {
              group: playersFromState.group
                .slice(0, findedPlayer.index)
                .concat({
                  ...playersFromState.group[findedPlayer.index],
                  parses: action.player.parses,
                })
                .concat(
                  playersFromState.group.slice(
                    findedPlayer.index + 1,
                    playersFromState.group.length,
                  ),
                ),
              queue: playersFromState.queue,
            },
          });
        }
        return Object.assign({}, state, {
          players: {
            queue: playersFromState.queue
              .slice(0, findedPlayer.index)
              .concat({
                ...playersFromState.queue[findedPlayer.index],
                parses: action.player.parses,
              })
              .concat(
                playersFromState.queue.slice(findedPlayer.index + 1, playersFromState.queue.length),
              ),
            group: playersFromState.group,
          },
        });
      }
      return Object.assign({}, state, {});
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  baseReducer,
});

export default rootReducer;