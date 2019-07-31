import * as React from "react";
import {EventConfiguration, TournamentRound, Schedule} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Tab} from "semantic-ui-react";
import SetupRoundRobinScheduleParams from "./SetupRoundRobinScheduleParams";
import {IAddPlayoffsSchedule} from "../stores/config/types";
import {addPlayoffsSchedule} from "../stores/config/actions";
import {Dispatch} from "redux";

interface IProps {
  eventConfig?: EventConfiguration,
  playoffsSchedule: Schedule[],
  addSchedule?: (schedule: Schedule) => IAddPlayoffsSchedule
}

class TournamentScheduleOverview extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.onScheduleParamsComplete = this.onScheduleParamsComplete.bind(this);
  }

  public render() {
    const {eventConfig} = this.props;
    let activeTournament: TournamentRound;

    if (Array.isArray(eventConfig.tournament)) {
      const rounds = eventConfig.tournament.filter((r: TournamentRound) => r.id === eventConfig.activeTournamentID);
      if (rounds.length > 0) {
        activeTournament = rounds[0];
      }
    } else {
      if (eventConfig.tournament.id === eventConfig.activeTournamentID) {
        activeTournament = eventConfig.tournament;
      }
    }

    let view;

    if (typeof activeTournament === "undefined") {
      view = (
        <Tab.Pane className={"step-view-tab"}>
          <div>
            <i>There is currently no active tournament level. Please go back to the tournament overview and make a tournament active.</i>
          </div>
        </Tab.Pane>
      );
    } else {
      switch (activeTournament.type) {
        case "rr":
          view = <SetupRoundRobinScheduleParams activeRound={activeTournament}/>;
          break;
        case "elims":
          view = <SetupRoundRobinScheduleParams activeRound={activeTournament}/>;
          break;
        case "ranking":
          view = <span>Nope.</span>;
          break;
      }
    }

    return (view);
  }

  private onScheduleParamsComplete(schedule: Schedule) {
    console.log(schedule);
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    playoffsSchedule: configState.playoffsSchedule
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    addSchedule: (schedule: Schedule) => dispatch(addPlayoffsSchedule(schedule))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TournamentScheduleOverview);