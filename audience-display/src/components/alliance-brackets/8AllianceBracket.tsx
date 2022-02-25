import * as React from 'react';
import "./AllianceBracket.css";
import {Match, MatchParticipant} from "@the-orange-alliance/lib-ems";

interface IProps {
  allianceMatches: Map<number, Match[]>
}

class EightAllianceBracket extends React.Component<IProps> {

  public render() {
    return (
      <div id="bracket-container">
        <div className="bracket-col">
          <div className="bracket-pipe semi-pipe-1-top-x"/>
          <div className="bracket-pipe semi-pipe-1-bot-x"/>
          <div className="bracket-pipe semi-pipe-2-top-x"/>
          <div className="bracket-pipe semi-pipe-2-bot-x"/>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              1.&nbsp;{this.renderAlliance(20, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              8.&nbsp;{this.renderAlliance(20, false)}
            </div>
          </div>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              4.&nbsp;{this.renderAlliance(21, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              5.&nbsp;{this.renderAlliance(21, false)}
            </div>
          </div>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              2.&nbsp;{this.renderAlliance(22, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              7.&nbsp;{this.renderAlliance(22, false)}
            </div>
          </div>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              3.&nbsp;{this.renderAlliance(23, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              6.&nbsp;{this.renderAlliance(23, false)}
            </div>
          </div>
        </div>
        <div className="bracket-col">
          <div className="bracket-pipe semi-pipe-1-top-y"/>
          <div className="bracket-pipe semi-pipe-1-bot-y"/>
          <div className="bracket-pipe semi-pipe-2-top-y"/>
          <div className="bracket-pipe semi-pipe-2-bot-y"/>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              {this.renderAlliance(30, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              {this.renderAlliance(30, false)}
            </div>
          </div>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              {this.renderAlliance(31, true)}
            </div>
            <div className="bracket-box-alliance blue-bg">
              {this.renderAlliance(31, false)}
            </div>
          </div>
          <div className="bracket-pipe final-pipe-top-x"/>
          <div className="bracket-pipe final-pipe-bot-x"/>
        </div>
        <div className="bracket-col">
          <div className="bracket-pipe final-pipe-top-y"/>
          <div className="bracket-pipe final-pipe-bot-y"/>
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

export default EightAllianceBracket;
