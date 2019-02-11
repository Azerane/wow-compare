import React from 'react';
import './RoleRepartitionGraph.css';
import PropTypes from 'prop-types';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from 'recharts';

const getDpsSpecRole = (className, spec) => {
  const MELEE = 2;
  const RANGE = 3;
  switch (spec) {
    case 'frost':
      return (className === 'mage' ? RANGE : MELEE);
    case 'unholy':
      return MELEE;
    case 'havoc':
      return MELEE;
    case 'feral':
      return MELEE;
    case 'balance':
      return RANGE;
    case 'beastmastery':
      return RANGE;
    case 'marksmanship':
      return RANGE;
    case 'survival':
      return MELEE;
    case 'arcane':
      return RANGE;
    case 'fire':
      return RANGE;
    case 'windwalker':
      return MELEE;
    case 'retribution':
      return MELEE;
    case 'shadow':
      return RANGE;
    case 'assassination':
      return MELEE;
    case 'outlaw':
      return MELEE;
    case 'sublety':
      return MELEE;
    case 'elemental':
      return RANGE;
    case 'enhancement':
      return MELEE;
    case 'affliction':
      return RANGE;
    case 'destruction':
      return RANGE;
    case 'demonology':
      return RANGE;
    case 'arms':
      return MELEE;
    case 'fury':
      return MELEE;
    default:
      return MELEE;
  }
};

const getRoleRepartition = (group) => {
  const roleRepartition = [
    {
      name: 'Tank',
      amount: 0,
    },
    {
      name: 'Heal',
      amount: 0,
    },
    {
      name: 'Melee DPS',
      amount: 0,
    },
    {
      name: 'Range DPS',
      amount: 0,
    },
  ];
  group.forEach((element) => {
    if (element.role === '2') {
      roleRepartition[1].amount += 1;
    } else if (element.role === '4') {
      roleRepartition[0].amount += 1;
    } else {
      let role = 2;
      if (typeof (element.class) !== 'undefined' && typeof (element.active_spec_name) !== 'undefined') {
        role = getDpsSpecRole(element.class.replace(/\s/g, '').toLowerCase(), element.active_spec_name.replace(/\s/g, '').toLowerCase());
      }
      roleRepartition[role].amount += 1;
    }
  });
  return roleRepartition;
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul>
      {
        payload.map((entry, index) => (
          <div style={{ color: entry.payload.fill, fontSize: '20px' }}>
            {`${entry.payload.name}: ${entry.payload.value}`}
          </div>
        ))
      }
    </ul>
  );
};

renderLegend.propTypes = {
  payload: PropTypes.shape().isRequired,
};

const RoleRepartitionGraph = (props) => {
  const { group } = props;
  const roleRepartition = getRoleRepartition(group);
  const COLORS = ['#C3203B', '#00C49F', '#FFBB28', '#0088FE'];
  return (
    <div className="role-repartition-container">
      <div className="role-repartition-title">
        Role Repartition
      </div>
      <div className="role-repartition-separator" />
      <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
        <PieChart>
          <Pie
            data={roleRepartition}
            cx={80}
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="amount"
            label
          >
            {
              roleRepartition.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} stroke="rgba(0, 0, 0, 0)" />)
            }
          </Pie>
          <Legend content={renderLegend} layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

RoleRepartitionGraph.propTypes = {
  group: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default RoleRepartitionGraph;
