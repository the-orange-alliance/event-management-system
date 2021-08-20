import * as React from 'react';
import "./MatchPreviewScreen.css";
import {Event, Match, MatchParticipant, Ranking, Team} from "@the-orange-alliance/lib-ems";
import FACC_LOGO from "../res/facc-large-bg-dark.png";
import FACC_LOGO_TEXT from "../res/facc-large-text-underneath-bg-dark.png";
import TOA_LOGO from "../res/toa-generic-lol.png";

interface IProps {
  event: Event;
  match: Match;
}

class MatchPreviewScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {event, match} = this.props;
    return (
      <div id="ir-body">
        <div id="ir-container">
          <div id="ir-pre-top" className="ir-border">
            <div className="col-left"><img alt={'toa logo'} src={TOA_LOGO} className="fit-h"/></div>
            <div className="center-items ir-pre-match">{match.matchName}</div>
            <div className="col-right"><img alt={'facc logo'} src={FACC_LOGO}className="fit-h"/></div>
          </div>
          <div id="ir-pre-mid" className="ir-border">
            <div id="ir-pre-mid-labels" className="center-items">
              <div className="ir-pre-team">Team #</div>
              <div className="ir-pre-name">Nickname</div>
              <div className="ir-pre-rank">Rank #</div>
            </div>
            <div className="ir-pre-mid-alliance">
              {this.displayBlueAlliance()}
            </div>
            <div className="ir-pre-mid-alliance">
              {this.displayRedAlliance()}
            </div>
          </div>
          <div id="ir-pre-bot" className="ir-border">
            <div className="ir-bot-logo"><img alt={'facc logo text'} src={FACC_LOGO_TEXT} className="fit-h"/></div>
            <div className="ir-bot-text">
              <span>{event.eventName}</span>
              <span>Watch live! https://twitch.tv/FirstUpdatesNow</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private displayRedAlliance() {
    const {match} = this.props;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const redAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((p: MatchParticipant) => {
      const team: Team = p.team;
      const rank: Ranking = p.teamRank;
      return (
        <div key={team.teamKey} className="center-items red-border">
          <div className="ir-pre-team center-left-items">{team.teamKey}</div>
          <div className="ir-pre-name center-left-items">{team.teamNameShort}</div>
          <div className="ir-pre-rank center-items">#{rank.rank}</div>
        </div>
      );
    });
    return (redAllianceView);
  }

  private displayBlueAlliance() {
    const {match} = this.props;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const blueAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station >= 20);
    const blueAllianceView = blueAlliance.map((p: MatchParticipant) => {
      const team: Team = p.team;
      const rank: Ranking = p.teamRank;
      return (
        <div key={team.teamKey} className="center-items blue-border">
          <div className="ir-pre-team center-left-items">{team.teamKey}</div>
          <div className="ir-pre-name center-left-items">{team.teamNameShort}</div>
          <div className="ir-pre-rank center-items">#{rank.rank}</div>
        </div>
      );
    });
    return (blueAllianceView);
  }

}

export default MatchPreviewScreen;
