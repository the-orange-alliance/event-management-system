import * as React from "react";
import {Button, Card, Form, RadioProps, Tab} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import {TournamentLevels} from "../shared/AppTypes";
import {SyntheticEvent} from "react";
import Schedule from "../shared/models/Schedule";
import MatchMakerManager from "../shared/managers/MatchMakerManager";
import Team from "../shared/models/Team";
import {IApplicationState} from "../stores";
import AppError from "../shared/models/AppError";
import DialogManager from "../shared/managers/DialogManager";
import {connect} from "react-redux";
import Event from "../shared/models/Event";

interface IProps {
  type: TournamentLevels
  schedule: Schedule,
  teamList?: Team[],
  event?: Event
}

interface IState {
  matchMakerQuality: string
}

class SetupRunMatchMaker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      matchMakerQuality: "-b"
    };
    this.onQualityChange = this.onQualityChange.bind(this);
    this.runMatchMaker = this.runMatchMaker.bind(this);
  }

  public render() {
    const {matchMakerQuality} = this.state;
    return (
      <Tab.Pane className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>Match Maker Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              <Form.Field>
                <b>Match Maker Quality Options</b>
              </Form.Field>
              <Form.Radio value="-f" label="Fair Quality" name="mmOptions" checked={matchMakerQuality === "-f"} onChange={this.onQualityChange}/>
              <Form.Radio value="-g" label="Good Quality" name="mmOptions" checked={matchMakerQuality === "-g"} onChange={this.onQualityChange} />
              <Form.Radio value="-b" label="Best Quality (Recommended)" name="mmOptions" checked={matchMakerQuality === "-b"} onChange={this.onQualityChange}/>
              <Form.Field>
                <Button color={getTheme().primary} onClick={this.runMatchMaker}>Run Match Maker</Button>
              </Form.Field>
            </Form>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }

  private onQualityChange(event: SyntheticEvent, props: RadioProps) {
    this.setState({matchMakerQuality: props.value.toString()});
  }

  private runMatchMaker() {
    MatchMakerManager.createTeamList(this.props.teamList).then(() => { // TODO - This needs to be changed in case of finals!
      MatchMakerManager.execute({
        teams: this.props.schedule.teamsParticipating,
        rounds: this.props.schedule.matchesPerTeam,
        quality: this.state.matchMakerQuality,
        teamsPerAlliance: this.props.schedule.teamsPerAlliance,
        fields: this.props.event.fieldCount,
        eventKey: this.props.event.eventKey,
        type: this.props.type
      }).then((data: any) => {
        console.log(data);
      }).catch((error: AppError) => {
        DialogManager.showErrorBox(error);
      });
    }).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    teamList: internalState.teamList,
    event: configState.event
  };
}

export default connect(mapStateToProps)(SetupRunMatchMaker);