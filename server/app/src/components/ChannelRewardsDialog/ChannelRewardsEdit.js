import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > div > *': {
      margin: theme.spacing(1),
    },
  },
  row: {
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
  },
  small: {
    width: '5ch'
  },
  medium: {
    width: '10ch'
  },
  large: {
    width: '35ch'
  },
  xlarge: {
    width: '80ch'
  },
}))

function ChannelRewardsEdit({buttonLabel, defaultReward, showDelete, onAccept, onDelete}) {
  const [reward, setReward] = React.useState(defaultReward)

  React.useEffect(() => {
    setReward(defaultReward)
    return () => {}
  }, [defaultReward])

  const classes = useStyles()

  return <form className={classes.root} noValidate autoComplete="off">
    <div className={classes.row}>
      <TextField label="Id" className={classes.small} disabled value={reward.id}/>
      <TextField label="Title" className={classes.large} value={reward.title}
                 onChange={(e) => setReward({...reward, title: e.target.value})}
      />
      <TextField label="Prompt" className={classes.large} value={reward.prompt}
                 onChange={(e) => setReward({...reward, prompt: e.target.value})}
      />
      <TextField label="Cost" className={classes.medium} value={reward.cost}
                 onChange={(e) => setReward({...reward, cost: e.target.value})}
      />
      <TextField label="Color" className={classes.medium} value={reward.backgroundColor}
                 onChange={(e) => setReward({...reward, backgroundColor: e.target.value})}
      />
      <TextField label="Cooldown" className={classes.medium} value={reward.cooldown}
                 onChange={(e) => setReward({...reward, cooldown: e.target.value})}
      />
    </div>
    <div className={classes.row}>
      <TextField label="Command" className={classes.xlarge} value={reward.command}
                 onChange={(e) => setReward({...reward, command: e.target.value})}
      />
      <Button variant="outlined" onClick={() => onAccept(reward) && setReward(defaultReward) }>{buttonLabel}</Button>
      { showDelete && (
        <Button variant="outlined" onClick={() => onDelete(reward.id) } color="secondary" >Delete Reward</Button>
      )}
    </div>
  </form>
}

export default ChannelRewardsEdit