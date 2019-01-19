import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../config';
import { getPlayersRequestAction, getPlayersSuccessAction, getPlayersFailureAction } from '../actions/wowImport';
import {
  raiderIoRequest,
  raiderIoSuccess,
  raiderIoFailure,
  warcraftLogRequest,
  warcraftLogSuccess,
  warcraftLogFailure,
  gradesRequest,
  gradesSuccess,
  gradesFailure,
} from '../actions/api';

const wowImport = '{"group":["2-Azesp-hyjal","1-Zoomy-aegwynn","1-Randõm-hyjal","1-Snerz-elune","1-Кугдабыра-blackscar","1-Dott-the-maelstrom","1-Bìnk-khaz-modan","1-Molvaine-silvermoon","1-Rizogaloo-silvermoon","1-Rhuy-outland","2-Infinitypro-argent-dawn","4-Ullabull-frostmane"],"queue":["1-Labrique-bloodhoof","1-Лялялол-blackscar","1-Nutellus-pozzo-delleternita","1-Kellekanon-the-maelstrom"],"activity":495,"region":"eu"}';

class Home extends React.PureComponent {
  componentDidMount() {
    const { getPlayers } = this.props;
    getPlayers(wowImport);
  }

  componentDidUpdate(prevProps) {
    const {
      players,
    } = this.props;
    const oldPlayers = prevProps.players;
    if (players.group.length !== oldPlayers.group.length
      || players.queue.length !== oldPlayers.queue.length) {
      players.group.forEach((player) => {
        this.fetchData(player);
      });
      players.queue.forEach((player) => {
        this.fetchData(player);
      });
    }
  }

  fetchData = (player) => {
    const {
      getRaiderIo,
      getWarcraftLog,
      getGrades,
    } = this.props;
    const roles = ['HEALING', 'DPS', 'ANY', 'TANK', 'ANY', 'ANY', 'ANY'];
    const metricsMapping = {
      DPS: 'dps',
      HEALING: 'hps',
      TANKING: 'krsi',
    };
    const raidName = config.wow_raid.name.toLowerCase();
    getRaiderIo(player.name, player.realm).then((raiderIoProfile) => {
      let playerRole = roles[player.role];
      if (playerRole === 'ANY') playerRole = raiderIoProfile.player.active_spec_role;
      const raidProgression = (Object.prototype.hasOwnProperty.call(raiderIoProfile.player, 'raid_progression')
        && Object.prototype.hasOwnProperty.call(raiderIoProfile.player.raid_progression, raidName)
        ? raiderIoProfile.player.raid_progression[raidName] : {
          heroic_bosses_killed: 0,
          mythic_bosses_killed: 0,
          normal_bosses_killed: 0,
        });
      const raiderIoScore = (Object.prototype.hasOwnProperty.call(raiderIoProfile.player, 'mythic_plus_scores')
        && Object.prototype.hasOwnProperty.call(raiderIoProfile.player.mythic_plus_scores, 'all')
        ? raiderIoProfile.player.mythic_plus_scores.all : 0);
      const ilvl = (Object.prototype.hasOwnProperty.call(raiderIoProfile.player, 'gear')
        && Object.prototype.hasOwnProperty.call(raiderIoProfile.player.gear, 'item_level_equipped')
        ? raiderIoProfile.player.gear.item_level_equipped : 0);
      getWarcraftLog(player.name, player.realm, metricsMapping[playerRole])
        .then((warcraftLogResult) => {
          const data = {
            raidProgression,
            raiderIoScore,
            ilvl,
            parseAvg: (warcraftLogResult.player.warcraftLogRes !== 400
              ? warcraftLogResult.player.parseAvg : 0),
          };
          getGrades(player.name, player.realm, data);
        }).catch(() => {
          const data = {
            raidProgression,
            raiderIoScore,
            ilvl,
            parseAvg: 0,
          };
          getGrades(player.name, player.realm, data);
        });
    });
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
  getGrades: PropTypes.func.isRequired,
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
  getGrades: (playerName, playerRealm, data) => (
    dispatch(gradesRequest(playerName, playerRealm, data))
      .then(result => (
        dispatch(gradesSuccess(result))
      )).catch(() => (
        dispatch(gradesFailure({ name: playerName, realm: playerRealm }))
      ))
  ),
  getWarcraftLog: (playerName, playerRealm, metrics) => (
    dispatch(warcraftLogRequest(playerName, playerRealm, metrics))
      .then(result => (
        dispatch(warcraftLogSuccess({ ...result, warcraftLogRes: 200 }))
      )).catch(error => (
        dispatch(warcraftLogFailure({
          name: playerName,
          realm: playerRealm,
          warcraftLogRes: error.response.status,
        }))
      ))
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
