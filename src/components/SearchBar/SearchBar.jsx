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
    const wowImport = '{"group":["1-Marcethemage-pozzo-delleternita","4-Lectør-pozzo-delleternita","4-Ehtelwen-pozzo-delleternita","1-Dozzle-pozzo-delleternita","1-Lunacrescia-pozzo-delleternita","1-Fridar-pozzo-delleternita","1-Noeren-pozzo-delleternita","1-Erentross-pozzo-delleternita","1-Flicchete-pozzo-delleternita","1-Melmaryllis-pozzo-delleternita","1-Threshold-ysondre","1-Malfattore-pozzo-delleternita","1-Hynlänn-pozzo-delleternita","1-Hugolino-pozzo-delleternita","1-Laisers-pozzo-delleternita","1-Simonceeno-pozzo-delleternita","2-Stopdirnimp-ysondre","2-Lexkradok-pozzo-delleternita","2-Azerane-ysondre"],"queue":["1-Ataría-blackrock","2-Magareork-kazzak","2-Aiced-aggra-portugues","1-Monpierrejr-twisting-nether","1-Ёрка-deathguard"],"activity":664,"region":"eu"}';
    this.setState({ value: wowImport });
  }

  handleChange = (event) => {
    const { getPlayers } = this.props;
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
