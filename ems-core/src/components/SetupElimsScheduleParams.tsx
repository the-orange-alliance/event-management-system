import * as React from "react";
import {Button, Card, Dimmer, Divider, Form, Grid, Loader, Input, InputProps, Tab} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import ExplanationIcon from "./ExplanationIcon";
import {SyntheticEvent} from "react";
import DatePicker from "react-datepicker";
import {Moment} from "moment";
import {IApplicationState} from "../stores";
import {connect} from "react-redux";
import {CONFIG_STORE} from "../AppStore";
import DialogManager from "../managers/DialogManager";
import ConfirmActionModal from "./ConfirmActionModal";
import {EliminationsSchedule, Event, ScheduleItem} from "@the-orange-alliance/lib-ems";

interface IProps {
  onComplete: (scheduleItems: ScheduleItem[]) => void
  schedule: EliminationsSchedule,
  event?: Event,
  navigationDisabled?: boolean
}

interface IState {
  warningModalOpen: boolean
}

class SetupElimsScheduleParams extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      warningModalOpen: false
    };
    this.openWarningModal = this.openWarningModal.bind(this);
    this.closeWarningModal = this.closeWarningModal.bind(this);
    this.updateMatchesPerTeam = this.updateMatchesPerTeam.bind(this);
    this.updateCycleTime = this.updateCycleTime.bind(this);
    this.updateMatchConcurrency = this.updateMatchConcurrency.bind(this);
    this.addDay = this.addDay.bind(this);
    this.removeDay = this.removeDay.bind(this);
    this.generateSchedule = this.generateSchedule.bind(this);
  }

  public render() {
    const {warningModalOpen} = this.state;
    const days = this.props.schedule.days.map(day => {
      const dayBreaks = this.props.schedule.days[day.id].breaks.map(dayBreak => {
        return (
          <Grid.Row key={"day-" + day.id + "-break-" + dayBreak.id}>
            <Grid.Column width={2} className="center-items"><span>{dayBreak.name}</span></Grid.Column>
            <Grid.Column width={2}><Form.Input fluid={true} value={dayBreak.name} onChange={this.updateBreakName.bind(this, day.id, dayBreak.id)} label="Break Name"/></Grid.Column>
            <Grid.Column width={2}><Form.Input fluid={true} value={dayBreak.match} error={!dayBreak.isValidMatch()} onChange={this.updateBreakStart.bind(this, day.id, dayBreak.id)} label={<ExplanationIcon title={"Start"} content={"Designate after what match the break should begin. This number is relative to the day, not the overall schedule."}/>}/></Grid.Column>
            <Grid.Column width={2}><Form.Input fluid={true} value={dayBreak.duration} error={!dayBreak.isValidDuration()} onChange={this.updateBreakDuration.bind(this, day.id, dayBreak.id)} label="Duration"/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={dayBreak.formattedStartTime} label="Projected Break Start"/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={dayBreak.formattedEndTime} label="Projected Break End"/></Grid.Column>
          </Grid.Row>
        );
      });
      return (
        <Grid key={"day-" + day.id} columns={16}>
          <Grid.Row>
            <Grid.Column width={2} className="center-items"><span>Day {day.id + 1}:</span></Grid.Column>
            <Grid.Column width={4}>
              <Form.Field>
                <label>Day Start Time</label>
                <DatePicker
                  customInput={<Input fluid={true}/>}
                  showTimeSelect={true}
                  timeIntervals={15}
                  dateFormat="dddd, MMMM Do YYYY, h:mm a"
                  onChange={this.updateDayStartTime.bind(this, day.id)}
                  selected={day.startTime.toDate()}
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column width={2}><Form.Input fluid={true} value={day.matchesScheduled} error={!day.isValid()} onChange={this.updateDayMatches.bind(this, day.id)} label="Matches"/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={day.formattedEndTime} label="Projected Day End"/></Grid.Column>
          </Grid.Row>
          {dayBreaks}
          <Grid.Row>
            <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().secondary} onClick={this.addBreak.bind(this, day.id)} fluid={true} disabled={this.props.navigationDisabled}>Add Break</Button></Grid.Column>
            <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().secondary} onClick={this.removeBreak.bind(this, day.id)} fluid={true} disabled={!this.canRemoveBreak(day.id) || this.props.navigationDisabled}>Remove Break</Button></Grid.Column>
          </Grid.Row>
        </Grid>
      );
    });

    return (
      <Tab.Pane className="step-view-tab">
        <ConfirmActionModal open={warningModalOpen} onClose={this.closeWarningModal} onConfirm={this.generateSchedule} innerText={"You are about to generate a schedule that plans to run more than 1 match at a time. Are you sure you want to proceed?"}/>
        <Card fluid={true} color={getTheme().secondary}>
          <Dimmer active={this.props.navigationDisabled}>
            <Loader/>
          </Dimmer>
          <Card.Content>
            <Card.Header>{this.props.schedule.type} Schedule Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form widths="equal">
              <Form.Group>
                <Form.Input label="Alliance Captains" value={this.props.schedule.allianceCaptains}/>
                <Form.Input label="Cycle Time" value={this.props.schedule.cycleTime} error={!this.isValidCycleTime()} onChange={this.updateCycleTime}/>
                <Form.Input value={this.props.schedule.matchConcurrency} error={!this.isValidMatchConcurrency()} onChange={this.updateMatchConcurrency} label={<ExplanationIcon title={"Match Concurrency"} content={"Sets the number of matches that will be run at any given time. Leave this at 1 unless you have special clearence for your event."}/>}/>
                <Form.Input value={this.props.schedule.maxTotalMatches} label="Total Matches"/>
              </Form.Group>
            </Form>
          </Card.Content>
        </Card>
        <Card fluid={true} color={getTheme().secondary}>
          <Dimmer active={this.props.navigationDisabled}>
            <Loader/>
          </Dimmer>
          <Card.Content>
            <Card.Header>{this.props.schedule.type} Schedule Outline</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              {days}
              <Divider />
              <Grid columns={16}>
                <Grid.Row>
                  <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().primary} onClick={this.addDay} disabled={this.props.navigationDisabled} fluid={true}>Add Day</Button></Grid.Column>
                  <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().primary} onClick={this.removeDay} disabled={!this.canRemoveDay() || this.props.navigationDisabled} fluid={true}>Remove Day</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
        </Card>
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>{this.props.schedule.type} Schedule Generation</Card.Header>
          </Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row columns={16}>
                <Grid.Column width={4}><Button color={getTheme().primary} fluid={true} loading={this.props.navigationDisabled} disabled={!this.props.schedule.isValid() || this.props.navigationDisabled} onClick={this.openWarningModal}>Generate Schedule</Button></Grid.Column>
                <Grid.Column width={12} className="center-left-items">
                  {
                    this.props.schedule.validationMessage.length > 0 &&
                    <span className="error-text">{this.props.schedule.validationMessage}</span>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }

  private openWarningModal() {
    if (this.props.schedule.containsWarnings()) {
      this.setState({warningModalOpen: true});
    } else {
      this.generateSchedule();
    }
  }

  private closeWarningModal() {
    this.setState({warningModalOpen: false});
  }

  private updateMatchesPerTeam(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.props.schedule.matchesPerTeam = parseInt(props.value, 10);
      this.props.schedule.totalMatches = this.props.schedule.maxTotalMatches;
      this.forceUpdate();
    }
  }

  private updateCycleTime(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.props.schedule.cycleTime = parseInt(props.value, 10);
      this.props.schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private updateMatchConcurrency(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.props.schedule.matchConcurrency = parseInt(props.value, 10);
      this.props.schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private isValidMatchConcurrency(): boolean {
    return !isNaN(this.props.schedule.matchConcurrency) && this.props.schedule.matchConcurrency  > 0;
  }

  private isValidCycleTime(): boolean {
    return !isNaN(this.props.schedule.cycleTime) && this.props.schedule.cycleTime <= 15 && this.props.schedule.cycleTime > 0;
  }

  private canRemoveDay(): boolean {
    return this.props.schedule.days.length > 1;
  }

  private canRemoveBreak(day: number) {
    return this.props.schedule.days[day].breaks.length > 0;
  }

  private addDay(event: SyntheticEvent) {
    this.props.schedule.addDay();
    this.props.schedule.forceUpdate();
    this.forceUpdate();
  }

  private removeDay(event: SyntheticEvent) {
    this.props.schedule.removeDay();
    this.props.schedule.forceUpdate();
    this.forceUpdate();
  }

  private addBreak(day: number) {
    this.props.schedule.days[day].addBreak();
    this.props.schedule.forceUpdate();
    this.forceUpdate();
  }

  private removeBreak(day: number) {
    this.props.schedule.days[day].removeBreak();
    this.props.schedule.forceUpdate();
    this.forceUpdate();
  }

  private updateDayStartTime(day: number, time: Moment) {
    this.props.schedule.days[day].startTime = time;
    this.props.schedule.forceUpdate();
    this.forceUpdate();
  }

  private updateDayMatches(day: number, event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.props.schedule.days[day].matchesScheduled = parseInt(props.value, 10) || 0;
      this.props.schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private updateBreakName(day: number, dayBreak: number, event: SyntheticEvent, props: InputProps) {
    this.props.schedule.days[day].breaks[dayBreak].name = props.value;
    this.forceUpdate();
  }

  private updateBreakStart(day: number, dayBreak: number, event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.props.schedule.days[day].breaks[dayBreak].match = parseInt(props.value, 10) || 0;
      this.props.schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private updateBreakDuration(day: number, dayBreak: number, event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.props.schedule.days[day].breaks[dayBreak].duration = parseInt(props.value, 10) || 0;
      this.props.schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private generateSchedule() { // TODO - Check to see if an online schedule has already been posted.
    this.closeWarningModal();
    this.props.schedule.totalMatches = this.props.schedule.maxTotalMatches;
    // this.props.schedule.tournamentId = this.props.activeRound.id;
    CONFIG_STORE.getAll().then((config: any) => {
      let schedule: any = {};
      if (typeof config.schedule !== "undefined") {
        schedule = config.schedule;
      }
      schedule[this.props.schedule.type] = this.props.schedule.toJSON();
      CONFIG_STORE.set("schedule", schedule).then(() => {
        this.props.onComplete(this.props.schedule.generateSchedule(this.props.event));
      }).catch((err) => {
        console.log(err);
        DialogManager.showErrorBox(err);
      });
    }).catch((err) => {
      DialogManager.showErrorBox(err);
    });
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    event: configState.event,
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(SetupElimsScheduleParams);