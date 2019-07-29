import * as React from "react";
import {IDisableNavigation} from "../../../stores/internal/types";
import {AppError, Event, EventConfiguration} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {disableNavigation} from "../../../stores/internal/actions";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Card, Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import TournamentRound from "@the-orange-alliance/lib-ems/dist/models/ems/TournamentRound";
import TournamentRoundCard from "../../../components/TournamentRoundCard";
import {CONFIG_STORE} from "../../../AppStore";
import DialogManager from "../../../managers/DialogManager";

interface IProps {
  onComplete: () => void,
  eventConfig?: EventConfiguration,
  event?: Event,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
}

interface IState {
  activeIndex: number
}

class EventAdvancementView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      activeIndex: 0
    };

    this.renderTournamentOverview  = this.renderTournamentOverview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  public render() {
    const {activeIndex} = this.state;

    return (
      <div className={"step-view no-overflow"}>
        <Tab menu={{secondary: true}} activeIndex={activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Tournament Overview", render: this.renderTournamentOverview },
          { menuItem: "Participants", render: this.renderTournamentOverview },
          { menuItem: "Schedule Parameters", render: this.renderTournamentOverview },
          { menuItem: "Schedule Overview", render: this.renderTournamentOverview },
          { menuItem: "Match Maker Parameters", render: this.renderTournamentOverview },
          { menuItem: "Match Schedule Overview", render: this.renderTournamentOverview }
        ]}/>
      </div>
    );
  }

  private renderTournamentOverview() {
    const {eventConfig} = this.props;

    let roundsView: any[] = [];

    if (Array.isArray(eventConfig.tournament)) {
      roundsView = eventConfig.tournament.map((r: TournamentRound) => {
        return (
          <TournamentRoundCard key={r.id} round={r} onActivate={this.onRoundActivate.bind(this, r.id)}/>
        );
      });
    } else {
      const r = eventConfig.tournament;
      roundsView.push(
        <TournamentRoundCard key={r.id} round={r} onActivate={this.onRoundActivate.bind(this, r.id)}/>
      );
    }

    return (
      <Tab.Pane className="step-view-tab">
        <i>Below are your current tournament configurations. Click the 'Activate' button to the right to make that tournament round active, and proceed to the schedule as normal.</i>
        <Card.Group itemsPerRow={3}>
          {roundsView}
        </Card.Group>
      </Tab.Pane>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }

  private onRoundActivate(id: number) {
    const {eventConfig, setNavigationDisabled} = this.props;
    setNavigationDisabled(true);
    eventConfig.activeTournamentID = id;
    CONFIG_STORE.set("eventConfig", eventConfig.toJSON()).then((data: any) => {
      setNavigationDisabled(false);
    }).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }

}

function mapStateToProps({configState}: IApplicationState) {
  return {
    event: configState.event,
    eventConfig: configState.eventConfiguration
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventAdvancementView);