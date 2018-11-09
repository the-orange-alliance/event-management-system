import * as React from 'react';
import Match from "../shared/models/Match";

interface IProps {
  match: Match,
  mode: string,
  connected: boolean
}

class StatusBar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {connected, match, mode} = this.props;

    return (
      <div className="status-bar-container black-bg">
        <div className="left">{match.abbreviatedName} (Field {match.fieldNumber})</div>
        <div className="center">{mode}</div>
        <div className="right">{connected ? "CONNECTED" : "NOT CONNECTED"}</div>
      </div>
    );
  }
}

export default StatusBar;