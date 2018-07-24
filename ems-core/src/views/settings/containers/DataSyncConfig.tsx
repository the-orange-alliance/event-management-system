import * as React from "react";
import {Button, Card, Divider, Form, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";
import {IDisableNavigation, IIncrementCompletedStep} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {ApplicationActions} from "../../../stores";
import {disableNavigation, incrementCompletedStep} from "../../../stores/internal/actions";
import RestrictedAccessModal from "../../../components/RestrictedAccessModal";
import EMSProvider from "../../../shared/providers/EMSProvider";
import HttpError from "../../../shared/models/HttpError";
import {connect} from "react-redux";
import DialogManager from "../../../shared/managers/DialogManager";
import {CONFIG_STORE} from "../../../shared/AppStore";
import AppError from "../../../shared/models/AppError";

interface IProps {
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setCompletedStep?: (step: number) => IIncrementCompletedStep
}

interface IState {
  modalOpen: boolean
}

class DataSyncConfig extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalOpen: false
    };
    this.purgeLocal = this.purgeLocal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  public render() {
    const {modalOpen} = this.state;
    return (
      <Tab.Pane className="tab-subview">
        <RestrictedAccessModal open={modalOpen} onClose={this.closeModal} onSuccess={this.purgeLocal}/>
        <h3>Data Sync</h3>
        <Divider />
        <Card.Group itemsPerRow={3}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Local Data</h3></Card.Content>
            <Card.Content>
              <Form>
                <Grid>
                  <Grid.Row columns={16}>
                    <Grid.Column width={10}><Form.Input fluid={true} label={<ExplanationIcon title={"Local Data Backup Path"} content={"EMS will periodically backup configuration and database files to this path."}/>}/></Grid.Column>
                    <Grid.Column width={6} className="align-bottom"><Form.Button fluid={true} color={getTheme().primary}>Choose Directory</Form.Button></Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={16}>
                    <Grid.Column width={10}><Form.Button fluid={true} color="red" onClick={this.openModal}>Purge Local</Form.Button></Grid.Column>
                    <Grid.Column width={6}><Form.Button fluid={true} color="orange">Force Backup</Form.Button></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Online Data</h3></Card.Content>
            <Card.Content>
              <Grid>
                <Grid.Row columns="equal">
                  <Grid.Column><Button fluid={true} color="orange">Force Backup</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal">
                  <Grid.Column><Button fluid={true} color="red">Purge Online</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>TOA Configuration</h3></Card.Content>
            <Card.Content>
              <b>TBC (To Be Coded)</b>
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    )
  }

  private purgeLocal() {
    this.props.setNavigationDisabled(true);
    EMSProvider.deleteEvent().then(() => {
      this.props.setCompletedStep(0);
      CONFIG_STORE.setAll({}).then(() => {
        this.props.setNavigationDisabled(false);
      }).catch((err: AppError) => {
        this.props.setNavigationDisabled(false);
        DialogManager.showErrorBox(err);
      });
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  public openModal() {
    this.setState({modalOpen: true});
  }

  public closeModal() {
    this.setState({modalOpen: false});
  }
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step))
  };
}

export default connect(null, mapDispatchToProps)(DataSyncConfig);