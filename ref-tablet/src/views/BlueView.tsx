import * as React from 'react';
import Event from "../shared/models/Event";
import Match from "../shared/models/Match";
import BlueAllianceView from "./ftc_1819/BlueAllianceView";

interface IProps {
  event: Event,
  match: Match,
  connected: boolean
}

class BlueView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {event, match, connected} = this.props;

    let display;

    switch (event.seasonKey) {
      case 1819:
        display = <BlueAllianceView event={event} match={match} mode={"UNDEFINED"} connected={connected}/>;
        break;
      default:
        display = <span>No ref tablet application has been made for {event.seasonKey}</span>;
    }

    return (display);
  }
}

export default BlueView;