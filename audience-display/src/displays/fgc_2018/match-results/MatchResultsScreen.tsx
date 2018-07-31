import * as React from "react";

import "./MatchResultsScreen.css";
import RED_WIN from "../res/Red_Win_Top.png";
// import RED_LOSE from "../res/Red_Lose_Top.png";
// import BLUE_WIN from "../res/Blue_Win_Top.png";
import BLUE_LOSE from "../res/Blue_Lose_Top.png";
import Match from "../../../shared/models/Match";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import Team from "../../../shared/models/Team";
import EnergyImpactMatchDetails from "../../../shared/models/EnergyImpactMatchDetails";

interface IProps {
  match: Match,
}

interface IState {
  match: Match,
  teams: Team[]
}

class MatchResultsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo()
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo()});
    }
  }

  public render() {
    const {match, teams} = this.state;

    let details = match.matchDetails as EnergyImpactMatchDetails;
    if (typeof details === "undefined") {
      details = new EnergyImpactMatchDetails();
    }

    let redSolarPanelPoints = 0;
    for (const panelPoints of details.redSolarPanelOwnerships) {
      redSolarPanelPoints += panelPoints;
    }
    let blueSolarPanelPoints = 0;
    for (const panelPoints of details.blueSolarPanelOwnerships) {
      blueSolarPanelPoints += panelPoints;
    }
    const redWindPoints = details.redWindTurbineOwnership;
    const redReactorPoints = details.redNuclearReactorOwnership * 3;
    const redCombustionPoints = details.redCombustionPowerlineOn ? ((details.redHighCombustionGoals * 20) + (details.redLowCombustionGoals * 5)) : 0;
    const redParkingPoints = details.redRobotsParked === 3 ? 50 : details.redRobotsParked * 15;
    const redPenaltyPoints = (match.blueMinPen || 0) * 30;
    const blueWindPoints = details.blueWindTurbineOwnership;
    const blueReactorPoints = details.blueNuclearReactorOwnership * 3;
    const blueCombustionPoints = details.blueCombustionPowerlineOn ? ((details.blueHighCombustionGoals * 20) + (details.blueLowCombustionGoals * 5)) : 0;
    const blueParkingPoints = details.blueRobotsParked === 3 ? 50 : details.blueRobotsParked * 15;
    const bluePenaltyPoints = (match.blueMinPen || 0) * 30;
    const coopPoints = details.redDidCoopertition && details.blueDidCoopertition ? 100 : 0;

    return (
      <div id="fgc-body">
        <div id="fgc-container">
          <div id="res-header-container">
            <div id="res-header-left">
              <span>RESULTS</span>
            </div>
            <div id="res-header-right">
              <div className="res-header-item">MATCH: {match.matchName.toString().split(" ")[2]}</div>
              <div className="res-header-item">FIELD: {match.fieldNumber}</div>
            </div>
          </div>
          <div id="res-alliance-container">
            <div className="res-alliance-card">
              <div className="res-card-top">
                <img src={RED_WIN} className="fit-w"/>
              </div>
              <div className="res-card-middle red-bg">
                <div className="res-card-teams">
                  <div className="res-team-row bottom-red">
                    <div className="res-team-name">{teams[0].teamNameShort}</div>
                    <div className="res-team-rank">#0</div>
                    <div className="res-team-flag"><span className={"flag-icon flag-icon-" + teams[0].countryCode}/></div>
                  </div>
                  <div className="res-team-row bottom-red">
                    <div className="res-team-name">{teams[1].teamNameShort}</div>
                    <div className="res-team-rank">#0</div>
                    <div className="res-team-flag"><span className={"flag-icon flag-icon-" + teams[1].countryCode}/></div>
                  </div>
                  <div className="res-team-row">
                    <div className="res-team-name">{teams[2].teamNameShort}</div>
                    <div className="res-team-rank">#0</div>
                    <div className="res-team-flag"><span className={"flag-icon flag-icon-" + teams[2].countryCode}/></div>
                  </div>
                </div>
                <div className="res-card-details">
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">SOLAR</div>
                    <div className="res-detail-right">{redSolarPanelPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">WIND</div>
                    <div className="res-detail-right">{redWindPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">REACTOR</div>
                    <div className="res-detail-right">{redReactorPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">COMBUSTION</div>
                    <div className="res-detail-right">{redCombustionPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">CO-OP</div>
                    <div className="res-detail-right">{coopPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">PARKING</div>
                    <div className="res-detail-right">{redParkingPoints}</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-left penalty right-red">PENALTY</div>
                    <div className="res-detail-right penalty">{redPenaltyPoints}</div>
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
                <img src={BLUE_LOSE} className="fit-w"/>
              </div>
              <div className="res-card-middle blue-bg">
                <div className="res-card-teams">
                  <div className="res-team-row bottom-blue">
                    <div className="res-team-name">{teams[3].teamNameShort}</div>
                    <div className="res-team-rank">#0</div>
                    <div className="res-team-flag"><span className={"flag-icon flag-icon-" + teams[3].countryCode}/></div>
                  </div>
                  <div className="res-team-row bottom-blue">
                    <div className="res-team-name">{teams[4].teamNameShort}</div>
                    <div className="res-team-rank">#0</div>
                    <div className="res-team-flag"><span className={"flag-icon flag-icon-" + teams[4].countryCode}/></div>
                  </div>
                  <div className="res-team-row">
                    <div className="res-team-name">{teams[5].teamNameShort}</div>
                    <div className="res-team-rank">#0</div>
                    <div className="res-team-flag"><span className={"flag-icon flag-icon-" + teams[5].countryCode}/></div>
                  </div>
                </div>
                <div className="res-card-details">
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">SOLAR</div>
                    <div className="res-detail-right">{blueSolarPanelPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">WIND</div>
                    <div className="res-detail-right">{blueWindPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">REACTOR</div>
                    <div className="res-detail-right">{blueReactorPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">COMBUSTION</div>
                    <div className="res-detail-right">{blueCombustionPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">CO-OP</div>
                    <div className="res-detail-right">{coopPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">PARKING</div>
                    <div className="res-detail-right">{blueParkingPoints}</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-left penalty right-blue">PENALTY</div>
                    <div className="res-detail-right penalty">{bluePenaltyPoints}</div>
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
      </div>
    );
  }

  private getUpdatedMatchInfo(): Match {
    if (this.props.match.matchKey.length === 0) {
      const match: Match = new Match();
      match.matchName = "A MATCH TEST";
      match.fieldNumber = 1; // TODO - Change field number in EMS

      const participants: MatchParticipant[] = [];
      for (let i = 0; i < 6; i++) {
        participants.push(new MatchParticipant().fromJSON({team_key: (i + 1), country_code: "us", card_status: 0}));
      }

      match.participants = participants;
      return match;
    } else {
      return this.props.match;
    }
  }

  private getUpdatedTeamInfo(): Team[] {
    if (typeof this.props.match.participants === "undefined") {
      const teams: Team[] = [];
      for (let i = 0; i < 6; i++) {
        teams.push(new Team().fromJSON({
          team_key: i,
          team_name_short: "TEST TEAM #" + (i + 1),
          country: "TST",
          country_code: "us"
        }));
      }
      return teams;
    } else {
      const teams: Team[] = [];
      for (const participant of this.props.match.participants) {
        teams.push(participant.team);
      }
      return teams;
    }
  }
}

export default MatchResultsScreen;