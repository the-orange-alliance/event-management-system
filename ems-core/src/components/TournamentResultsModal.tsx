import * as React from "react";
import {Modal} from "semantic-ui-react";
import {
  EventConfiguration,
  EventType,
  PlayoffsType,
  TournamentRound,
  TournamentType,
  Ranking,
  EnergyImpactRanking,
  OceanOpportunitiesRank,
  RoverRuckusRank, EMSProvider
} from "@the-orange-alliance/lib-ems";
import {IApplicationState} from "../stores";
import EnergyImpactRankTable from "./game-specifics/energy-impact/EnergyImpactRankTable";
import OceanOpportunitiesRankTable from "./game-specifics/ocean-opportunities/OceanOpportunitiesRankTable";
import RoverRuckusRankTable from "./game-specifics/rover-ruckus/RoverRuckusRankTable";
import {connect} from "react-redux";

interface IProps {
  eventConfig: EventConfiguration;
  open: boolean;
  tournament: TournamentRound;
  onClose: () => void;
}

interface IState {
  loading: boolean;
  rankings: Ranking[];
}

class TournamentResultsModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      rankings: []
    };
  }

  public componentDidMount(): void {
    const {eventConfig} = this.props;
    EMSProvider.getRankingTeams(eventConfig.eventType).then((rankings: Ranking[]) => {
      console.log(rankings);
      this.setState({rankings: rankings});
    });
  }

  public render() {
    const {eventConfig, open, tournament, onClose} = this.props;
    return (
      <Modal open={open} onClose={onClose} size={'fullscreen'}>
        <Modal.Header>
          (ID: {tournament.id}) {this.getTypeFromTournament(tournament.type)} Tournament Results
        </Modal.Header>
        <Modal.Content>
          {this.getRankingTable(eventConfig.eventType)}
        </Modal.Content>
      </Modal>
    );
  }

  private getRankingTable(eventType: EventType) {
    const {eventConfig} = this.props;
    const {rankings} = this.state;
    switch (eventType) {
      case "fgc_2018":
        return <EnergyImpactRankTable rankings={rankings as EnergyImpactRanking[]} identifier={eventConfig.teamIdentifier}/>;
      case "fgc_2019":
        return <OceanOpportunitiesRankTable rankings={rankings as OceanOpportunitiesRank[]} identifier={eventConfig.teamIdentifier}/>;
      case "ftc_1819":
        return <RoverRuckusRankTable rankings={rankings as RoverRuckusRank[]} identifier={eventConfig.teamIdentifier}/>;
      default:
        return <EnergyImpactRankTable rankings={rankings as EnergyImpactRanking[]}/>;
    }
  }

  private getTypeFromTournament(type: PlayoffsType): TournamentType {
    switch(type) {
      case "elims":
        return "Eliminations";
      case "ranking":
        return "Ranking";
      case "rr":
        return "Round Robin";
      default:
        return "Eliminations";
    }
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(TournamentResultsModal);