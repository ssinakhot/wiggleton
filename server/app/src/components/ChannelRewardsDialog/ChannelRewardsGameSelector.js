import React from "react";
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import Autocomplete, {createFilterOptions} from "@material-ui/lab/Autocomplete";
import { addGame, removeGame, setActiveGame, enableOnTwitch, disableOnTwitch, updateRewardTwitchId } from "../../redux/channelRewards";
import Button from "@material-ui/core/Button";

const mapStateToProps = (state, props) => {
  return {
    games: state.channelRewards.games,
    activeGame: state.channelRewards.activeGame,
  }
}

const mapDispatchToProps = {
  addGame,
  removeGame,
  setActiveGame,
  enableOnTwitch,
  disableOnTwitch,
  updateRewardTwitchId,
}

const filter = createFilterOptions();

function ChannelRewardsGameSelector({games, addGame, removeGame, setActiveGame, activeGame, enableOnTwitch, disableOnTwitch, updateRewardTwitchId}) {
  const gameList = Object.keys(games).map(name => { return { title: name } })

  return <div>
      <Autocomplete
        fullWidth={false}
        size={"small"}
        value={{ title: activeGame }}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            addGame(newValue)
          } else if (newValue && newValue.removeValue) {
            removeGame(newValue.inputValue)
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            addGame(newValue.inputValue)
          } else {
            setActiveGame(newValue?.title)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const exactMatch = filtered.length === 1 && filtered[0].title.toLowerCase() === params.inputValue.toLowerCase()

          // Suggest the creation of a new value
          if (exactMatch) {
            params.inputValue = filtered[0].title
            filtered.push({
              removeValue: true,
              inputValue: params.inputValue,
              title: `Remove "${params.inputValue}"`,
            });
          } else if (!exactMatch && params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={gameList}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title ? option.title : ""
        }}
        renderOption={(option) => option.title}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="Select a Game" variant={"outlined"} />
        )}
    />
    <Button variant="outlined" onClick={() => enableOnTwitch(activeGame, updateRewardTwitchId)}>Enable</Button>
    <Button variant="outlined" onClick={() => disableOnTwitch(activeGame, updateRewardTwitchId)}>Disable</Button>
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelRewardsGameSelector)
