import * as React from 'react';
import "./AllianceBracket.css";
import {Match, MatchParticipant} from "@the-orange-alliance/lib-ems";

interface IProps {
  allianceMatches: Map<number, Match[]>
}

class TwoAllianceBracket extends React.Component<IProps> {

  public render() {
    return (
      <div id="bracket-container">
        <div className="bracket-col">
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              {this.renderAlliance(40, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              {this.renderAlliance(40, false)}
            </div>
          </div>
        </div>
        <div className="bracket-col">
          <div className="bracket-pipe winner-pipe"/>
          <div className="bracket-box-winner">
            <span>Winner!</span>
          </div>
        </div>
      </div>
    );
  }

  private renderAlliance(tournamentLevel: number, redAlliance: boolean): any {
    if (typeof this.props.allianceMatches.get(tournamentLevel) !== "undefined") {
      const matches: Match[] = this.props.allianceMatches.get(tournamentLevel) as Match[];
      if (matches.length > 0) {
        const allianceMembers: MatchParticipant[] = [];
        for (const participant of matches[0].participants) {
          if (redAlliance && participant.station < 20) {
            allianceMembers.push(participant);
          }
          if (!redAlliance && participant.station >= 20) {
            allianceMembers.push(participant);
          }
        }
        const view = allianceMembers.map((p: MatchParticipant) => {
          return (
            <span key={p.matchParticipantKey}>{p.teamKey}&nbsp;&nbsp;</span>
          );
        });
        return view;
      } else {
        return <span/>;
      }
    } else {
      return <span/>;
    }
  }
}

export default TwoAllianceBracket;
