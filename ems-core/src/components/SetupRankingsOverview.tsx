import * as React from "react";
import {getTheme} from "../AppTheme";
import {Card} from "semantic-ui-react";
import {IApplicationState} from "../stores";
import DialogManager from "../managers/DialogManager";
import EnergyImpactRankTable from "./game-specifics/energy-impact/EnergyImpactRankTable";
import {connect} from "react-redux";
import RoverRuckusRankTable from "./game-specifics/rover-ruckus/RoverRuckusRankTable";
import {
  EMSProvider,
  EnergyImpactRanking,
  EventConfiguration,
  EventType,
  HttpError,
  InfiniteRechargeRank, OceanOpportunitiesRank,
  Ranking,
  RankingMatchesFormat,
  RoverRuckusRank
} from "@the-orange-alliance/lib-ems";
import FRC20RankTable from "./game-specifics/frc20/FRC20RankTable";
import OceanOpportunitiesRankTable from "./game-specifics/ocean-opportunities/OceanOpportunitiesRankTable";

interface IProps {
  eventConfig?: EventConfiguration
}

interface IState {
  rankings: Ranking[]
}

class SetupRankingsOverview extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      rankings: []
    }
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((rankings: Ranking[]) => {
      this.setState({rankings});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
    });
  }

  public render() {
    const {eventConfig} = this.props;
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament; // TODO - CHANGE
    return (
      <div className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            {
              tournamentRound.type === "ranking" && (tournamentRound.format as RankingMatchesFormat).rankingCutoff <= 0 &&
              <span><i>You currently don't have a valid ranking cutoff for finals matches. Please go over to the 'settings' tab and provide a valid value.</i></span>
            }
            {
              tournamentRound.type === "ranking" && (tournamentRound.format as RankingMatchesFormat).rankingCutoff > 0 &&
              <span><i>The following teams have qualified for finals matches based upon the ranking cutoff. Once you have finished your qualification matches, head over to the 'Schedule Parameters' tab to generate a finals schedule.</i></span>
            }
          </Card.Content>
          <Card.Content>
            {this.getRankingTable(eventConfig.eventType)}
          </Card.Content>
        </Card>
      </div>
    );
  }

  private getRankingTable(eventType: EventType) {
    switch (eventType) {
      case "fgc_2018":
        return <EnergyImpactRankTable rankings={this.state.rankings as EnergyImpactRanking[]} identifier={this.props.eventConfig.teamIdentifier}/>;
      case "ftc_1819":
        return <RoverRuckusRankTable rankings={this.state.rankings as RoverRuckusRank[]} identifier={this.props.eventConfig.teamIdentifier}/>;
      case "fgc_2019":
        return <EnergyImpactRankTable rankings={this.state.rankings as EnergyImpactRanking[]}/>;
      case "frc_20":
        return <FRC20RankTable rankings={this.state.rankings as InfiniteRechargeRank[]}/>;
      default:
        return <OceanOpportunitiesRankTable rankings={this.state.rankings as OceanOpportunitiesRank[]}/>;
    }
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(SetupRankingsOverview);
