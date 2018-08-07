import * as React from "react";
import {connect} from "react-redux";
import {ToastContainer} from "react-toastify";
import {Container, Divider, Header, Menu, MenuItemProps} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import {IApplicationState} from "../stores";
import EventManagerView from "../views/event-manager/EventManagerView";
import SettingsView from "../views/settings/SettingsView";
import MatchPlayView from "../views/match-play/MatchPlayView";
import MatchTestView from "../views/match-test/MatchTestView";
import AboutView from "../views/about/AboutView";
import ReportsView from "../views/reports/ReportsView";

interface IProps {
  slaveMode?: boolean,
  navigationDisabled?: boolean,
  completedStep?: number
}

interface IState {
  activeItem?: string
}

class AppContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeItem: "Event Manager"
    };
  }

  public render() {
    const {activeItem} = this.state;
    const limitedMode = this.props.completedStep < 3;
    return (
      <div>
        <Menu inverted={true} widths={7} color={getTheme().primary}>
          <Menu.Item name={"Event Manager"} active={activeItem === "Event Manager"} disabled={this.props.slaveMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Match Play"} active={activeItem === "Match Play"} disabled={limitedMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Match Test"} active={activeItem === "Match Test"} disabled={this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Match Review"} active={activeItem === "Match Review"} disabled={limitedMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Reports"} active={activeItem === "Reports"} disabled={limitedMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Settings"} active={activeItem === "Settings"} disabled={this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"About"} active={activeItem === "About"} disabled={this.props.navigationDisabled} onClick={this.changeActiveView}/>
        </Menu>
        <Container className="view-container">
          <Header as='h1'>{activeItem}</Header>
          <Divider section={true}/>
          {this.getViewFromActiveItem(activeItem)}
          <ToastContainer
            position="bottom-right"
            pauseOnHover={true}
            pauseOnVisibilityChange={true}
            newestOnTop={false}
            closeOnClick={true}
          />
        </Container>
      </div>
    );
  }

  private getViewFromActiveItem(activeItem: string) {
    switch (activeItem) {
      case "Event Manager":
        return <EventManagerView/>;
      case "Settings":
        return <SettingsView/>;
      case "Match Play":
        return <MatchPlayView/>;
      case "Match Test":
        return <MatchTestView/>;
      case "Reports":
        return <ReportsView/>;
      case "About":
        return <AboutView/>;
      default:
        return <span>View Not Found.</span>;
    }
  }

  private changeActiveView = (event: React.SyntheticEvent, data: MenuItemProps) => {
    this.setState({activeItem: data.name});
  };
}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled,
    completedStep: internalState.completedStep
  };
}

// export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
//   return {
//     changeActiveView: (view: string) => dispatch(changeActiveView(view))
//   };
// }

export default connect(mapStateToProps)(AppContainer);