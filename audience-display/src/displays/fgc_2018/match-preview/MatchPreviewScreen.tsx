import * as React from "react";

import "./MatchPreviewScreen.css";
import FGC_LOGO from "../res/Before_Screen_Logo.png";
import RED_FLAG from "../res/Red_Team_Tag.png";
import BLUE_FLAG from "../res/Blue_Team_Tag.png";
import Match from "../../../shared/models/Match";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import Team from "../../../shared/models/Team";
import Ranking from "../../../shared/models/Ranking";

interface IProps {
  match: Match,
}

interface IState {
  match: Match,
  teams: Team[],
  ranks: Ranking[]
}

class MatchPreviewScreen extends React.Component<IProps, IState> {
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
    return (
      <div id="fgc-body">
        <div id="fgc-container">
          <div id="fgc-pre-header">
            <img id="fgc-pre-logo" src={FGC_LOGO}/>
          </div>
          <div id="fgc-pre-match-info">
            <div id="fgc-pre-match-info-left">
              <div className="pre-match-info-left center-items">
                <span>MATCH</span>
              </div>
              <div className="pre-match-info-right center-items">
                <span>{match.abbreviatedName}</span>
              </div>
            </div>
            <div id="fgc-pre-match-info-left">
              <div className="pre-match-info-left center-items">
                <span>FIELD</span>
              </div>
              <div className="pre-match-info-right center-items">
                <span>{match.fieldNumber}</span>
              </div>
            </div>
          </div>
          <div className="pre-match-alliance">
            <div className="pre-match-alliance-left">
              <img src={RED_FLAG} className="auto-w"/>
            </div>
            {
              match.tournamentLevel < 10 &&
              <div className="pre-match-alliance-right">
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank">{match.tournamentLevel > 0 ? "#" + ranks[0].rank : ""}</div>
                  <div className="pre-match-team">{teams[0].teamNameShort} ({teams[0].country})</div>
                  <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[0].countryCode}/></div>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank">{match.tournamentLevel > 0 ? "#" + ranks[1].rank : ""}</div>
                  <div className="pre-match-team">{teams[1].teamNameShort} ({teams[1].country})</div>
                  <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[1].countryCode}/></div>
                </div>
                <div className="pre-match-alliance-row">
                  <div className="pre-match-rank">{match.tournamentLevel > 0 ? "#" + ranks[2].rank : ""}</div>
                  <div className="pre-match-team">{teams[2].teamNameShort} ({teams[2].country})</div>
                  <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[2].countryCode}/></div>
                </div>
              </div>
            }
            {
              match.tournamentLevel >= 10 &&
              <div className="pre-match-alliance-right">
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank">#{match.participants[0].getAllianceRankFromKey()}</div>
                  <div className="pre-match-team">{teams[0].teamNameShort} ({teams[0].country})</div>
                  <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[0].countryCode}/></div>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank"/>
                  <div className="pre-match-team">{teams[1].teamNameShort} ({teams[1].country})</div>
                  <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[1].countryCode}/></div>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank"/>
                  <div className="pre-match-team">{teams[2].teamNameShort} ({teams[2].country})</div>
                  <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[2].countryCode}/></div>
                </div>
                {
                  teams.length > 6 &&
                  <div className="pre-match-alliance-row">
                    <div className="pre-match-rank"/>
                    <div className="pre-match-team">{teams[3].teamNameShort} ({teams[3].country})</div>
                    <div className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[3].countryCode}/></div>
                  </div>
                }
              </div>
            }
          </div>
          <div className="pre-match-alliance">
            <div className="pre-match-alliance-left">
              <img src={BLUE_FLAG} className="auto-w"/>
            </div>
            {
              match.tournamentLevel < 10 &&
              <div className="pre-match-alliance-right">
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank">{match.tournamentLevel > 0 ? "#" + ranks[3].rank : ""}</div>
                  <span className="pre-match-team">{teams[3].teamNameShort} ({teams[3].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[3].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <div className="pre-match-rank">{match.tournamentLevel > 0 ? "#" + ranks[4].rank : ""}</div>
                  <span className="pre-match-team">{teams[4].teamNameShort} ({teams[4].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[4].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row">
                  <div className="pre-match-rank">{match.tournamentLevel > 0 ? "#" + ranks[5].rank : ""}</div>
                  <span className="pre-match-team">{teams[5].teamNameShort} ({teams[5].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[5].countryCode}/></span>
                </div>
              </div>
            }
            {
              match.tournamentLevel >= 10 &&
              teams.length > 6 &&
              <div className="pre-match-alliance-right">
                <div className="pre-match-alliance-row pre-match-border">
                  <span className="pre-match-rank">#{match.participants[4].getAllianceRankFromKey()}</span>
                  <span className="pre-match-team">{teams[4].teamNameShort} ({teams[4].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[4].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <span className="pre-match-rank"/>
                  <span className="pre-match-team">{teams[5].teamNameShort} ({teams[5].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[5].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <span className="pre-match-rank"/>
                  <span className="pre-match-team">{teams[6].teamNameShort} ({teams[6].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[6].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row">
                  <span className="pre-match-rank"/>
                  <span className="pre-match-team">{teams[7].teamNameShort} ({teams[7].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[7].countryCode}/></span>
                </div>
              </div>
            }
            {
              match.tournamentLevel >= 10 &&
              teams.length <= 6 &&
              <div className="pre-match-alliance-right">
                <div className="pre-match-alliance-row pre-match-border">
                  <span className="pre-match-rank">#{match.participants[3].getAllianceRankFromKey()}</span>
                  <span className="pre-match-team">{teams[3].teamNameShort} ({teams[3].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[3].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <span className="pre-match-rank"/>
                  <span className="pre-match-team">{teams[4].teamNameShort} ({teams[4].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[4].countryCode}/></span>
                </div>
                <div className="pre-match-alliance-row pre-match-border">
                  <span className="pre-match-rank"/>
                  <span className="pre-match-team">{teams[5].teamNameShort} ({teams[5].country})</span>
                  <span className="pre-match-flag"><span className={"flag-icon flag-border flag-icon-" + teams[5].countryCode}/></span>
                </div>
              </div>
            }
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

export default MatchPreviewScreen;