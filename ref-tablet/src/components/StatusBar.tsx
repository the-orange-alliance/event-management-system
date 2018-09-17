import * as React from 'react';
import Event from "../shared/models/Event";
import Match from "../shared/models/Match";

interface IProps {
  event: Event,
  match: Match,
  mode: string
}

class StatusBar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {event, match, mode} = this.props;
    return (
      <div className="status-bar-container">
        <div className="left">{match.matchName} (Field {match.fieldNumber})</div>
        <div className="center">{mode}</div>
        <div className="right">{event.eventName}</div>
      </div>
    );
  }
}

export default StatusBar;