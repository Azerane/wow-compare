import React from 'react';
import './ClassRepartitionGraph.css';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { classArray, classColor } from '../../constant';

const getClassRepartition = (group) => {
  const classRepartition = classArray.map(element => ({
    className: element,
    amount: 0.1,
  }));
  group.forEach((element) => {
    const index = classArray.indexOf(element.class);
    if (index !== -1) {
      classRepartition[index].amount += 1;
    }
  });
  return classRepartition;
};

const CustomizedAxisTick = (props) => {
  const {
    x, y, payload, data,
  } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-6} y={0} dy={16} fill={classColor[data[payload.index].className]}>
        {Math.round(data[payload.index].amount)}
      </text>
    </g>
  );
};

CustomizedAxisTick.propTypes = {
  payload: PropTypes.shape(),
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
};

CustomizedAxisTick.defaultProps = {
  payload: {
    index: 0,
  },
  x: 0,
  y: 0,
};

const getPlayersByClass = (group, className) => (
  group.filter(player => player.class === className)
);

const CustomTooltip = (props) => {
  const {
    active, payload, group,
  } = props;
  if (payload.length === 0) {
    return null;
  }
  const { className } = payload[0].payload;
  let playerArray = [];
  if (typeof (className) !== 'undefined') {
    playerArray = getPlayersByClass(group, className);
  }
  if (active && playerArray.length !== 0) {
    return (
      <div className="custom-tooltip">
        <div className="custom-tooltip-header">
          <div className="custom-tooltip-icon">
            <img src={`/media/classIcon/${className.replace(/\s/g, '').toLowerCase()}.svg`} alt="class icon" />
          </div>
          <div className="custom-tooltip-title" style={{ color: classColor[className] }}>
            {className}
          </div>
        </div>
        <div className="custom-tooltip-content">
          {playerArray.map(player => (
            <div key={player.name + player.realm} style={{ color: classColor[className] }}>{`${player.name} - ${player.realm}`}</div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  payload: PropTypes.shape(),
  group: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  active: PropTypes.bool.isRequired,
};

CustomTooltip.defaultProps = {
  payload: {
    index: 0,
  },
};

const ClassRepartitionGraph = (props) => {
  const { group } = props;
  const classRepartition = getClassRepartition(group);
  return (
    <div className="class-repartition-container">
      <div className="class-repartition-title">
        Class Repartition
      </div>
      <div className="class-repartition-separator" />
      <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
        <BarChart
          data={classRepartition}
        >
          <XAxis
            dataKey="amount"
            tickLine={false}
            interval={0}
            tick={<CustomizedAxisTick data={classRepartition} />}
          />
          <Tooltip content={CustomTooltip} group={group} />
          <Bar
            dataKey="amount"
            radius={[10, 10, 0, 0]}
          >
            { classRepartition.map(entry => (
              <Cell key={entry.className} fill={classColor[entry.className]} />
            ))
          }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

ClassRepartitionGraph.propTypes = {
  group: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ClassRepartitionGraph;
