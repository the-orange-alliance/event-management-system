import * as React from "react";
import {Button, Card, Form, InputProps, Tab} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import MatchMakerManager from "../shared/managers/MatchMakerManager";
import {ApplicationActions, IApplicationState} from "../stores";
import AppError from "../shared/models/AppError";
import DialogManager from "../shared/managers/DialogManager";
import {connect} from "react-redux";
import Event from "../shared/models/Event";
import {IDisableNavigation} from "../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation} from "../stores/internal/actions";
import Match from "../shared/models/Match";
import ScheduleItem from "../shared/models/ScheduleItem";
import EMSProvider from "../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import EliminationsSchedule from "../shared/models/EliminationsSchedule";
import AllianceMember from "../shared/models/AllianceMember";
import {SyntheticEvent} from "react";

interface IProps {
  onComplete: (matches: Match[]) => void,
  schedule: EliminationsSchedule,
  allianceMembers?: AllianceMember[],
  event?: Event,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
}

interface IState {
  scheduleItems: ScheduleItem[],
  requestingData: boolean,
  fieldCount: number
}

class SetupElimsRunMatchMaker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      scheduleItems: [],
      requestingData: true,
      fieldCount: this.props.event.fieldCount
    };
    this.updateFieldCount = this.updateFieldCount.bind(this);
    this.runMatchMaker = this.runMatchMaker.bind(this);
  }

  public componentDidMount() {
    EMSProvider.getScheduleItems(this.props.schedule.type).then((response: AxiosResponse) => {
      const items: ScheduleItem[] = [];
      if (response.data.payload && response.data.payload.length > 0) {
        for (const item of response.data.payload) {
          items.push(new ScheduleItem(this.props.schedule.type).fromJSON(item));
        }
      }
      this.setState({scheduleItems: items, requestingData: false});
    }).catch(() => {
      this.setState({requestingData: false});
    });
  }

  public render() {
    const {scheduleItems, requestingData, fieldCount} = this.state;
    return (
      <Tab.Pane className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>Match Maker Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              <Form.Field>
                <Form.Input label="Fields" value={fieldCount} onChange={this.updateFieldCount}/>
              </Form.Field>
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

  private updateFieldCount(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.setState({fieldCount: props.value as number});
    }
  }

  private runMatchMaker() {
    this.props.setNavigationDisabled(true);
    MatchMakerManager.createBracket({
      allianceCaptains: this.props.schedule.allianceCaptains,
      format: "bo3",
      allianceMembers: this.props.allianceMembers,
      eventKey: this.props.event.eventKey,
      fields: this.state.fieldCount
    }).then((matches: Match[]) => {
      let matchNumber: number = 0;
      for (const item of this.state.scheduleItems) { // This is assuming scheduleItems and matchList have the same lengths...
        if (item.isMatch) {
          matches[matchNumber].scheduledStartTime = item.startTime;
          matchNumber++;
        }
      }
      this.props.setNavigationDisabled(false);
      this.props.onComplete(matches);
    }).catch((error: AppError) => {
      console.log(error);
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    event: configState.event,
    navigationDisabled: internalState.navigationDisabled,
    allianceMembers: internalState.allianceMembers
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupElimsRunMatchMaker);