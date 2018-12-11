import * as React from 'react';
import "./AllianceBracketScreen.css";
import Event from "../../../shared/models/Event";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import EightAllianceBracket from "../../../components/alliance-brackets/8AllianceBracket";

interface IProps {
  event: Event
}

class AllianceBracketScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
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
}

export default AllianceBracketScreen;