import * as React from "react";
import {connect} from "react-redux";
import {Step} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../stores";
import EventSelection from "./containers/EventSelection";
import EventConfiguration from "../../shared/models/EventConfiguration";
import EventParticipantSelection from "./containers/EventParticipantSelection";
import {Dispatch} from "redux";
import {incrementCompletedStep} from "../../stores/internal/actions";
import {IIncrementCompletedStep} from "../../stores/internal/types";

interface IProps {
  completedStep?: number,
  eventConfig?: EventConfiguration,
  setCompletedStep?: (step: number) => IIncrementCompletedStep
}

interface IState {
  activeStep?: number
}

class EventManagerView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeStep: 1
    }
  }

  public render() {
    const {activeStep} = this.state;

    return (
      <div className="view">
        {this.getViewFromActiveStep(activeStep)}
        <Step.Group ordered={true} size="tiny" unstackable={true} fluid={true} widths={this.getStepLength()}>
          <Step completed={this.isCompleted(1)} disabled={this.isDisabled(1)} active={this.isActiveStep(1)} onClick={this.setActiveStep.bind(this, 1)}>
            <Step.Content>
              <Step.Description>Event Setup</Step.Description>
            </Step.Content>
          </Step>

          <Step completed={this.isCompleted(2)} disabled={this.isDisabled(2)} active={this.isActiveStep(2)} onClick={this.setActiveStep.bind(this, 2)}>
            <Step.Content>
              <Step.Description>Participant Selection</Step.Description>
            </Step.Content>
          </Step>

          <Step completed={this.isCompleted(3)} disabled={this.isDisabled(3)} active={this.isActiveStep(3)} onClick={this.setActiveStep.bind(this, 3)}>
            <Step.Content>
              <Step.Description>Practice Setup</Step.Description>
            </Step.Content>
          </Step>

          <Step completed={this.isCompleted(4)} disabled={this.isDisabled(4)} active={this.isActiveStep(4)} onClick={this.setActiveStep.bind(this, 4)}>
            <Step.Content>
              <Step.Description>Qualification Setup</Step.Description>
            </Step.Content>
          </Step>

          {
            this.props.eventConfig.postQualConfig === "elims" &&
            <Step completed={this.isCompleted(5)} disabled={this.isDisabled(5)} active={this.isActiveStep(5)} onClick={this.setActiveStep.bind(this, 5)}>
              <Step.Content>
                <Step.Description>Alliance Selections</Step.Description>
              </Step.Content>
            </Step>
          }

          <Step completed={this.isCompleted(6)} disabled={this.isDisabled(6)} active={this.isActiveStep(6)} onClick={this.setActiveStep.bind(this, 6)}>
            <Step.Content>
              <Step.Description>{this.props.eventConfig.postQualConfig === "elims" ? "Eliminations" : "Finals"} Setup</Step.Description>
            </Step.Content>
          </Step>

          <Step completed={this.isCompleted(7)} disabled={this.isDisabled(7)} active={this.isActiveStep(7)} onClick={this.setActiveStep.bind(this, 7)}>
            <Step.Content>
              <Step.Description>Awards</Step.Description>
            </Step.Content>
          </Step>

          <Step completed={this.isCompleted(8)} disabled={this.isDisabled(8)} active={this.isActiveStep(8)} onClick={this.setActiveStep.bind(this, 8)}>
            <Step.Content>
              <Step.Description>Data Upload</Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
      </div>
    );
  }

  public setActiveStep(step: number): void {
    if (step > this.getStepLength() || step < 1) {
      step = 1;
    }
    this.setState({
      activeStep: step
    });
  }

  private isActiveStep(step: number): boolean {
    return this.state.activeStep === step;
  }

  private isCompleted(step: number): boolean {
    return this.props.completedStep > step;
  }

  private isDisabled(step: number): boolean {
    return this.props.completedStep < (step - 1);
  }

  private getStepLength(): 7 | 8 {
    return this.props.eventConfig.postQualConfig === "elims" ? 8 : 7;
  }

  private getViewFromActiveStep(activeStep: number): JSX.Element {
    switch (activeStep) {
      case 1:
        return <EventSelection onComplete={this.completeStep.bind(this, 1)} />;
      case 2:
        return <EventParticipantSelection/>;
      default:
        return <span>View not found.</span>;
    }
  }

  private completeStep(step: number): void {
    this.props.setCompletedStep(step);
    this.setActiveStep(step + 1);
  }

}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    completedStep: internalState.completedStep,
    eventConfig: configState.eventConfiguration
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventManagerView);