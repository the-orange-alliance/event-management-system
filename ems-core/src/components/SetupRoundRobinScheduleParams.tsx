import * as React from "react";
import {Button, Card, Dimmer, Divider, Form, Grid, Input, InputProps, Loader, Tab} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {EventConfiguration, Schedule, RoundRobinFormat, TournamentRound, RoundRobinSchedule} from "@the-orange-alliance/lib-ems";
import {IApplicationState} from "../stores";
import {connect} from "react-redux";
import ExplanationIcon from "./ExplanationIcon";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import {SyntheticEvent} from "react";

interface IProps {
  activeRound: TournamentRound,
  eventConfig?: EventConfiguration,
  navigationDisabled?: boolean,
  playoffsSchedule?: Schedule[]
}

class SetupRoundRobinScheduleParams extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.updateCycleTime = this.updateCycleTime.bind(this);
    this.addDay = this.addDay.bind(this);
    this.removeDay = this.removeDay.bind(this);
  }

  public componentDidMount() {
    const {activeRound, playoffsSchedule} = this.props;
    if (playoffsSchedule.length > 0) {
      const format: RoundRobinFormat = activeRound.format as RoundRobinFormat;
      (playoffsSchedule[activeRound.id] as RoundRobinSchedule).alliances = format.alliances;
      (playoffsSchedule[activeRound.id] as RoundRobinSchedule).teamsPerAlliance = format.teamsPerAlliance;
      this.forceUpdate();
    }
  }

  public render() {
    const {activeRound, navigationDisabled, playoffsSchedule} = this.props;
    const format: RoundRobinFormat = activeRound.format as RoundRobinFormat;
    const schedule: RoundRobinSchedule = playoffsSchedule.length > 0 ? playoffsSchedule[activeRound.id] as RoundRobinSchedule : new RoundRobinSchedule();

    const days = schedule.days.map(day => {
      const dayBreaks = schedule.days[day.id].breaks.map(dayBreak => {
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
                  dateFormat="EEEE, MMMM d YYYY, h:mm a"
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
            <Grid.Column largeScreen={2} tablet={4}><Button color={getTheme().secondary} onClick={this.addBreak.bind(this, day.id)} fluid={true} disabled={navigationDisabled}>Add Break</Button></Grid.Column>
            <Grid.Column largeScreen={2} tablet={4}><Button color={getTheme().secondary} onClick={this.removeBreak.bind(this, day.id)} fluid={true} disabled={!this.canRemoveBreak(day.id) || navigationDisabled}>Remove Break</Button></Grid.Column>
          </Grid.Row>
        </Grid>
      );
    });

    return (
      <Tab.Pane className={"step-view-tab"}>
        <Card fluid={true} color={getTheme().secondary}>
          <Dimmer active={false}>
            <Loader/>
          </Dimmer>
          <Card.Content>
            <Card.Header>Round Robin Schedule Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form widths={"equal"}>
              <Form.Group>
                <Form.Input label={"Alliances"} disabled={true} value={format.alliances}/>
                <Form.Input label={"Total Rounds"} disabled={true} value={schedule.maxTotalRounds}/>
                <Form.Input label={"Matches Per Round"} disabled={true} value={schedule.maxMatchesPerRound}/>
                <Form.Input label={"Total Matches"} disabled={true} value={schedule.maxTotalMatches}/>
                <Form.Input label="Cycle Time" value={schedule.cycleTime} error={!this.isValidCycleTime()} onChange={this.updateCycleTime}/>
              </Form.Group>
            </Form>
          </Card.Content>
        </Card>
        <Card fluid={true} color={getTheme().secondary}>
          <Dimmer active={navigationDisabled}>
            <Loader/>
          </Dimmer>
          <Card.Content>
            <Card.Header>{schedule.type} Schedule Outline</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              {days}
              <Divider />
              <Grid columns={16}>
                <Grid.Row>
                  <Grid.Column largeScreen={2} tablet={4}><Button color={getTheme().primary} onClick={this.addDay} disabled={this.props.navigationDisabled} fluid={true}>Add Day</Button></Grid.Column>
                  <Grid.Column largeScreen={2} tablet={4}><Button color={getTheme().primary} onClick={this.removeDay} disabled={!this.canRemoveDay() || this.props.navigationDisabled} fluid={true}>Remove Day</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
        </Card>
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>{schedule.type} Schedule Generation</Card.Header>
          </Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row columns={16}>
                <Grid.Column width={4}><Button color={getTheme().primary} fluid={true} loading={this.props.navigationDisabled} disabled={!schedule.isValid() || this.props.navigationDisabled}>Generate Schedule</Button></Grid.Column>
                <Grid.Column width={12} className="center-left-items">
                  {
                    schedule.validationMessage.length > 0 &&
                    <span className="error-text">{schedule.validationMessage}</span>
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }

  private updateCycleTime(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      const {activeRound, playoffsSchedule} = this.props;
      const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
      schedule.cycleTime = parseInt(props.value, 10);
      schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  // private isValidMatchConcurrency(): boolean {
  //   const {activeRound, playoffsSchedule} = this.props;
  //   const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
  //   return !isNaN(schedule.matchConcurrency) && schedule.matchConcurrency  > 0;
  // }

  private isValidCycleTime(): boolean {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    return !isNaN(schedule.cycleTime) && schedule.cycleTime <= 15 && schedule.cycleTime > 0;
  }

  private canRemoveDay(): boolean {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    return schedule.days.length > 1;
  }

  private canRemoveBreak(day: number) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    return schedule.days[day].breaks.length > 0;
  }

  private addDay(event: SyntheticEvent) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    schedule.addDay();
    schedule.forceUpdate();
    this.forceUpdate();
  }

  private removeDay(event: SyntheticEvent) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    schedule.removeDay();
    schedule.forceUpdate();
    this.forceUpdate();
  }

  private addBreak(day: number) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    schedule.days[day].addBreak();
    schedule.forceUpdate();
    this.forceUpdate();
  }

  private removeBreak(day: number) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    schedule.days[day].removeBreak();
    schedule.forceUpdate();
    this.forceUpdate();
  }

  private updateDayStartTime(day: number, time: Date) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    schedule.days[day].startTime = moment(time);
    schedule.forceUpdate();
    this.forceUpdate();
  }

  private updateDayMatches(day: number, event: SyntheticEvent, props: InputProps) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    if (!isNaN(props.value)) {
      schedule.days[day].matchesScheduled = parseInt(props.value, 10) || 0;
      schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private updateBreakName(day: number, dayBreak: number, event: SyntheticEvent, props: InputProps) {
    const {activeRound, playoffsSchedule} = this.props;
    const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
    schedule.days[day].breaks[dayBreak].name = props.value;
    this.forceUpdate();
  }

  private updateBreakStart(day: number, dayBreak: number, event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      const {activeRound, playoffsSchedule} = this.props;
      const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
      schedule.days[day].breaks[dayBreak].match = parseInt(props.value, 10) || 0;
      schedule.forceUpdate();
      this.forceUpdate();
    }
  }

  private updateBreakDuration(day: number, dayBreak: number, event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      const {activeRound, playoffsSchedule} = this.props;
      const schedule = playoffsSchedule[activeRound.id] as RoundRobinSchedule;
      schedule.days[day].breaks[dayBreak].duration = parseInt(props.value, 10) || 0;
      schedule.forceUpdate();
      this.forceUpdate();
    }
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    navigationDisabled: internalState.navigationDisabled,
    playoffsSchedule: configState.playoffsSchedule
  };
}

export default connect(mapStateToProps)(SetupRoundRobinScheduleParams);