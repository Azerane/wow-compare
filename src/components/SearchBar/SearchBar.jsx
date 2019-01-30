import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlayersRequestAction, getPlayersSuccessAction, getPlayersFailureAction } from '../../actions/wowImport';
import './SearchBar.css';

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentDidMount() {
    const wowImport = '{"group":["2-Azesp-hyjal","1-Zoomy-aegwynn","1-Randõm-hyjal","1-Snerz-elune","1-Кугдабыра-blackscar","1-Dott-the-maelstrom","1-Bìnk-khaz-modan","1-Molvaine-silvermoon","1-Rizogaloo-silvermoon","1-Rhuy-outland","2-Infinitypro-argent-dawn","4-Ullabull-frostmane"],"queue":["1-Labrique-bloodhoof","1-Лялялол-blackscar","1-Nutellus-pozzo-delleternita","1-Kellekanon-the-maelstrom"],"activity":495,"region":"eu"}';
    this.setState({ value: wowImport });
  }

  handleChange = (event) => {
    const { getPlayers, refresh } = this.props;
    this.setState({ value: event.target.value });
    getPlayers(event.target.value);
  };

  render() {
    const { value } = this.state;
    return (
      <input
        className="input-bar"
        type="text"
        placeholder="Enter Raider.io addon exported string here"
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

SearchBar.propTypes = {
  getPlayers: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getPlayers: (importedString) => {
    const result = dispatch(getPlayersRequestAction(importedString));
    if (result.error) {
      return dispatch(getPlayersFailureAction(result.error));
    }
    return dispatch(getPlayersSuccessAction(result.players));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(SearchBar);
