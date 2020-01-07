import * as React from "react";
import {Button, Card, Checkbox, CheckboxProps, Dropdown, DropdownProps, Grid, Tab, TabProps} from "semantic-ui-react";
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
import {Event, EventConfiguration} from "@the-orange-alliance/lib-ems";
import NumericInput from "../../components/NumericInput";
import PracticeScheduleQueueing from "./reports/PracticeScheduleQueueing";
import QualificationScheduleQueueing from "./reports/QualificationScheduleQueueing";
import PracticeScheduleByTeamQueueing from "./reports/PracticeScheduleByTeamQueueing";
import QualificationScheduleByTeamQueueing from "./reports/QualificationScheduleByTeamQueueing";
import PlayoffsSchedule from "./reports/PlayoffsSchedule";
import PlayoffsScheduleQueueing from "./reports/PlayoffsScheduleQueueing";
import PlayoffsScheduleByTeam from "./reports/PlayoffsScheduleByTeam";
import PlayoffsScheduleByTeamQueueing from "./reports/PlayoffsScheduleByTeamQueueing";

interface IProps {
  event?: Event,
  eventConfig?: EventConfiguration,
  navigationDisabled?: boolean
}

interface IState {
  activeIndex: number,
  generatedReport: JSX.Element,
  hasGeneratedReport: boolean,
  htmlString: string,
  queueingTime: number,
  useUTC: boolean,
  reportFields: number[]
}

