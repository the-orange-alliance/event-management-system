import * as React from "react";
import {Button, Card, Divider, DropdownProps, Form, Grid, Tab} from "semantic-ui-react";
import Match from "../../../shared/models/Match";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import {PostQualConfig, TournamentLevels} from "../../../shared/AppTypes";
import {SyntheticEvent} from "react";

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
    this.changeSelectedLevel = this.changeSelectedLevel.bind(this);
    this.changeSelectedMatch = this.changeSelectedMatch.bind(this);
    this.changeSelectedField = this.changeSelectedField.bind(this);
  }

  public render() {
    const {selectedLevel, selectedMatch, selectedField} = this.state;
    const fieldControl: number[] = (typeof this.props.eventConfig.fieldsControlled === "undefined" ? [1] : this.props.eventConfig.fieldsControlled);

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

    const availableFields = fieldControl.map(fieldNumber => {
      return {
        text: "Field " + fieldNumber,
        value: fieldNumber
      };
    });

    return (
      <Tab.Pane className="tab-subview">
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column textAlign="left"><b>Match Status: </b>UNDEFINED</Grid.Column>
            <Grid.Column textAlign="center"><b>02:30 </b>(TELEOP)</Grid.Column>
            <Grid.Column textAlign="right"><b>Connection Status: </b>OKAY</Grid.Column>
          </Grid.Row>
        </Grid>
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
                    <Grid.Column width={6}><Form.Dropdown fluid={true} selection={true} value={selectedLevel} options={availableLevels} onChange={this.changeSelectedLevel} label="Tournament Level"/></Grid.Column>
                    <Grid.Column width={6}><Form.Dropdown fluid={true} selection={true} value={selectedMatch} options={availableMatches} onChange={this.changeSelectedMatch} label="Match"/></Grid.Column>
                    <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} value={selectedField} options={availableFields} onChange={this.changeSelectedField} label="Field"/></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={4}><Form.Input label="Start Delay"/></Grid.Column>
                    <Grid.Column width={4}><Form.Input label="Autonomous"/></Grid.Column>
                    <Grid.Column width={4}><Form.Input label="Teleop"/></Grid.Column>
                    <Grid.Column width={4}><Form.Input label="End Game"/></Grid.Column>
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

  private changeSelectedLevel(event: SyntheticEvent, props: DropdownProps) {
    const matches = this.getMatchesByTournamentLevel((props.value as TournamentLevels));
    if (matches.length > 0) {
      this.setState({
        selectedLevel: (props.value as TournamentLevels),
        selectedMatch: matches[0].matchKey,
        selectedField: matches[0].fieldNumber,
      });
    } else {
      this.setState({
        selectedLevel: (props.value as TournamentLevels),
        selectedMatch: "",
        selectedField: -1,
      });
    }
  }

  private changeSelectedMatch(event: SyntheticEvent, props: DropdownProps) {
    for (const match of this.getMatchesByTournamentLevel(this.state.selectedLevel)) {
      if (match.matchKey === (props.value as string)) {
        this.setState({
          selectedMatch: match.matchKey,
          selectedField: match.fieldNumber,
        });
        break;
      }
    }
  }

  private changeSelectedField(event: SyntheticEvent, props: DropdownProps) {
    this.setState({
      selectedField: (props.value as number),
    });
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