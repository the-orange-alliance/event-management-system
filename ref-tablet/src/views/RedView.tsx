import * as React from 'react';
import Event from "../shared/models/Event";
import RedAllianceView from "./ftc_1819/RedAllianceView";
import Match from "../shared/models/Match";

interface IProps {
  event: Event
}

class RedView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {event} = this.props;
    const match: Match = new Match();

    let display;

    switch (event.seasonKey) {
      case 1819:
        display = <RedAllianceView event={event} match={match} mode={"UNDEFINED"}/>;
        break;
      default:
        display = <span>No ref tablet application has been made for {event.seasonKey}</span>;
    }

    return (display);
  }
}

export default RedView;