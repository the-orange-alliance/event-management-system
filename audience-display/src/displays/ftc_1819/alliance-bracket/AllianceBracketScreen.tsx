import * as React from 'react';
import "./AllianceBracketScreen.css";
import {Event, EMSProvider, Match, MatchParticipant} from "@the-orange-alliance/lib-ems";
import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import EightAllianceBracket from "../../../components/alliance-brackets/8AllianceBracket";
import {AxiosResponse} from "axios";

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
    EMSProvider.getMatches("elims").then((elimsMatchesResposne: AxiosResponse) => {
      if (elimsMatchesResposne.data && elimsMatchesResposne.data.payload && elimsMatchesResposne.data.payload.length > 0) {
        const elimsMatches: Match[] = [];
        for (const matchJSON of elimsMatchesResposne.data.payload) {
          const match: Match = new Match().fromJSON(matchJSON);
          const participants: MatchParticipant[] = [];
          for (let i = 0; i < matchJSON.participants.split(",").length; i++) {
            const participant: MatchParticipant = new MatchParticipant();
            participant.allianceKey = matchJSON.alliance_keys.split(",")[i];
            participant.matchParticipantKey = matchJSON.participant_keys.split(",")[i];
            participant.matchKey = match.matchKey;
            participant.teamKey = parseInt(matchJSON.participants.split(",")[i], 10);
            participant.surrogate = matchJSON.surrogates.split(",")[i] === "1";
            participant.station = parseInt(matchJSON.stations.split(",")[i], 10);
            participants.push(participant);
          }
          match.participants = participants;
          elimsMatches.push(match);
        }
        const map: Map<number, Match[]> = new Map<number, Match[]>();
        for (const match of elimsMatches) {
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
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{event.eventName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
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