import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ChannelRewardsDialog from "../ChannelRewardsDialog/ChannelRewardsDialog";
import {updateAccessToken} from "../../redux/settings";
import './Navbar.scss';

const mapStateToProps = state => {
  return {
    oauthUrl: state.settings.oauthUrl,
    apiReady: state.settings.apiReady
  }
}

const mapDispatchToProps = {
  updateAccessToken
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}))

function Navbar({oauthUrl, apiReady, updateAccessToken}) {
  const [open, setOpen] = React.useState(false)

  const classes = useStyles();

  return <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Wiggleton
        </Typography>

        <Button color="inherit" onClick={() => setOpen(true)}>Channel Rewards</Button>
        {!apiReady && (<Button color="inherit" onClick={() => window.location = oauthUrl}>Login</Button>)}
        {apiReady && (<Button color="inherit" onClick={() => updateAccessToken(null)}>Logout</Button>)}
      </Toolbar>
    </AppBar>
    {apiReady &&
      <ChannelRewardsDialog open={open} handleClose={() => setOpen(false)}/>
    }
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
