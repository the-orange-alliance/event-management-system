import * as React from "react";
import {Button, Card, Divider, Form, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import {TournamentLevels} from "../shared/AppTypes";
import ExplanationIcon from "./ExplanationIcon";

interface IProps {
  type: TournamentLevels
}

class SetupScheduleParams extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Tab.Pane className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>{this.props.type} Schedule Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form widths="equal">
              <Form.Group>
                <Form.Input label="Number Of Teams"/>
                <Form.Input label="Matches Per Team"/>
                <Form.Input label="Cycle Time"/>
                <Form.Input label={<ExplanationIcon title={"Match Concurrency"} content={"Sets the number of matches that will be run at any given time. Leave this at 1 unless you have special clearence for your event."}/>}/>
                <Form.Input label="Total Matches"/>
              </Form.Group>
            </Form>
          </Card.Content>
        </Card>
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>{this.props.type} Schedule Outline</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid columns={16}>
                <Grid.Row>
                  <Grid.Column width={2} className="center-items"><span>Day 1:</span></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} label="Day Start Time"/></Grid.Column>
                  <Grid.Column width={2}><Form.Input fluid={true} label="Matches"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} label="Projected Day End"/></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={2} className="center-items"><span>Break #1</span></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} label="Break Name"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} label="Start (After Match #)"/></Grid.Column>
                  <Grid.Column width={2}><Form.Input fluid={true} label="Duration"/></Grid.Column>
                  <Grid.Column width={2}><Form.Input fluid={true} label="Projected Break Start"/></Grid.Column>
                  <Grid.Column width={2}><Form.Input fluid={true} label="Projected Break End"/></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().secondary} fluid={true}>Add Break</Button></Grid.Column>
                  <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().secondary} fluid={true}>Remove Break</Button></Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row>
                  <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().primary} fluid={true}>Add Day</Button></Grid.Column>
                  <Grid.Column width={2} largeScreen={2} tablet={4}><Button color={getTheme().primary} fluid={true}>Remove Day</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }
}

export default SetupScheduleParams;