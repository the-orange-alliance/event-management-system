import * as React from 'react';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import './App.css';
import AppContainer from "./components/AppContainer";
import {ApplicationActions, IApplicationState} from "./stores";
import * as Actions from "./stores/internal/actions";
import {IDisableNavigation} from "./stores/internal/types";

interface IProps {
  toggleNavigation?: (navigationDisabled: boolean) => IDisableNavigation
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    setTimeout(() => {
      this.props.toggleNavigation(false);
    },1000);
  }

  public render() {
    return (
      <AppContainer/>
    );
  }
}

export function mapStateToProps(state: IApplicationState) {
  return {};
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    toggleNavigation: (disable: boolean) => dispatch(Actions.disableNavigation(disable))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
