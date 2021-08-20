import * as React from "react";
import {Match, MatchParticipant, OceanOpportunitiesMatchDetails, Ranking, Team} from "@the-orange-alliance/lib-ems";

import "./MatchResultsScreen.css";
import RED_WIN from "../res/Red_Win_Top.png";
import RED_LOSE from "../res/Red_Lose_Top.png";
import BLUE_WIN from "../res/Blue_Win_Top.png";
import BLUE_LOSE from "../res/Blue_Lose_Top.png";
import FGC_LEFT_LOGO from "../res/Logo-V.png";
import FGC_RIGHT_LOGO from "../res/Powered by.png";

interface IProps {
  match: Match
}

class MatchResultsScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {match} = this.props;
    const details = match.matchDetails as OceanOpportunitiesMatchDetails || new OceanOpportunitiesMatchDetails();
    const redTop = match.redScore > match.blueScore ? RED_WIN : RED_LOSE;
    const blueTop = match.blueScore > match.redScore ? BLUE_WIN : BLUE_LOSE;
    const matchLabel = match.tournamentLevel > -1 ? match.abbreviatedName : "TEST";

    return (
      <div id="fgc-body">
        <div id="fgc-container">
          <div id="res-header-container">
            <div id="res-header-left">
              <span>RESULTS</span>
            </div>
            <div id="res-header-right">
              <div className="res-header-item">MATCH: {matchLabel}</div>
              <div className="res-header-item">FIELD: {match.fieldNumber}</div>
            </div>
          </div>
          <div id="res-alliance-container">
            <div className="res-alliance-card">
              <div className="res-card-top">
                <img alt={'red top'} src={redTop} className="fit-w"/>
              </div>
              <div className="res-card-middle red-bg">
                <div className="res-card-teams">
                  {this.renderRedAlliance()}
                </div>
                <div className="res-card-details">
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-red">REUSE PROCESSING</div>
                    <div className="res-detail-right">{details.redProcessingBargeReuse * 6}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-red">RECYCLE PROCESSING</div>
                    <div className="res-detail-right">{details.redProcessingBargeRecycle * 3}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-red">RECOVERY PROCESSING</div>
                    <div className="res-detail-right">{details.redProcessingBargeRecovery * 2}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-red">REDUCTION PROCESSING</div>
                    <div className="res-detail-right">{details.redReductionProcessing}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-red">COOPERTITION BONUS</div>
                    <div className="res-detail-right">{details.coopertitionBonus ? "YES" : "NO"}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-red">PARKING BONUS</div>
                    <div className="res-detail-right">{details.getRedEndScore()}</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left penalty right-red">PENALTY</div>
                    <div className="res-detail-right penalty">{details.getRedPenalty(match.blueMinPen, 0)}</div>
                  </div>
                </div>
              </div>
              <div className="res-card-bottom">
                <div className="res-alliance-total-left red-bg">
                  <span>TOTAL:</span>
                </div>
                <div className="res-alliance-total-right red-bg">
                  <span>{match.redScore}</span>
                </div>
              </div>
            </div>
            <div className="res-alliance-card">
              <div className="res-card-top">
                <img alt={'blue top'} src={blueTop} className="fit-w"/>
              </div>
              <div className="res-card-middle blue-bg">
                <div className="res-card-teams">
                  {this.renderBlueAlliance()}
                </div>
                <div className="res-card-details">
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">REUSE PROCESSING</div>
                    <div className="res-detail-right">{details.blueProcessingBargeReuse * 6}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">RECYCLE PROCESSING</div>
                    <div className="res-detail-right">{details.blueProcessingBargeRecycle * 3}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">RECOVERY PROCESSING</div>
                    <div className="res-detail-right">{details.blueProcessingBargeRecovery * 2}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">REDUCTION PROCESSING</div>
                    <div className="res-detail-right">{details.blueReductionProcessing}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">COOPERTITION BONUS</div>
                    <div className="res-detail-right">{details.coopertitionBonus ? "YES" : "NO"}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">PARKING BONUS</div>
                    <div className="res-detail-right">{details.getBlueEndScore()}</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-icon"><img alt={'empty'} src={""} className="fit-h"/></div>
                    <div className="res-detail-left penalty right-blue">PENALTY</div>
                    <div className="res-detail-right penalty">{details.getBluePenalty(match.redMinPen, 0)}</div>
                  </div>
                </div>
              </div>
              <div className="res-card-bottom">
                <div className="res-alliance-total-left blue-bg">
                  <span>TOTAL:</span>
                </div>
                <div className="res-alliance-total-right blue-bg">
                  <span>{match.blueScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id={"res-left-side-logo"} className={"center-items"}>
          <img alt={'fgc logo'} src={FGC_LEFT_LOGO} className={"fit-w"}/>
        </div>

        <div id={"res-right-side-logo"} className={"center-items"}>
          <img alt={'fgc logo'} src={FGC_RIGHT_LOGO} className={"fit-w"}/>
        </div>

      </div>
    );
  }

  private renderRedAlliance() {
    const {match} = this.props;
    const displayRank = match.tournamentLevel !== 0;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const redAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((participant: MatchParticipant) => {
      // TODO - Get Team Identifier
      const team: Team = participant.team;
      const rank: Ranking = participant.teamRank;
      return (
        <div key={participant.matchParticipantKey} className="res-team-row bottom-red">
          <div className="res-team-name">{team.teamNameShort}</div>
          <div className="res-team-rank">{displayRank ? "#" + rank.rank : ""}</div>
          <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + team.countryCode}/></div>
        </div>
      );
    });
    return (redAllianceView);
  }

  private renderBlueAlliance() {
    const {match} = this.props;
    const displayRank = match.tournamentLevel !== 0;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const blueAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station > 20);
    const blueAllianceView = blueAlliance.map((participant: MatchParticipant) => {
      // TODO - Get Team Identifier
      const team: Team = participant.team;
      const rank: Ranking = participant.teamRank;
      return (
        <div key={participant.matchParticipantKey} className="res-team-row bottom-blue">
          <div className="res-team-name">{team.teamNameShort}</div>
          <div className="res-team-rank">{displayRank ? "#" + rank.rank : ""}</div>
          <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + team.countryCode}/></div>
        </div>
      );
    });
    return (blueAllianceView);
  }
}

export default MatchResultsScreen;
