import React from 'react';
import PropTypes from 'prop-types';
import './PlayerRecap.css';
import { classColor } from '../../../constant';

const getLetterFromGrade = (grade) => {
  const grades = ['D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S-', 'S', 'S+'];
  return grades[Math.round(grade) - 1];
};

const getImageFromRole = (role) => {
  let imageName = '';
  if (role === '1') imageName = 'dps';
  else if (role === '2') imageName = 'heal';
  else if (role === '4') imageName = 'tank';
  else imageName = 'none';
  return <img src={`/media/${imageName}.png`} alt="role" />;
};

const PlayerRecap = ({ player }) => (
  <tr>
    <td>{getImageFromRole(player.role)}</td>
    <td style={{ color: classColor[player.class] }}>
      {player.name}
    </td>
    <td>{player.grades && player.grades.total && getLetterFromGrade(player.grades.total)}</td>
    <td>{player.gear && player.gear.item_level_equipped}</td>
    <td>
      {player.mythic_plus_scores
        && player.mythic_plus_scores.all
        && player.mythic_plus_scores.all.toFixed(0)}
    </td>
    <td>
      {player.raid_progression
      && player.raid_progression.uldir
      && player.raid_progression.uldir.normal_bosses_killed}
    </td>
    <td>
      {player.raid_progression
      && player.raid_progression.uldir
      && player.raid_progression.uldir.heroic_bosses_killed}
    </td>
    <td>
      {player.raid_progression
      && player.raid_progression.uldir
      && player.raid_progression.uldir.mythic_bosses_killed}
    </td>
    <td>{player.parses && player.parses.parseAvg}</td>
  </tr>
);

PlayerRecap.propTypes = {
  player: PropTypes.shape().isRequired,
};

export default PlayerRecap;
