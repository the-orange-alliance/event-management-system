import * as React from "react";
import {Route} from "react-router-dom";
import HomePage from "./pages/HomePage";

const styles = {
  wrapper: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    minHeight: '100vh'
  }
};

class App extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div style={styles.wrapper}>
        <Route path="/" exact={true} component={HomePage} />
      </div>
    );
  }
}

export default App;