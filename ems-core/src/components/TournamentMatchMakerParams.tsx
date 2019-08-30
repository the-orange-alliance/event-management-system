import * as React from "react";
import {EventConfiguration, Match, TournamentRound} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Tab} from "semantic-ui-react";
import SetupRoundRobinMatchMakerParams from "./SetupRoundRobinMatchMakerParams";
import {IAddPlayoffsMatches} from "../stores/internal/types";
import {Dispatch} from "redux";
import {addPlayoffsMatches} from "../stores/internal/actions";
import SetupElimsRunMatchMaker from "./SetupElimsRunMatchMaker";

interface IProps {
  eventConfig?: EventConfiguration,
  playoffsMatches: Match[],
  addPlayoffsMatches: (matches: Match[], tournamentId: number) => IAddPlayoffsMatches
}

class TournamentMatchMakerParams extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.onMatchGenerationComplete = this.onMatchGenerationComplete.bind(this);
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
          view = (<SetupRoundRobinMatchMakerParams activeRound={activeTournament} onComplete={this.onMatchGenerationComplete.bind(this, activeTournament.id)}/>);
          break;
        case "elims":
          view = (<SetupElimsRunMatchMaker activeRound={activeTournament} onComplete={this.onMatchGenerationComplete.bind(this, activeTournament.id)}/>);
          break;
        case "ranking":
          view = (<span>NYI</span>);
          break;
      }
    }

    return (view);
  }

  private onMatchGenerationComplete(tournamentId: number, matches: Match[]) {
    this.props.addPlayoffsMatches(matches, tournamentId);
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    playoffsMatches: internalState.playoffsMatches
  };
}

export function mapStateToDispatch(dispatch: Dispatch<ApplicationActions>) {
  return {
    addPlayoffsMatches: (matches: Match[], tournamentId: number) => dispatch(addPlayoffsMatches(matches, tournamentId))
  };
}

export default connect(mapStateToProps, mapStateToDispatch)(TournamentMatchMakerParams);

