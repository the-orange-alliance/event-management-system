import * as React from "react";
import {Button, Card, Divider, Form, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";

class DataSyncConfig extends React.Component {
  public render() {
    return (
      <Tab.Pane className="tab-subview">
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
                    <Grid.Column width={10}><Form.Button fluid={true} color="red">Purge Local</Form.Button></Grid.Column>
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
}

export default DataSyncConfig;