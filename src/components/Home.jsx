import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../config';
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
import './Home.css';
import Header from './Header/Header';
import SearchBar from './SearchBar/SearchBar';
import PlayerOverview from './PlayerOverview/PlayerOverview';

class Home extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const {
      players,
    } = this.props;
    const oldPlayers = prevProps.players;
    if (!this.arrayCompare(players.group, oldPlayers.group)) {
      console.warn('refresh group');
      players.group.forEach((player) => {
        this.fetchData(player);
      });
    }
    if (!this.arrayCompare(players.queue, oldPlayers.queue)) {
      console.warn('refresh queue');
      players.queue.forEach((player) => {
        this.fetchData(player);
      });
    }
  }

  arrayCompare = (array1, array2) => {
    if (array1.length !== array2.length) return false;
    if (array1.length === 0) return true;
    let isSame = true;
    array1.forEach((element, index) => {
      if (element.name !== array2[index].name) isSame = false;
    });
    return isSame;
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
      <div>
        <Header />
        <div className="main-container">
          <SearchBar />
          {players.group.length > 0 && <PlayerOverview part="group" />}
          {players.queue.length > 0 && <PlayerOverview part="queue" />}
        </div>
      </div>);
  }
}

Home.propTypes = {
  players: PropTypes.shape().isRequired,
  getRaiderIo: PropTypes.func.isRequired,
  getWarcraftLog: PropTypes.func.isRequired,
  getGrades: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  players: state.baseReducer.players,
});

const mapDispatchToProps = dispatch => ({
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
