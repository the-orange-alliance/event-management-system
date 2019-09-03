import * as React from "react";
import {Grid, Modal} from "semantic-ui-react";
import {
  EventConfiguration,
  PlayoffsType,
  TournamentRound,
  TournamentType,
  Ranking,
  EMSProvider
} from "@the-orange-alliance/lib-ems";
import {IApplicationState} from "../stores";
import {connect} from "react-redux";
import TournamentResultsTable from "./TournamentResultsTable";

interface IProps {
  eventConfig: EventConfiguration;
  open: boolean;
  tournament: TournamentRound;
  onClose: () => void;
}

interface IState {
  advancingTeams: number[];
  loading: boolean;
  rankings: Ranking[];
}

class TournamentResultsModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      advancingTeams: [],
      loading: true,
      rankings: []
    };
    this.updateAdvancingTeams = this.updateAdvancingTeams.bind(this);
  }

  public componentDidMount(): void {
    const {eventConfig} = this.props;
    EMSProvider.getRankingTeams(eventConfig.eventType).then((rankings: Ranking[]) => {
      this.setState({rankings: rankings});
    });
  }

  public render() {
    const {eventConfig, open, tournament, onClose} = this.props;
    const {rankings} = this.state;
    return (
      <Modal open={open} onClose={onClose} size={'fullscreen'}>
        <Modal.Header>
          (ID: {tournament.id}) {this.getTypeFromTournament(tournament.type)} Tournament Results
        </Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row columns={16}>
              <Grid.Column width={4}>
                Hello World!
              </Grid.Column>
              <Grid.Column width={12}>
                <TournamentResultsTable identifier={eventConfig.teamIdentifier} rankings={rankings} onChange={this.updateAdvancingTeams}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
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

  private updateAdvancingTeams(keys: number[]) {
    this.setState({advancingTeams: keys});
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(TournamentResultsModal);