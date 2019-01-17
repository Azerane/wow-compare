import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlayersRequestAction, getPlayersSuccessAction, getPlayersFailureAction } from '../actions/wowImport';
import {
  raiderIoRequest,
  raiderIoSuccess,
  raiderIoFailure,
  warcraftLogRequest,
  warcraftLogSuccess,
  warcraftLogFailure,
} from '../actions/api';

const wowImport = '{"group":["2-Azesp-hyjal","1-Zoomy-aegwynn","1-Randõm-hyjal","1-Snerz-elune","1-Кугдабыра-blackscar","1-Dott-the-maelstrom","1-Bìnk-khaz-modan","1-Molvaine-silvermoon","1-Rizogaloo-silvermoon","1-Rhuy-outland","2-Infinitypro-argent-dawn","4-Ullabull-frostmane"],"queue":["1-Labrique-bloodhoof","1-Лялялол-blackscar","1-Nutellus-pozzo-delleternita","1-Kellekanon-the-maelstrom"],"activity":495,"region":"eu"}';

class Home extends React.PureComponent {
  componentDidMount() {
    const { getPlayers } = this.props;
    getPlayers(wowImport);
  }

  componentDidUpdate(prevProps) {
    const { players, getRaiderIo, getWarcraftLog } = this.props;
    const oldPlayers = prevProps.players;
    const roles = ['HEALING', 'DPS', 'ANY', 'TANK', 'ANY', 'ANY', 'ANY'];
    const metricsMapping = {
      DPS: 'dps',
      HEALING: 'hps',
      TANKING: 'krsi',
    };
    if (players.group.length !== oldPlayers.group.length
      || players.queue.length !== oldPlayers.queue.length) {
      players.group.forEach((player) => {
        getRaiderIo(player.name, player.realm).then((raiderIoProfile) => {
          let playerRole = roles[player.role];
          if (playerRole === 'ANY') playerRole = raiderIoProfile.player.active_spec_role;
          getWarcraftLog(player.name, player.realm, metricsMapping[playerRole]);
        });
      });
      players.queue.forEach((player) => {
        getRaiderIo(player.name, player.realm).then((raiderIoProfile) => {
          let playerRole = roles[player.role];
          if (playerRole === 'ANY') playerRole = raiderIoProfile.player.active_spec_role;
          getWarcraftLog(player.name, player.realm, metricsMapping[playerRole]);
        });
      });
    }
  }

  render() {
    const { players } = this.props;
    return (
      <div style={{ height: '800px' }}>
        {players && <div />}
      </div>);
  }
}

Home.propTypes = {
  players: PropTypes.shape().isRequired,
  getPlayers: PropTypes.func.isRequired,
  getRaiderIo: PropTypes.func.isRequired,
  getWarcraftLog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  players: state.baseReducer.players,
});

const mapDispatchToProps = dispatch => ({
  getPlayers: (importedString) => {
    const result = dispatch(getPlayersRequestAction(importedString));
    if (result.error) {
      return dispatch(getPlayersFailureAction(result.error));
    }
    return dispatch(getPlayersSuccessAction(result.players));
  },
  getRaiderIo: (playerName, playerRealm) => (
    dispatch(raiderIoRequest(playerName, playerRealm))
      .then(result => (
        dispatch(raiderIoSuccess(result))
      )).catch(() => (
        dispatch(raiderIoFailure({ name: playerName, realm: playerRealm }))
      ))
  ),
  getWarcraftLog: (playerName, playerRealm, metrics) => (
    dispatch(warcraftLogRequest(playerName, playerRealm, metrics))
      .then(result => (
        dispatch(warcraftLogSuccess(result))
      )).catch(() => (
        dispatch(warcraftLogFailure({ name: playerName, realm: playerRealm }))
      ))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
