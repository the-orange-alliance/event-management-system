import * as React from 'react';
import "./AllianceBracketScreen.css";
import Event from "../../../shared/models/Event";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import EightAllianceBracket from "../../../components/alliance-brackets/8AllianceBracket";
import AllianceMember from "../../../shared/models/AllianceMember";

interface IProps {
  event: Event
}

interface IState {
  alliances: Map<number, AllianceMember[]>
}

class AllianceBracketScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      alliances: new Map<number, AllianceMember[]>()
    };
  }

  public componentDidMount() {
    this.setState({alliances: this.getAllianceMap()});
  }

  public render() {
    const {event} = this.props;
    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-at-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{event.eventName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-at-mid" className="rr-border">
            <EightAllianceBracket/>
          </div>
        </div>
      </div>
    );
  }

  private getAllianceMap(): Map<number, AllianceMember[]> {
    return new Map<number, AllianceMember[]>();
  }
}

export default AllianceBracketScreen;