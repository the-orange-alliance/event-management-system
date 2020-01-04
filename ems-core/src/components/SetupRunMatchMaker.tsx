import * as React from "react";
import {Button, Card, Form, RadioProps, Tab} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {SyntheticEvent} from "react";
import MatchMakerManager from "../managers/MatchMakerManager";
import {ApplicationActions, IApplicationState} from "../stores";
import DialogManager from "../managers/DialogManager";
import {connect} from "react-redux";
import {IDisableNavigation} from "../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation} from "../stores/internal/actions";
import {AppError, EMSProvider, Event, Match, Schedule, ScheduleItem, Team} from "@the-orange-alliance/lib-ems";

interface IProps {
  teams: Team[],
  schedule: Schedule,
  onComplete: (matches: Match[]) => void,
  event?: Event,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
}

interface IState {
  matchMakerQuality: string,
  scheduleItems: ScheduleItem[],
  requestingData: boolean
}

class SetupRunMatchMaker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      matchMakerQuality: "-b",
      scheduleItems: [],
      requestingData: true
    };
    this.onQualityChange = this.onQualityChange.bind(this);
    this.runMatchMaker = this.runMatchMaker.bind(this);
  }

  public componentDidMount() {
    EMSProvider.getScheduleItems(this.props.schedule.type).then((scheduleItems: ScheduleItem[]) => {
      this.setState({scheduleItems, requestingData: false});
    }).catch(() => {
      this.setState({requestingData: false});
    });
  }

  public render() {
    const {matchMakerQuality, scheduleItems, requestingData} = this.state;
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
                <Button color={getTheme().primary} disabled={this.props.navigationDisabled || scheduleItems.length === 0} loading={this.props.navigationDisabled} onClick={this.runMatchMaker}>Run Match Maker</Button>
                {
                  scheduleItems.length === 0 && !requestingData &&
                  <span className="error-text"><i>There is currently no generated {this.props.schedule.type.toString().toLowerCase()} schedule. Head over to the 'Schedule Parameters' tab to generate one.</i></span>
                }
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
    const {schedule} = this.props;
    const {scheduleItems} = this.state;
    this.props.setNavigationDisabled(true);
    MatchMakerManager.execute({
      teams: this.props.schedule.teamsParticipating,
      rounds: this.props.schedule.matchesPerTeam,
      quality: this.state.matchMakerQuality,
      teamsPerAlliance: this.props.schedule.teamsPerAlliance,
      fields: this.props.event.fieldCount,
      eventKey: this.props.event.eventKey,
      type: this.props.schedule.type
    }).then((matches: Match[]) => {
      let matchNumber: number = 0;
      let fieldIndex: number = 0;
      let index: number = 0;
      for (const item of scheduleItems) { // This is assuming scheduleItems and matchList have the same lengths...
        if (item.isMatch && schedule.type === "Qualification") {
          matches[matchNumber].scheduledStartTime = item.startTime;
          // TODO - Only a FIRST Global thing.
          if (((item.day + 1) === schedule.days.length) && schedule.type === "Qualification") {
            // This is the last day. Only use fields 3, 4, and 5.
            matches[matchNumber].fieldNumber = index + 3;
            index++;
            if (index % 3 === 0) {
              index = 0;
            }
          } else {
            // TODO - ONLY A FIRST GLOBAL THING.
            if (item.duration === 7) {
              matches[matchNumber].fieldNumber = 5; // Premiere field.
            } else {
              if (fieldIndex >= 4) {
                fieldIndex = 1;
              } else {
                fieldIndex++;
              }
              if (fieldIndex === 1) {
                matches[matchNumber].fieldNumber = 1; // Normal field.
              }
              if (fieldIndex === 2) {
                matches[matchNumber].fieldNumber = 4; // Normal field.
              }
              if (fieldIndex === 3) {
                matches[matchNumber].fieldNumber = 2; // Normal field.
              }
              if (fieldIndex === 4) {
                matches[matchNumber].fieldNumber = 3; // Normal field.
              }
            }
          }
          matchNumber++;
        } else if (item.isMatch) {
          if (fieldIndex >= 4) {
            fieldIndex = 1;
          } else {
            fieldIndex++;
          }

          matches[matchNumber].scheduledStartTime = item.startTime;

          if (fieldIndex === 1) {
            matches[matchNumber].fieldNumber = 1; // Normal field.
          }
          if (fieldIndex === 2) {
            matches[matchNumber].fieldNumber = 4; // Normal field.
          }
          if (fieldIndex === 3) {
            matches[matchNumber].fieldNumber = 2; // Normal field.
          }
          if (fieldIndex === 4) {
            matches[matchNumber].fieldNumber = 3; // Normal field.
          }

          matchNumber++;
        }
      }
      this.props.setNavigationDisabled(false);
      this.props.onComplete(matches);
    }).catch((error: AppError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    event: configState.event,
    navigationDisabled: internalState.navigationDisabled
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupRunMatchMaker);