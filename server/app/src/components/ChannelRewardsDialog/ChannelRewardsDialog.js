import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ChannelRewardsEditor from "./ChannelRewardsEditor";
import ChannelRewardsGameSelector from "./ChannelRewardsGameSelector";

const mapStateToProps = (state, props) => {
  return {
    open: props.open,
    handleClose: props.handleClose
  }
}

const mapDispatchToProps = {
}

function ChannelRewardsDialog({open, handleClose}) {
  return <Dialog
    open={open}
    onClose={handleClose}
    fullWidth={true}
    maxWidth='lg'
    scroll='paper'
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-description"
  >
    <DialogTitle id="scroll-dialog-title">
      Channel Rewards
    </DialogTitle>
    <DialogContent dividers={true}>
      <ChannelRewardsGameSelector />
      <ChannelRewardsEditor />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelRewardsDialog)
