import React from "react";
import { connect } from 'react-redux'
import { DataGrid } from '@material-ui/data-grid'
import ChannelRewardEdit from "./ChannelRewardsEdit";
import { addReward, editReward, deleteReward } from "../../redux/channelRewards";

const columns = [
  { field: 'title', headerName: 'Title', width: 400 },
  { field: 'prompt', headerName: 'Prompt', width: 600},
  { field: 'cost', headerName: 'Cost', width: 100},
  { field: 'backgroundColor', headerName: 'Color', width: 100},
  { field: 'cooldown', headerName: 'Cooldown', width: 100},
]

const mapStateToProps = (state, props) => {
  return {
    games: state.channelRewards.games,
    activeGame: state.channelRewards.activeGame,
  }
}

const mapDispatchToProps = {
  addReward,
  editReward,
  deleteReward,
}

const newReward = {
  id: "(New)",
  title: "",
  prompt: "",
  cost: "",
  backgroundColor: "",
  cooldown: "",
  command: "",
}

function ChannelRewardsEditor({games, activeGame, addReward, editReward, deleteReward}) {
  const [selectedReward, setSelectedReward] = React.useState(null)

  React.useEffect(() => {
    setSelectedReward(null)
  }, [activeGame])

  if (!activeGame) {
    return <div />
  }

  const rows = games[activeGame]
  const selectionModel = selectedReward ? [selectedReward.id.toString()] : []
  return <div>
    { selectedReward ? (
        <ChannelRewardEdit defaultReward={selectedReward} buttonLabel="Edit Reward"
                           showDelete
                           onDelete={
                             (id) => {
                               deleteReward(activeGame, id)
                               setSelectedReward(null)
                             }
                           }
                           onAccept={
                            (reward) => editReward(
                              activeGame,
                              reward.id,
                              reward.title,
                              reward.prompt,
                              reward.cost,
                              reward.backgroundColor,
                              reward.cooldown,
                              reward.command,
                            )
                          }
        />
      ) : (
        <ChannelRewardEdit defaultReward={newReward} buttonLabel="Add Reward"
                           onAccept={
                            (reward) => addReward(
                              activeGame,
                              reward.title,
                              reward.prompt,
                              reward.cost,
                              reward.backgroundColor,
                              reward.cooldown,
                              reward.command,
                             )
                           }
        />
      )
    }
    {
      rows.length !== 0 && (
        <div style={{ height: 400 }}>
          <DataGrid
            disableColumnMenu
            onSelectionModelChange={param => {
              const id = param.selectionModel[0]
              for (let i = 0; i < rows.length; i++) {
                if (rows[i].id.toString() === id) {
                  setSelectedReward(rows[i])
                  break
                }
              }
            }}
            selectionModel={selectionModel}
            columns={columns}
            rows={rows}
            onRowClick={param => {
              if (selectedReward && param.row.id === selectedReward.id) {
                setSelectedReward(null)
              }
            }}
          >
          </DataGrid>
        </div>
      )
    }
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelRewardsEditor)
