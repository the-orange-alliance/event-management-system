import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import MatchPlay from "./containers/MatchPlay";

interface IProps {
  navigationDisabled?: boolean
}

interface IState {
  activeIndex: number
}

class MatchPlayView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  public render() {
    return (
      <div className="view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={ [
          { menuItem: "Match Play", render: () => <MatchPlay/>},
          { menuItem: "Video Switch", render: () => <span>Merp</span>},
        ]}/>
      </div>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(MatchPlayView);