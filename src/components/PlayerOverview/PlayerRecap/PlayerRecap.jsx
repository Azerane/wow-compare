import React from 'react';
import PropTypes from 'prop-types';
import './PlayerRecap.css';
import { classColor, itemColor } from '../../../constant';
import config from '../../../config';

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

const getColorFromGrade = (grades, key) => {
  const colorMapping = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  if (typeof (grades) === 'undefined') return 'white';
  return itemColor[colorMapping[grades[key]]];
};

const getColorFromTotalGrade = (grades) => {
  const colorMapping = [
    'Common',
    'Common',
    'Common',
    'Uncommon',
    'Uncommon',
    'Uncommon',
    'Rare',
    'Rare',
    'Rare',
    'Epic',
    'Epic',
    'Epic',
    'Legendary',
    'Legendary',
    'Legendary',
  ];
  if (typeof (grades) === 'undefined') return 'white';
  return itemColor[colorMapping[Math.round(grades.total) - 1]];
}

const getColorFromProgress = (current, max) => {
  const middle = max / 2;
  const scale = 255 / middle;

  const colorMapping = [];
  for (let index = 0; index <= max; index += 1) {
    let colorValue = '';
    if (index <= 0) {
      colorValue = 'rgba(255, 0, 0, 0.2)';
    } else if (index >= max) {
      colorValue = 'rgba(0, 255, 0, 0.8)';
    } else if (index < middle) {
      colorValue = `rgba(255, ${Math.round(index * scale)}, 0, ${0.2 + current * 0.4 / max})`;
    } else {
      colorValue = `rgba(${Math.round(255 - ((index - middle) * scale))}, 255, 0, ${0.2 + current * 0.4 / max})`;
    }
    colorMapping.push(colorValue);
  }
  return colorMapping[current];
};

const ProgressionDisplay = ({ current, max }) => (
  <div style={{ width: `calc(${current * 100 / max}%)`, backgroundColor: getColorFromProgress(current, max), height: '52px' }}>
    <div className="progression-label">{`${current}/${max}`}</div>
  </div>
);

ProgressionDisplay.propTypes = {
  current: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

const PlayerRecap = ({ player }) => (
  <tr>
    <td>{getImageFromRole(player.role)}</td>
    <td style={{ color: classColor[player.class] }}>
      {player.name}
    </td>
    <td style={{ color: getColorFromTotalGrade(player.grades) }}>
      {player.grades
      && player.grades.total
      && getLetterFromGrade(player.grades.total)}
    </td>
    <td style={{ color: getColorFromGrade(player.grades, 'ilvl') }}>
      {player.gear
      && player.gear.item_level_equipped}
    </td>
    <td style={{ color: getColorFromGrade(player.grades, 'score') }}>
      {player.mythic_plus_scores
        && player.mythic_plus_scores.all
        && player.mythic_plus_scores.all.toFixed(0)}
    </td>
    <td className="progression-lign">
      {player.raid_progression
      && player.raid_progression.uldir
      && player.raid_progression.uldir.normal_bosses_killed
      && (
      <ProgressionDisplay
        current={player.raid_progression.uldir.normal_bosses_killed}
        max={config.wow_raid.encounters.length}
      />)}
    </td>
    <td className="progression-lign">
      {player.raid_progression
      && player.raid_progression.uldir
      && player.raid_progression.uldir.heroic_bosses_killed
      && (
      <ProgressionDisplay
        current={player.raid_progression.uldir.heroic_bosses_killed}
        max={config.wow_raid.encounters.length}
      />)}
    </td>
    <td className="progression-lign">
      {player.raid_progression
      && player.raid_progression.uldir
      && player.raid_progression.uldir.mythic_bosses_killed
      && (
      <ProgressionDisplay
        current={player.raid_progression.uldir.mythic_bosses_killed}
        max={config.wow_raid.encounters.length}
      />)}
    </td>
    <td style={{ color: getColorFromGrade(player.grades, 'parse') }}>
      {player.parses
      && player.parses.parseAvg.toFixed(0)}
    </td>
  </tr>
);

PlayerRecap.propTypes = {
  player: PropTypes.shape().isRequired,
};

export default PlayerRecap;
