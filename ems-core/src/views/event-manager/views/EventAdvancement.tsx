import * as React from "react";
import {IDisableNavigation} from "../../../stores/internal/types";
import {Event, EventConfiguration} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {disableNavigation} from "../../../stores/internal/actions";
import {Dispatch} from "redux";
import {connect} from "react-redux";

interface IProps {
  onComplete: () => void,
  eventConfig?: EventConfiguration,
  event?: Event,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
}

class EventAdvancementView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <span>Stuff</span>
    );
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