import Navbar from './components/Navbar/Navbar'
import Redemption from './components/Redemption/Redemption'
import './App.css';
import {connect} from "react-redux";

const mapStateToProps = (state, props) => {
  return {
    apiReady: state.settings.apiReady,
  }
}

const mapDispatchToProps = {
}

function App({apiReady}) {
  return (
    <div>
      <Navbar />
      <div>
        { apiReady && (
          <Redemption />
        )}
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
