import * as React from 'react';
import "./AllianceBracketScreen.css";
import {Event, EMSProvider, Match} from "@the-orange-alliance/lib-ems";
import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import EightAllianceBracket from "../../../components/alliance-brackets/8AllianceBracket";

interface IProps {
  event: Event
}

interface IState {
  tournamentLevelMatches: Map<number, Match[]>
}

class AllianceBracketScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      tournamentLevelMatches: new Map<number, Match[]>()
    };
  }

  public componentDidMount() {
    EMSProvider.getMatchesAndParticipants("E").then((matches: Match[]) => {
      if (matches.length > 0) {
        const map: Map<number, Match[]> = new Map<number, Match[]>();
        for (const match of matches) {
          if (typeof map.get(match.tournamentLevel) === "undefined") {
            map.set(match.tournamentLevel, []);
          }
          (map.get(match.tournamentLevel) as Match[]).push(match);
        }
        this.setState({tournamentLevelMatches: map});
      }
    });
  }

  public render() {
    const {event} = this.props;
    const {tournamentLevelMatches} = this.state;
    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-at-top" className="rr-border">
            <div className="col-left"><img alt={'FIRST logo'} src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{event.eventName}</div>
            <div className="col-right"><img alt={'Rover Ruckus logo'} src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-at-mid" className="rr-border">
            <EightAllianceBracket allianceMatches={tournamentLevelMatches}/>
          </div>
        </div>
      </div>
    );
  }
}

export default AllianceBracketScreen;
