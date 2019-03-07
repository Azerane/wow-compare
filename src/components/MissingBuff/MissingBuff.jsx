import React from 'react';
import './MissingBuff.css';
import PropTypes from 'prop-types';
import { classArray } from '../../constant';

const getClassRepartition = (group) => {
  const classRepartition = classArray.map(element => ({
    className: element,
    amount: 0,
  }));
  group.forEach((element) => {
    const index = classArray.indexOf(element.class);
    if (index !== -1) {
      classRepartition[index].amount += 1;
    }
  });
  return classRepartition;
};

const BuffIndicator = ({ buffName, buffClass, classRepartition }) => (
  <div style={{ color: classRepartition.filter(classItem => classItem.className === buffClass)[0].amount > 0 ? 'lightgreen' : 'white' }}>
    {buffName}
  </div>
);

BuffIndicator.propTypes = {
  buffName: PropTypes.string.isRequired,
  buffClass: PropTypes.string.isRequired,
  classRepartition: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const MissingBuff = (props) => {
  const { group } = props;
  const classRepartition = getClassRepartition(group);
  return (
    <div className="missing-buff-container">
      <div className="missing-buff-title">
        Buff Indicator
      </div>
      <div className="missing-buff-separator" />
      <BuffIndicator buffName="Arcane Intellect" buffClass="Mage" classRepartition={classRepartition} />
      <BuffIndicator buffName="Power Word: Fortitude" buffClass="Priest" classRepartition={classRepartition} />
      <BuffIndicator buffName="Battle Shout" buffClass="Warrior" classRepartition={classRepartition} />
      <BuffIndicator buffName="Mystic Touch" buffClass="Monk" classRepartition={classRepartition} />
      <BuffIndicator buffName="Chaos Brand" buffClass="Demon Hunter" classRepartition={classRepartition} />
    </div>
  );
};

MissingBuff.propTypes = {
  group: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default MissingBuff;
