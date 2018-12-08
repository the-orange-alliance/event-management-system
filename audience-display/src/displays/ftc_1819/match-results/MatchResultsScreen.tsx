import * as React from 'react';
import "./MatchResultsScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";

interface IProps {
  match: Match
}

class MatchResultsScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-result-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">Qualification Match 3</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-result-mid" className="rr-border">
            Eh I'll get here eventually...
          </div>
          <div id="rr-result-bot" className="rr-border">
            <div className="col-left"><img src={FTC_LOGO} className="fit-h"/></div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchResultsScreen;