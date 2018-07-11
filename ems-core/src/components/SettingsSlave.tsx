import * as React from "react";
import {Button, Card, Dropdown, Grid, Input, Message} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import ExplanationIcon from "./ExplanationIcon";

class SettingsSlave extends React.Component {
  public render() {
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <Card.Content className="card-header"><h3><ExplanationIcon title={"Slave Configuration"} content={"Only enter this mode if you know what you're doing."}/></h3></Card.Content>
        <Card.Content>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button fluid={true} color={getTheme().secondary}>ENABLE SLAVE MODE</Button>
              </Grid.Column>
              <Grid.Column>
                <Button fluid={true} color={getTheme().primary}>DISABLE SLAVE MODE</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Message>
                  <Input fluid={true} label={<Button color={getTheme().secondary}>Verify IP Address</Button>} labelPosition="right" placeholder="Master EMS IPv4 Address (no port)"/>
                </Message>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column className="center-left-items">
                <span>Slave Field Control</span>
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  fluid={true}
                  selection={true}
                  multiple={true}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button fluid={true} color="red">ENTER SLAVE MODE</Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button fluid={true} color={getTheme().secondary}>Fetch Master Schedule(s)</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default SettingsSlave;