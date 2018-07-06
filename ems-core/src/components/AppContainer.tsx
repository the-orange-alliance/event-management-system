import * as React from "react";
import {connect} from "react-redux";
import {ToastContainer} from "react-toastify";
import {Dispatch} from "redux";
import {Container, Divider, Header, Menu, MenuItemProps} from "semantic-ui-react";
import {IApplicationState} from "../stores";
import {updateActiveView} from "../stores/config/actions";
import {ConfigActions, IUpdateActiveViewAction} from "../stores/config/types";

interface IProps {
  limitedMode: boolean,
  slaveMode: boolean,
  navigationDisabled: boolean,
  activeItem?: string,
  changeActiveView?: (view: string) => IUpdateActiveViewAction
}

class AppContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Menu inverted={true} widths={6}>
          <Menu.Item name={"Event Manager"} active={this.props.activeItem === "Event Manager"} disabled={this.props.slaveMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Match Play"} active={this.props.activeItem === "Match Play"} disabled={this.props.limitedMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Match Test"} active={this.props.activeItem === "Match Test"} disabled={this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Match Review"} active={this.props.activeItem === "Match Review"} disabled={this.props.limitedMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Reports"} active={this.props.activeItem === "Reports"} disabled={this.props.limitedMode || this.props.navigationDisabled} onClick={this.changeActiveView}/>
          <Menu.Item name={"Settings"} active={this.props.activeItem === "Settings"} disabled={this.props.navigationDisabled} onClick={this.changeActiveView}/>
        </Menu>
        <Container className="view-container">
          <Header as='h1'>Active Item</Header>
          <Divider section={true}/>
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

  private changeActiveView = (event: React.SyntheticEvent, data: MenuItemProps) => {
    this.props.changeActiveView(data.name);
  };
}

export function mapStateToProps( {configState}: IApplicationState ) {
  return {
    activeItem: configState.activeView
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ConfigActions>) {
  return {
    changeActiveView: (view: string) => dispatch(updateActiveView(view))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);