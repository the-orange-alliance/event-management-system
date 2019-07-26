import * as React from "react";
import {Button, Card, Grid, Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import {getTheme} from "../../AppTheme";
import PracticeSchedule from "./reports/PracticeSchedule";
import QualificationSchedule from "./reports/QualificationSchedule";
// import EliminationsSchedule from "./reports/EliminationsSchedule";
// import FinalsSchedule from "./reports/FinalsSchedule";
import PracticeScheduleByTeam from "./reports/PracticeScheduleByTeam";
import QualificationScheduleByTeam from "./reports/QualificationScheduleByTeam";
// import EliminationsScheduleByTeam from "./reports/EliminationsScheduleByTeam";
// import FinalsScheduleByTeam from "./reports/FinalsScheduleByTeam";
import QualificationRankings from "./reports/QualificationRankings";
import DialogManager from "../../managers/DialogManager";
import OtherCompetingTeams from "./reports/OtherCompetingTeams";
import QualificationMatchResults from "./reports/QualificationMatchResults";
import QualificationAnnouncers from "./reports/QualificationAnnouncers";
// import EliminationsAnnouncers from "./reports/EliminationsAnnouncers";
import {EventConfiguration} from "@the-orange-alliance/lib-ems";

interface IProps {
  eventConfig?: EventConfiguration,
  navigationDisabled?: boolean
}

interface IState {
  activeIndex: number,
  generatedReport: JSX.Element,
  hasGeneratedReport: boolean,
  htmlString: string
}

class ReportsView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      generatedReport: <span><i>There is currently no generated report.</i></span>,
      hasGeneratedReport: false,
      htmlString: ""
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.openReportInBrowser = this.openReportInBrowser.bind(this);
    this.printReport = this.printReport.bind(this);
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
    this.generateCompetingTeams = this.generateCompetingTeams.bind(this);
    this.generateQualificationMatchResults = this.generateQualificationMatchResults.bind(this);
    this.generateQualificationAnnouncers = this.generateQualificationAnnouncers.bind(this);
    this.generateEliminationsAnnouncers = this.generateEliminationsAnnouncers.bind(this);
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
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationMatchResults}>Match Results Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationAnnouncers}>Announcers Report</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header">
              <Card.Header>
                {
                  eventConfig.tournamentConfig === "elims" &&
                  <h4>Eliminations Matches</h4>
                }
                {
                  eventConfig.tournamentConfig === "ranking" &&
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
                    eventConfig.tournamentConfig === "elims" &&
                    <Grid.Column><Button fluid={true} color={getTheme().primary}>Bracket Report</Button></Grid.Column>
                  }
                  {
                    eventConfig.tournamentConfig === "ranking" &&
                    <Grid.Column><Button fluid={true} color={getTheme().primary}>Rankings Report</Button></Grid.Column>
                  }
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button disabled={true} fluid={true} color={getTheme().primary}>Match Results Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateEliminationsAnnouncers}>Announcers Report</Button></Grid.Column>
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
                  <Grid.Column><Button disabled={true} fluid={true} color={getTheme().primary}>Qualification Cards Report</Button></Grid.Column>
                  {
                    eventConfig.tournamentConfig === "elims" &&
                    <Grid.Column><Button disabled={true} fluid={true} color={getTheme().primary}>Eliminations Cards Report</Button></Grid.Column>
                  }
                  {
                    eventConfig.tournamentConfig === "ranking" &&
                    <Grid.Column><Button disabled={true} fluid={true} color={getTheme().primary}>Finals Cards Report</Button></Grid.Column>
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
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateCompetingTeams}>Competing Team List Report</Button></Grid.Column>
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

    if (typeof generatedReport === "undefined") {
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
          <Button disabled={!hasGeneratedReport} color={getTheme().primary} onClick={this.printReport}>Print</Button>
          <Button disabled={!hasGeneratedReport} color={getTheme().primary} onClick={this.openReportInBrowser}>Open in Browser</Button>
        </div>
      </Tab.Pane>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }

  private openReportInBrowser() {
    DialogManager.viewReport();
  }

  private printReport() {
    DialogManager.printReport();
  }

  private generateReport(reportComponent: JSX.Element) {
    this.setState({activeIndex: 1, generatedReport: reportComponent});
  }

  private generateReportHTML(htmlStr: string): string {
    const templateHTML = "<html lang=\"en\"><head><meta charSet=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\" /><link rel=\"stylesheet\" href=\"./semantic.min.css\" /><title>Generated Report</title><style>%STYLE%</style></head><body>%BODY%</body></html>";
    return templateHTML.replace("%STYLE%", ".blue-bg {background-color: #0069ff !important;}.red-bg {background-color: #ff2733 !important;}@media print {.new-page { page-break-after: always; }}").replace("%BODY%", htmlStr);
  }

  private updateHTML(htmlStr: string) {
    const generatedHTML = this.generateReportHTML(htmlStr);
    this.setState({
      htmlString: generatedHTML,
      hasGeneratedReport: true
    });
    DialogManager.generateReport(generatedHTML);
  }

  private generatePracticeSchedule() {
    this.generateReport(<PracticeSchedule onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationSchedule() {
    this.generateReport(<QualificationSchedule onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationAnnouncers() {
    this.generateReport(<QualificationAnnouncers onHTMLUpdate={this.updateHTML}/>)
  }

  private generatePostQualSchedule() {
    // if (this.props.eventConfig.tournamentConfig === "elims") {
    //   this.generateReport(<EliminationsSchedule onHTMLUpdate={this.updateHTML}/>);
    // } else {
    //   this.generateReport(<FinalsSchedule onHTMLUpdate={this.updateHTML}/>);
    // }
    this.generateReport(<span>Will be implemented again soon.</span>);
  }

  private generatePracticeScheduleByTeam() {
    this.generateReport(<PracticeScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationScheduleByTeam() {
    this.generateReport(<QualificationScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePostQualScheduleByTeam() {
    // if (this.props.eventConfig.tournamentConfig === "elims") {
    //   this.generateReport(<EliminationsScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
    // } else {
    //   this.generateReport(<FinalsScheduleByTeam onHTMLUpdate={this.updateHTML}/>);
    // }
    this.generateReport(<span>Will be implemented again soon.</span>);
  }
  private generateQualificationRankings() {
    this.generateReport(<QualificationRankings onHTMLUpdate={this.updateHTML}/>);
  }

  private generateCompetingTeams() {
    this.generateReport(<OtherCompetingTeams onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationMatchResults() {
    this.generateReport(<QualificationMatchResults onHTMLUpdate={this.updateHTML}/>);
  }

  private generateEliminationsAnnouncers() {
    // this.generateReport(<EliminationsAnnouncers onHTMLUpdate={this.updateHTML}/>);
    this.generateReport(<span>Will be implemented again soon.</span>);
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(ReportsView);