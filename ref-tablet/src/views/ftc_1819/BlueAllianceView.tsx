import * as React from 'react';
import StatusBar from "../../components/StatusBar";
import Event from "../../shared/models/Event";
import Match from "../../shared/models/Match";
import ModeSwitcher from "../../components/ModeSwitcher";

interface IProps {
  event: Event,
  match: Match,
  mode: string,
  connected: boolean
}

interface IState {
  currentMode: number
}

class BlueAllianceView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentMode: 0
    };
    this.changeModeTab = this.changeModeTab.bind(this);
  }

  public render() {
    const {match, mode, connected} = this.props;
    const {currentMode} = this.state;
    return (
      <div className="alliance-view">
        <StatusBar match={match} mode={mode} connected={connected}/>
        <ModeSwitcher className={"blue-bg"} modes={["auto", "teleop", "endgame", "cards"]} selected={currentMode} onSelect={this.changeModeTab}/>
      </div>
    );
  }

  private changeModeTab(index: number) {
    this.setState({currentMode: index});
  }
}

export default BlueAllianceView;