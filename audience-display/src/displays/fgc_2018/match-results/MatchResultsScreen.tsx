import * as React from "react";
import {EnergyImpactMatchDetails, Match, MatchParticipant, Ranking, Team} from "@the-orange-alliance/lib-ems";
import "./MatchResultsScreen.css";
import RED_WIN from "../res/Red_Win_Top.png";
import RED_LOSE from "../res/Red_Lose_Top.png";
import BLUE_WIN from "../res/Blue_Win_Top.png";
import BLUE_LOSE from "../res/Blue_Lose_Top.png";

import SOLAR_ICON from "../res/Grey_Solar_Icon.png";
import WIND_ICON from "../res/Black_Wind_Icon.png";
import REACTOR_ICON from "../res/Black_Reactor_Icon.png";
import COMBUSTION_ICON from "../res/Black_Burning_Icon.png";
import COOP_ICON from "../res/Grey_Coop_Icon.png";
import PARKING_ICON from "../res/Grey_Parking_Icon.png";
import PENALTY_ICON from "../res/Grey_Penalty_Icon.png";

interface IProps {
  match: Match,
}

interface IState {
  match: Match,
  teams: Team[],
  ranks: Ranking[]
}

class MatchResultsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      ranks: this.getUpdatedRankInfo()
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo(), ranks: this.getUpdatedRankInfo()});
    }
  }

  public render() {
    const {match, teams, ranks} = this.state;

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
    const bluePenaltyPoints = (match.redMinPen || 0) * 30;
    const coopPoints = details.redDidCoopertition && details.blueDidCoopertition ? 100 : 0;

    const redTop = match.redScore > match.blueScore ? RED_WIN : RED_LOSE;
    const blueTop = match.blueScore > match.redScore ? BLUE_WIN : BLUE_LOSE;

    return (
      <div id="fgc-body">
        <div id="fgc-container">
          <div id="res-header-container">
            <div id="res-header-left">
              <span>RESULTS</span>
            </div>
            <div id="res-header-right">
              <div className="res-header-item">MATCH: {match.abbreviatedName}</div>
              <div className="res-header-item">FIELD: {match.fieldNumber}</div>
            </div>
          </div>
          <div id="res-alliance-container">
            <div className="res-alliance-card">
              <div className="res-card-top">
                <img alt={'top of card'} src={redTop} className="fit-w"/>
              </div>
              <div className="res-card-middle red-bg">
                {
                  match.tournamentLevel < 10 &&
                  <div className="res-card-teams">
                    <div className="res-team-row bottom-red">
                      <div className="res-team-name">{teams[0].teamNameShort}</div>
                      <div className="res-team-rank">{match.tournamentLevel > 0 ? "#" + ranks[0].rank : ""}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[0].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-red">
                      <div className="res-team-name">{teams[1].teamNameShort}</div>
                      <div className="res-team-rank">{match.tournamentLevel > 0 ? "#" + ranks[1].rank : ""}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[1].countryCode}/></div>
                    </div>
                    <div className="res-team-row">
                      <div className="res-team-name">{teams[2].teamNameShort}</div>
                      <div className="res-team-rank">{match.tournamentLevel > 0 ? "#" + ranks[2].rank : ""}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[2].countryCode}/></div>
                    </div>
                  </div>
                }
                {
                  match.tournamentLevel >= 10 &&
                  <div className="res-card-teams">
                    <div className="res-team-row bottom-red">
                      <div className="res-team-name">{teams[0].teamNameShort}</div>
                      <div className="res-team-rank">#{match.participants[0].getAllianceRankFromKey()}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[0].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-red">
                      <div className="res-team-name">{teams[1].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[1].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-red">
                      <div className="res-team-name">{teams[2].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[2].countryCode}/></div>
                    </div>
                    {
                      teams.length > 6 &&
                      <div className="res-team-row">
                        <div className="res-team-name">{teams[3].teamNameShort}</div>
                        <div className="res-team-rank"/>
                        <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[3].countryCode}/></div>
                      </div>
                    }
                  </div>
                }
                <div className="res-card-details">
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'solar icon'} src={SOLAR_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-red">SOLAR FACTORY</div>
                    <div className="res-detail-right">{redSolarPanelPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'wind icon'} src={WIND_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-red">WIND TURBINE</div>
                    <div className="res-detail-right">{redWindPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'reactor icon'} src={REACTOR_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-red">REACTION PLANT</div>
                    <div className="res-detail-right">{redReactorPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'combustion'} src={COMBUSTION_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-red">COMBUSTION PLANT</div>
                    <div className="res-detail-right">{redCombustionPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'co-op icon'} src={COOP_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-red">COOPERTITION BONUS</div>
                    <div className="res-detail-right">{coopPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-icon"><img alt={'parking icon'} src={PARKING_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-red">PARKING BONUS</div>
                    <div className="res-detail-right">{redParkingPoints}</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-icon"><img alt={'penalty icon'} src={PENALTY_ICON} className="fit-h"/></div>
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
                <img alt={'blue top'} src={blueTop} className="fit-w"/>
              </div>
              <div className="res-card-middle blue-bg">
                {
                  match.tournamentLevel < 10 &&
                  <div className="res-card-teams">
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[3].teamNameShort}</div>
                      <div className="res-team-rank">{match.tournamentLevel > 0 ? "#" + ranks[3].rank : ""}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[3].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[4].teamNameShort}</div>
                      <div className="res-team-rank">{match.tournamentLevel > 0 ? "#" + ranks[4].rank : ""}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[4].countryCode}/></div>
                    </div>
                    <div className="res-team-row">
                      <div className="res-team-name">{teams[5].teamNameShort}</div>
                      <div className="res-team-rank">{match.tournamentLevel > 0 ? "#" + ranks[5].rank : ""}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[5].countryCode}/></div>
                    </div>
                  </div>
                }
                {
                  match.tournamentLevel >= 10 &&
                  teams.length > 6 &&
                  <div className="res-card-teams">
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[4].teamNameShort}</div>
                      <div className="res-team-rank">#{match.participants[4].getAllianceRankFromKey()}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[4].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[5].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[5].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[6].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[6].countryCode}/></div>
                    </div>
                    <div className="res-team-row">
                      <div className="res-team-name">{teams[7].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[7].countryCode}/></div>
                    </div>
                  </div>
                }
                {
                  match.tournamentLevel >= 10 &&
                  teams.length <= 6 &&
                  <div className="res-card-teams">
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[3].teamNameShort}</div>
                      <div className="res-team-rank">#{match.participants[3].getAllianceRankFromKey()}</div>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[3].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[4].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[4].countryCode}/></div>
                    </div>
                    <div className="res-team-row bottom-blue">
                      <div className="res-team-name">{teams[5].teamNameShort}</div>
                      <div className="res-team-rank"/>
                      <div className="res-team-flag"><span className={"flag-icon flag-border flag-icon-" + teams[5].countryCode}/></div>
                    </div>
                  </div>
                }
                <div className="res-card-details">
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'solar icon'} src={SOLAR_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">SOLAR FACTORY</div>
                    <div className="res-detail-right">{blueSolarPanelPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'wind icon'} src={WIND_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">WIND TURBINE</div>
                    <div className="res-detail-right">{blueWindPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'reactor icon'} src={REACTOR_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">REACTION PLANT</div>
                    <div className="res-detail-right">{blueReactorPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'combustion icon'} src={COMBUSTION_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">COMBUSTION PLANT</div>
                    <div className="res-detail-right">{blueCombustionPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'co-op icon'} src={COOP_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">COOPERTITION BONUS</div>
                    <div className="res-detail-right">{coopPoints}</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-icon"><img alt={'parking icon'} src={PARKING_ICON} className="fit-h"/></div>
                    <div className="res-detail-left right-blue">PARKING BONUS</div>
                    <div className="res-detail-right">{blueParkingPoints}</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-icon"><img alt={'penalty icon'} src={PENALTY_ICON} className="fit-h"/></div>
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
      console.log(teams, this.props.match.participants);
      return teams;
    }
  }

  private getUpdatedRankInfo(): Ranking[] {
    if (typeof this.props.match.participants === "undefined") {
      const ranks: Ranking[] = [];
      for (let i = 0; i < 6; i++) {
        ranks.push(new Ranking().fromJSON({
          rank: 0
        }));
      }
      return ranks;
    } else {
      const ranks: Ranking[] = [];
      for (const participant of this.props.match.participants) {
        ranks.push(participant.teamRank);
      }
      return ranks;
    }
  }
}

export default MatchResultsScreen;
