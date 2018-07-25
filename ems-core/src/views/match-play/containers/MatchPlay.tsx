import * as React from "react";
import {Button, Card, Divider, Form, Grid, Tab} from "semantic-ui-react";
import Match from "../../../shared/models/Match";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import {PostQualConfig, TournamentLevels} from "../../../shared/AppTypes";

interface IProps {
  eventConfig?: EventConfiguration
  practiceMatches: Match[],
  qualificationMatches: Match[]
}

interface IState {
  selectedLevel: TournamentLevels,
  selectedMatch: string
  selectedField: number
}

class MatchPlay extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLevel: "Practice",
      selectedMatch: "",
      selectedField: 1
    };
  }

  public render() {
    const {selectedLevel, selectedMatch, selectedField} = this.state;

    const availableLevels = this.getAvailableTournamentLevels(this.props.eventConfig.postQualConfig).map(tournamentLevel => {
      return {
        text: tournamentLevel,
        value: tournamentLevel
      };
    });

    const availableMatches = this.getMatchesByTournamentLevel(selectedLevel).map(match => {
      return {
        text: match.matchName,
        value: match.matchKey
      };
    });

    // const availableFields = this.props.eventConfig.fieldsControlled.map(fieldNumber => {
    //   return {
    //     text: "Field " + fieldNumber,
    //     value: fieldNumber
    //   };
    // });

    const availableFields = [
      {text: "Field 1", value: 1},
      {text: "Field 2", value: 2},
      {text: "Field 3", value: 3},
      {text: "Field 4", value: 4}
    ];

    return (
      <Tab.Pane className="tab-subview">
        <h3>Match Play</h3>
        <Divider/>
        <Grid columns={16} centered={true}>
          <Grid.Row>
            <Grid.Column width={3}><Button fluid={true} color="orange">Prestart</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} color="blue">Set Audience Display</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} color="yellow">Start Match</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} color="red">Abort Match</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} color="green">Commit Scores</Button></Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        <Card.Group itemsPerRow={3}>
          <Card fluid={true}>
            <Card.Content className="center-items card-header"><Card.Header>Match Configuration</Card.Header></Card.Content>
            <Card.Content>
              <Form>
                <Grid columns={16}>
                  <Grid.Row>
                    <Grid.Column width={6}><Form.Dropdown fluid={true} selection={true} value={selectedLevel} options={availableLevels} label="Tournament Level"/></Grid.Column>
                    <Grid.Column width={6}><Form.Dropdown fluid={true} selection={true} value={selectedMatch} options={availableMatches} label="Match"/></Grid.Column>
                    <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} value={selectedField} options={availableFields} label="Field"/></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </Card.Content>
          </Card>
          <Card fluid={true}>
            <Card.Content className="center-items card-header"><Card.Header>Red Alliance Scorecard</Card.Header></Card.Content>
            <Card.Content>
              Stuff
            </Card.Content>
          </Card>
          <Card fluid={true}>
            <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
            <Card.Content>
              Stuff
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    );
  }

  private getAvailableTournamentLevels(postQualConfig: PostQualConfig): TournamentLevels[] {
    return ["Practice", "Qualification", postQualConfig === "elims" ? "Eliminations" : "Finals"];
  }

  private getMatchesByTournamentLevel(tournamentLevel: TournamentLevels): Match[] {
    switch (tournamentLevel) {
      case "Practice":
        return this.props.practiceMatches;
      case "Qualification":
        return this.props.qualificationMatches;
      default:
        return [];
    }
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    practiceMatches: internalState.practiceMatches,
    qualificationMatches: internalState.qualificationMatches
  };
}

export default connect(mapStateToProps)(MatchPlay);