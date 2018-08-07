import * as React from "react";
import {Button, Card, Grid, Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import {getTheme} from "../../shared/AppTheme";
import EventConfiguration from "../../shared/models/EventConfiguration";
import PracticeSchedule from "./reports/PracticeSchedule";
import QualificationSchedule from "./reports/QualificationSchedule";
import EliminationsSchedule from "./reports/EliminationsSchedule";
import FinalsSchedule from "./reports/FinalsSchedule";
import PracticeScheduleByTeam from "./reports/PracticeScheduleByTeam";
import QualificationScheduleByTeam from "./reports/QualificationScheduleByTeam";
import EliminationsScheduleByTeam from "./reports/EliminationsScheduleByTeam";
import FinalsScheduleByTeam from "./reports/FinalsScheduleByTeam";
import QualificationRankings from "./reports/QualificationRankings";

interface IProps {
  eventConfig?: EventConfiguration,
  navigationDisabled?: boolean
}

interface IState {
  activeIndex: number,
  generatedReport: JSX.Element,
  hasGeneratedReport: boolean
}

class ReportsView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      generatedReport: <span><i>There is currently no generated report.</i></span>,
      hasGeneratedReport: false
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.renderReports = this.renderReports.bind(this);
    this.renderGeneratedReport = this.renderGeneratedReport.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.generatePracticeSchedule = this.generatePracticeSchedule.bind(this);
    this.generateQualificationSchedule = this.generateQualificationSchedule.bind(this);
    this.generatePostQualSchedule = this.generatePostQualSchedule.bind(this);
    this.generatePracticeScheduleByTeam = this.generatePracticeScheduleByTeam.bind(this);
    this.generateQualificationScheduleByTeam = this.generateQualificationScheduleByTeam.bind(this);
    this.generatePostQualScheduleByTeam = this.generatePostQualScheduleByTeam.bind(this);
    this.generateQualificationRankings = this.generateQualificationRankings.bind(this);
  }

  public render() {
    return (
      <div className="view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Reports", render: this.renderReports},
          { menuItem: "Generated Report", render: this.renderGeneratedReport},
        ]}/>
      </div>
    );
  }

  private renderReports() {
    const {eventConfig} = this.props;
    return (
      <Tab.Pane className="tab-subview">
        <Card.Group itemsPerRow={3}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header"><Card.Header><h4>Practice Matches</h4></Card.Header></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePracticeSchedule}>Schedule Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} disabled={true} color={getTheme().primary}>Cycle Time Report</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePracticeScheduleByTeam}>Schedule By Team Report</Button></Grid.Column>
                  <Grid.Column/>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header"><Card.Header><h4>Qualification Matches</h4></Card.Header></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationSchedule}>Schedule Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} disabled={true} color={getTheme().primary}>Cycle Time Report</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationScheduleByTeam}>Schedule By Team Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationRankings}>Rankings Report</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary}>Match Results Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary}>Announcers Report</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header">
              <Card.Header>
                {
                  eventConfig.postQualConfig === "elims" &&
                  <h4>Eliminations Matches</h4>
                }
                {
                  eventConfig.postQualConfig === "finals" &&
                  <h4>Finals Matches</h4>
                }
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePostQualSchedule}>Schedule Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} disabled={true} color={getTheme().primary}>Cycle Time Report</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePostQualScheduleByTeam}>Schedule By Team Report</Button></Grid.Column>
                  {
                    eventConfig.postQualConfig === "elims" &&
                    <Grid.Column><Button fluid={true} color={getTheme().primary}>Bracket Report</Button></Grid.Column>
                  }
                  {
                    eventConfig.postQualConfig === "finals" &&
                    <Grid.Column><Button fluid={true} color={getTheme().primary}>Rankings Report</Button></Grid.Column>
                  }
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary}>Match Results Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary}>Announcers Report</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
        <Card.Group itemsPerRow={2}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header"><Card.Header><h4>Head Referee Reports</h4></Card.Header></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary}>Qualification Cards Report</Button></Grid.Column>
                  {
                    eventConfig.postQualConfig === "elims" &&
                    <Grid.Column><Button fluid={true} color={getTheme().primary}>Eliminations Cards Report</Button></Grid.Column>
                  }
                  {
                    eventConfig.postQualConfig === "finals" &&
                    <Grid.Column><Button fluid={true} color={getTheme().primary}>Finals Cards Report</Button></Grid.Column>
                  }
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header"><Card.Header><h4>Other Reports</h4></Card.Header></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary}>Competing Team List Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} disabled={true} color={getTheme().primary}>Awards Report</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    );
  }

  private renderGeneratedReport() {
    const {generatedReport, hasGeneratedReport} = this.state;

    let component;

    if (typeof generatedReport === "undefined" || !hasGeneratedReport) {
      component = (
        <span>There is currently no generated report.</span>
      );
    } else {
      component = generatedReport;
    }

    return (
      <Tab.Pane className="tab-subview">
        {component}
        <div>
          <Button disabled={!hasGeneratedReport} color={getTheme().primary}>Print</Button>
          <Button disabled={!hasGeneratedReport} color={getTheme().primary}>Open in Browser</Button>
        </div>
      </Tab.Pane>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }

  private generateReport(reportComponent: JSX.Element) {
    this.setState({activeIndex: 1, generatedReport: reportComponent, hasGeneratedReport: true});
  }

  private updateHTML(htmlStr: string) {
    console.log(htmlStr);
  }

  private generatePracticeSchedule() {
    this.generateReport(<PracticeSchedule onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationSchedule() {
    this.generateReport(<QualificationSchedule onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePostQualSchedule() {
    if (this.props.eventConfig.postQualConfig === "elims") {
      this.generateReport(<EliminationsSchedule onHTMLUpdate={this.updateHTML}/>);
    } else {
      this.generateReport(<FinalsSchedule onHTMLUpdate={this.updateHTML}/>);
    }
  }

  private generatePracticeScheduleByTeam() {
    this.generateReport(<PracticeScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationScheduleByTeam() {
    this.generateReport(<QualificationScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePostQualScheduleByTeam() {
    if (this.props.eventConfig.postQualConfig === "elims") {
      this.generateReport(<EliminationsScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
    } else {
      this.generateReport(<FinalsScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
    }
  }
  private generateQualificationRankings() {
    this.generateReport(<QualificationRankings onHTMLUpdate={this.updateHTML}/>);
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(ReportsView);