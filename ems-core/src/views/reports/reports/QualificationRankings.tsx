import * as React from "react";
import ReportTemplate from "./ReportTemplate";
import DialogManager from "../../../managers/DialogManager";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import EnergyImpactRankTable from "../../../components/game-specifics/EnergyImpactRankTable";
import RoverRuckusRankTable from "../../../components/game-specifics/RoverRuckusRankTable";
import {EMSProvider, EnergyImpactRanking, EventConfiguration, EventType, HttpError, Ranking,
  RoverRuckusRank
} from "@the-orange-alliance/lib-ems";

interface IProps {
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean,
  rankings: Ranking[]
}

class QualificationRankings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false,
      rankings: []
    };
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((rankings: Ranking[]) => {
      this.setState({generated: true, rankings});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({generated: true});
    });
  }

  // TODO - We already have game-specific rank tables... Use them?
  public render() {
    const {onHTMLUpdate, eventConfig} = this.props;
    const {generated, rankings} = this.state;
    let view = this.getRankingTable(eventConfig.eventType);
    if (rankings.length <= 0) {
      view = (<span>There are no rankings to report.</span>);
    }
    return (
      <ReportTemplate
        generated={generated}
        name={"Qualification Rankings"}
        updateHTML={onHTMLUpdate}
        children={view}
      />
    );
  }

  private getRankingTable(eventType: EventType) {
    switch (eventType) {
      case "fgc_2018":
        return <EnergyImpactRankTable rankings={this.state.rankings as EnergyImpactRanking[]} identifier={this.props.eventConfig.teamIdentifier}/>;
      case "ftc_1819":
        return <RoverRuckusRankTable rankings={this.state.rankings as RoverRuckusRank[]} identifier={this.props.eventConfig.teamIdentifier}/>;
      default:
        return <EnergyImpactRankTable rankings={this.state.rankings as EnergyImpactRanking[]}/>;
    }
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(QualificationRankings);