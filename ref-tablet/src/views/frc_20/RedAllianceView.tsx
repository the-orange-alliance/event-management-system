import * as React from "react";
import {Event, InfiniteRechargeMatchDetails, Match} from "@the-orange-alliance/lib-ems";
import {Nav, NavItem, NavLink, Spinner} from "reactstrap";
import StatusBar from "../../components/StatusBar";

interface IProps {
  event: Event,
  match: Match,
  mode: string,
  connected: boolean,
  waitingForMatch: boolean
}

interface IState {
  currentMode: number
}

class RedAllianceView extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      currentMode: 0
    };
    this.changeModeTab = this.changeModeTab.bind(this);
  }

  public componentWillMount() {
    if (typeof this.props.match.matchDetails === "undefined") {
      this.props.match.matchDetails = new InfiniteRechargeMatchDetails();
    }
    if (typeof this.props.match.participants === "undefined") {
      this.props.match.participants = [];
    }
  }

  public render() {
    const {match, mode, connected, waitingForMatch} = this.props;
    const {currentMode} = this.state;

    let modeView: JSX.Element;

    if (waitingForMatch) {
      modeView = (
        <div id={"spinner-container"}>
          <span>Waiting For a Match...</span>
          <Spinner
            color={"success"}
            style={{ width: '7rem', height: '7rem' }}
          />
        </div>
      );
    } else {
      modeView = (<div>Testing!</div>);
    }

    return (
      <div className={"alliance-view"}>
        <div className={"alliance-header red-bg"}>Red Alliance</div>
        <StatusBar match={match} mode={mode} connected={connected}/>
        <Nav tabs={true}>
          <NavItem>
            <NavLink active={currentMode === 0} href="#" onClick={this.changeModeTab.bind(this, 0)}>TELEOP</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 1} href="#" onClick={this.changeModeTab.bind(this, 1)}>ENDGAME</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 2} href="#" onClick={this.changeModeTab.bind(this, 2)}>CARDS/PENALTIES</NavLink>
          </NavItem>
        </Nav>
        {modeView}
      </div>
    );
  }

  private changeModeTab(index: number) {
    this.setState({currentMode: index});
  }
}

export default RedAllianceView;