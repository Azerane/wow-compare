import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './PlayerOverview.css';
import PlayerRecap from './PlayerRecap/PlayerRecap';

const PlayerOverview = ({ part, players }) => {
  const baseGroup = players[part];
  return (
    <div className="player-overview-container">
      <div className="player-overview-title">
        {`${part} overview`}
      </div>
      <div className="player-overview-separator" />
      <table>
        <thead>
          <tr>
            <td>Role</td>
            <td>Name</td>
            <td>Grade</td>
            <td>iLvl</td>
            <td>R.io</td>
            <td>NM</td>
            <td>HM</td>
            <td>MM</td>
            <td>Parse</td>
          </tr>
        </thead>
        <tbody>
          {baseGroup.map(player => (
            <PlayerRecap key={player.name} player={player} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

PlayerOverview.propTypes = {
  players: PropTypes.shape().isRequired,
  part: PropTypes.oneOf(['group', 'queue']).isRequired,
};

const mapStateToProps = state => ({
  players: state.baseReducer.players,
});

export default connect(mapStateToProps)(PlayerOverview);
