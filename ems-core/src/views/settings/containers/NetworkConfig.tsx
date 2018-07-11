import * as React from "react";
import {Button, Card, Divider, Form, Grid, Tab} from "semantic-ui-react";
import Process from "../../../shared/models/Process";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import ProcessDescriptor from "../../../components/ProcessDescriptor";
import {getTheme} from "../../../shared/AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";
import ProcessActor from "../../../components/ProcessActor";

interface IProps {
  processList?: Process[]
}

class NetworkConfig extends React.Component<IProps> {

  public render() {
    const processes = this.props.processList.map(process => {
      return <ProcessDescriptor key={process.id} process={process}/>;
    });
    const processActions = this.props.processList.map(process => {
      return <ProcessActor key={process.id} process={process}/>;
    });
    return (
      <Tab.Pane className="tab-subview">
        <h3>Network Config</h3>
        <Divider />
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content><h3>Status</h3></Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row columns="equal" textAlign="center" className="bold">
                <Grid.Column>Name</Grid.Column>
                <Grid.Column>Address</Grid.Column>
                <Grid.Column>Status</Grid.Column>
                <Grid.Column>PID</Grid.Column>
                <Grid.Column>CPU Usage</Grid.Column>
                <Grid.Column>Memory Usage</Grid.Column>
              </Grid.Row>
              {processes}
            </Grid>
          </Card.Content>
        </Card>
        <Card.Group itemsPerRow={2}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Network Management</h3></Card.Content>
            <Card.Content>
              <Form>
                <Grid columns={16}>
                  <Grid.Row>
                    <Grid.Column width={10}><Form.Input fluid={true} placeholder="IPv4 Address (xxx.xxx.xxx.xxx)" label={<ExplanationIcon title={"New Host Address"} content={"If EMS incorrectly detects your IPv4 address, set it here then click 'Update Network'."}/>}/></Grid.Column>
                    <Grid.Column width={6} className="align-bottom"><Form.Button fluid={true} color="orange">Update Network Address</Form.Button></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={6} floated="right"><Button fluid={true} color="red">Reset Network Addresses</Button></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Process Management</h3></Card.Content>
            <Card.Content>
              {processActions}
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color="red">Stop All</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color="green">Start All</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color="orange">Restart All</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    )
  }
}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    processList: internalState.processList
  };
}

export default connect(mapStateToProps)(NetworkConfig);