class ReportsView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      generatedReport: <span><i>There is currently no generated report.</i></span>,
      hasGeneratedReport: false,
      htmlString: "",
      queueingTime: 5,
      useUTC: false,
      reportFields: props.eventConfig.fieldsControlled
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.openReportInBrowser = this.openReportInBrowser.bind(this);
    this.printReport = this.printReport.bind(this);
    this.renderReports = this.renderReports.bind(this);
    this.renderGeneratedReport = this.renderGeneratedReport.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.generatePracticeSchedule = this.generatePracticeSchedule.bind(this);
    this.generatePracticeQueueingSchedule = this.generatePracticeQueueingSchedule.bind(this);
    this.generateQualificationSchedule = this.generateQualificationSchedule.bind(this);
    this.generateQualificationQueueingSchedule = this.generateQualificationQueueingSchedule.bind(this);
    this.generatePostQualSchedule = this.generatePostQualSchedule.bind(this);
    this.generatePostQualScheduleQueueing = this.generatePostQualScheduleQueueing.bind(this);
    this.generatePracticeScheduleByTeam = this.generatePracticeScheduleByTeam.bind(this);
    this.generatePracticeScheduleByTeamQueueing = this.generatePracticeScheduleByTeamQueueing.bind(this);
    this.generateQualificationScheduleByTeam = this.generateQualificationScheduleByTeam.bind(this);
    this.generateQualificationScheduleByTeamQueueing = this.generateQualificationScheduleByTeamQueueing.bind(this);
    this.generatePostQualScheduleByTeam = this.generatePostQualScheduleByTeam.bind(this);
    this.generatePostQualScheduleByTeamQueueing = this.generatePostQualScheduleByTeamQueueing.bind(this);
    this.generateQualificationRankings = this.generateQualificationRankings.bind(this);
    this.generateCompetingTeams = this.generateCompetingTeams.bind(this);
    this.generateQualificationMatchResults = this.generateQualificationMatchResults.bind(this);
    this.generateQualificationAnnouncers = this.generateQualificationAnnouncers.bind(this);
    this.generateEliminationsAnnouncers = this.generateEliminationsAnnouncers.bind(this);

    this.updateQueueingTime = this.updateQueueingTime.bind(this);
    this.updateUsingUTC = this.updateUsingUTC.bind(this);
    this.setReportFields = this.setReportFields.bind(this);
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
    const {event, eventConfig} = this.props;
    const {queueingTime, useUTC, reportFields} = this.state;

    const fields = event.fieldCount || 0;
    const fieldOptions = [];
    for (let i = 0; i < fields; i++) {
      fieldOptions.push({text: "Field " + (i + 1), value: i + 1});
    }

    return (
      <Tab.Pane className="tab-subview">
        <Card.Group itemsPerRow={3}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header"><Card.Header><h4>Practice Matches</h4></Card.Header></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePracticeSchedule}>Schedule Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePracticeQueueingSchedule}>Schedule Report (w/ Queueing)</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePracticeScheduleByTeam}>Schedule By Team Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePracticeScheduleByTeamQueueing}>Schedule By Team Report (w/ Queueing)</Button></Grid.Column>
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
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationQueueingSchedule}>Schedule Report (w/ Queueing)</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationScheduleByTeam}>Schedule By Team Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationScheduleByTeamQueueing}>Schedule By Team Report (w/ Queueing)</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationMatchResults}>Match Results Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationAnnouncers}>Announcers Report</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateQualificationRankings}>Rankings Report</Button></Grid.Column>
                  <Grid.Column/>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign="center" className="card-header">
              <Card.Header><h4>Playoffs Matches</h4></Card.Header>
            </Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePostQualSchedule}>Schedule Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePostQualScheduleQueueing}>Schedule Report (w/ Queueing))</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePostQualScheduleByTeam}>Schedule By Team Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generatePostQualScheduleByTeamQueueing}>Schedule By Team Report (w/ Queueing)</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button disabled={true} fluid={true} color={getTheme().primary}>Match Results Report</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.generateEliminationsAnnouncers}>Announcers Report</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
        <Card.Group itemsPerRow={3}>
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
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content textAlign={'center'} className={'card-header'}><h4>Report Options</h4></Card.Content>
            <Card.Content>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <NumericInput label={`Queueing Time`} value={queueingTime} error={false}  onUpdate={this.updateQueueingTime}/>
                  </Grid.Column>
                  <Grid.Column>
                    <Checkbox fluid={true} label={'Use UTC Time'} checked={useUTC} onChange={this.updateUsingUTC}/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={4}>
                  <Grid.Column width={3} className="center-left-items">
                    <span>Report Fields</span>
                  </Grid.Column>
                  <Grid.Column width={13}>
                    <Dropdown
                      fluid={true}
                      selection={true}
                      multiple={true}
                      value={reportFields}
                      options={fieldOptions}
                      onChange={this.setReportFields}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    );
  }

  private setReportFields(event: SyntheticEvent, props: DropdownProps) {
    if ((props.value as number[]).length > 0) {
      this.setState({reportFields: (props.value as number[]).sort()});
      this.forceUpdate();
    }
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
    const {reportFields} = this.state;
    this.generateReport(<PracticeSchedule fields={reportFields} onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePracticeQueueingSchedule() {
    const {queueingTime, useUTC, reportFields} = this.state;
    this.generateReport(<PracticeScheduleQueueing fields={reportFields} queueingTime={queueingTime} useUTCTime={useUTC} onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationSchedule() {
    const {reportFields} = this.state;
    this.generateReport(<QualificationSchedule fields={reportFields} onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationQueueingSchedule() {
    const {queueingTime, useUTC, reportFields} = this.state;
    this.generateReport(<QualificationScheduleQueueing fields={reportFields} queueingTime={queueingTime} useUTCTime={useUTC} onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationAnnouncers() {
    const {reportFields} = this.state;
    this.generateReport(<QualificationAnnouncers fields={reportFields} onHTMLUpdate={this.updateHTML}/>)
  }

  private generatePostQualSchedule() {
    const {reportFields} = this.state;
    this.generateReport(<PlayoffsSchedule fields={reportFields} onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePostQualScheduleQueueing() {
    const {queueingTime, useUTC, reportFields} = this.state;
    this.generateReport(<PlayoffsScheduleQueueing fields={reportFields} queueingTime={queueingTime} useUTCTime={useUTC} onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePracticeScheduleByTeam() {
    const {reportFields} = this.state;
    this.generateReport(<PracticeScheduleByTeam fields={reportFields} onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePracticeScheduleByTeamQueueing() {
    const {queueingTime, useUTC, reportFields} = this.state;
    this.generateReport(<PracticeScheduleByTeamQueueing fields={reportFields} queueingTime={queueingTime} useUTCTime={useUTC} onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationScheduleByTeam() {
    const {reportFields} = this.state;
    this.generateReport(<QualificationScheduleByTeam fields={reportFields} onHTMLUpdate={this.updateHTML}/>);
  }

  private generateQualificationScheduleByTeamQueueing() {
    const {queueingTime, useUTC, reportFields} = this.state;
    this.generateReport(<QualificationScheduleByTeamQueueing fields={reportFields} queueingTime={queueingTime} useUTCTime={useUTC} onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePostQualScheduleByTeam() {
    const {reportFields} = this.state;
    this.generateReport(<PlayoffsScheduleByTeam fields={reportFields} onHTMLUpdate={this.updateHTML}/>);
  }

  private generatePostQualScheduleByTeamQueueing() {
    const {queueingTime, useUTC, reportFields} = this.state;
    this.generateReport(<PlayoffsScheduleByTeamQueueing fields={reportFields} queueingTime={queueingTime} useUTCTime={useUTC} onHTMLUpdate={this.updateHTML}/>);
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

  private updateQueueingTime(value: number) {
    this.setState({queueingTime: value});
  }

  private updateUsingUTC(event: SyntheticEvent, props: CheckboxProps) {
    this.setState({useUTC: props.checked});
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    event: configState.event,
    eventConfig: configState.eventConfiguration,
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(ReportsView);