import * as React from "react";
import {Button, Card, Divider, Form, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../../../AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";
import {IDisableNavigation, IIncrementCompletedStep} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {disableNavigation, incrementCompletedStep} from "../../../stores/internal/actions";
import RestrictedAccessModal from "../../../components/RestrictedAccessModal";
import {connect} from "react-redux";
import DialogManager from "../../../managers/DialogManager";
import {CONFIG_STORE} from "../../../AppStore";
import {ISetBackupDir} from "../../../stores/config/types";
import {setBackupDir} from "../../../stores/config/actions";
import {
  AppError,
  EMSProvider,
  Event,
  FGCProvider,
  HttpError,
  Match,
  MatchParticipant,
  Team,
} from "@the-orange-alliance/lib-ems";
import InternalStateManager from "../../../managers/InternalStateManager";
import {AxiosResponse} from "axios";

interface IProps {
  backupDir?: string
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setCompletedStep?: (step: number) => IIncrementCompletedStep,
  setBackupDir?: (backupDir: string) => ISetBackupDir,
  teams?: Team[],
  qualMatches: Match[],
  playoffMatches: Match[],
  event: Event,
}

interface IState {
  modalOpen: boolean
}

class DataSyncConfig extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.purgeLocal = this.purgeLocal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.chooseBackupDir = this.chooseBackupDir.bind(this);
    this.forceBackup = this.forceBackup.bind(this);
    this.forceUpload = this.forceUpload.bind(this);
    this.purgeOnline = this.purgeOnline.bind(this);
  }

  public render() {
    const {backupDir} = this.props;
    const {modalOpen} = this.state;
    const canBackup: boolean = backupDir.length > 0;
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
                    <Grid.Column width={10}><Form.Input fluid={true} value={backupDir} label={<ExplanationIcon title={"Local Data Backup Path"} content={"EMS will periodically backup configuration and database files to this path."}/>}/></Grid.Column>
                    <Grid.Column width={6} className="align-bottom"><Form.Button fluid={true} color={getTheme().primary} onClick={this.chooseBackupDir}>Choose Directory</Form.Button></Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={16}>
                    <Grid.Column width={10}><Form.Button fluid={true} color="red" onClick={this.openModal}>Purge Local</Form.Button></Grid.Column>
                    <Grid.Column width={6}><Form.Button fluid={true} disabled={!canBackup} color="orange" onClick={this.forceBackup}>Force Backup</Form.Button></Grid.Column>
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
                  <Grid.Column><Button fluid={true} color="orange" onClick={this.forceUpload}>Force Sync</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal">
                  <Grid.Column><Button fluid={true} color="red" onClick={this.purgeOnline}>Purge Online</Button></Grid.Column>
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

  private purgeOnline() {
    const {eventKey} = this.props.event;
    const promises = [];

    // Teams
    promises.push(FGCProvider.deleteTeams(eventKey));

    // Rankings
    promises.push(FGCProvider.deleteRankings(eventKey));

    // Match Data
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.TEST_LEVEL, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.PRACTICE_LEVEL, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.QUALIFICATION_LEVEL, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.OCTOFINALS_LEVEL, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.QUARTERFINALS_LEVEL, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.SEMIFINALS_level, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.ROUND_ROBIN_LEVEL, undefined));
    promises.push(FGCProvider.deleteMatchData(eventKey, Match.FINAL_LEVEL, undefined));

    Promise.all(promises).then(() => {
      console.log('Successfully purged online data');
    }).catch(err => {
      console.error("Failed to purge online data: ", err);
    })
  }

  private forceUpload() {
    const {eventKey} = this.props.event;

    const promises: Promise<any>[] = [];
    const teamsPromise = EMSProvider.getTeams().then((teams) => {
      return Promise.all(teams.map(team => {
        return FGCProvider.postEventParticipants(eventKey, [team]).catch(() => {}); // If it fails to upload, it already exists and we don't care
      }));
    });
    promises.push(teamsPromise);

    // Post Rankings
    const ranksPromise = FGCProvider.deleteRankings(eventKey).then(() => {
      EMSProvider.getRankings().then((ranks) => {
        return FGCProvider.postRankingsByLevel(eventKey, ranks, Match.QUALIFICATION_LEVEL).catch((err) => {
          console.warn('Failed to upload rankings', err);
        });
      }).catch((err) => {
        console.warn('Failed to get rankings from EMS', err)
      });
    }).catch((err) => {
      console.warn('Failed to purge rankings online', err);
    });
    promises.push(ranksPromise);

    // Post Qual Matches
    const qualPromises = EMSProvider.getMatchesAndParticipants(eventKey).then((matches) => {
      return this.forceUploadMatches(eventKey, matches);
    });

    // Push those to our array
    promises.push(qualPromises);

    Promise.all(promises).then(() => {
      console.log('Successfully force-synced data');
    }).catch((error) => {
      console.error("Failed to force sync: ", error);
    });
  }

  // Brute-force match uploading. if we get an HTTP error we just PUT the data instead.
  private forceUploadMatches(eventKey: string, matches: Match[]): Promise<any>[] {
    // Even though the match has a "posted" attribute, we can't trust that because this is a "force" sync
    return matches.map(m => {

      // Map each match participant to its own API call
      const mpPromises = m.participants.map((participant) => {
        return FGCProvider.postMatchParticipants(eventKey, [participant]).catch(() => {
          return FGCProvider.putMatchParticipants(eventKey, [participant]);
        }).catch((reason: AxiosResponse) => {
          console.log("Failed to upload match participant " + participant.matchParticipantKey + ". \n     Response code: " + reason.status + "\n     PUT Response: " + reason.data);
        });
      });

      const matchParticipantPromise = Promise.all(mpPromises).catch((err) => {
        console.warn("Failed to upload match participants for match " + m.matchKey, err)
      });

      // Upload Match Participants
      return matchParticipantPromise.then(() => {
        // Upload Match Data
        return FGCProvider.postMatches(eventKey, [m]).catch(() => {
          return FGCProvider.putMatchResults(eventKey, m);
        }).catch((reason: AxiosResponse) => {
          console.warn("Failed to upload basic match data for " + m.matchKey + ". \n     Response code: " + reason.status + "\n     PUT Response: " + reason.data);
        })

      }).then(() => {
        // Upload Match Details
        return EMSProvider.getMatchDetails(m.matchKey).then((details: any) => {
          const md = details[0];
          return FGCProvider.postMatchDetails(eventKey, [md]).catch(() => {
            return FGCProvider.putMatchDetails(eventKey, md);
          }).catch((reason: AxiosResponse) => {
            console.warn("Failed to upload match details for match " + md.matchDetailKey + ". \n     Response code: " + reason.status + "\n     PUT Response: " + reason.data);
          });
        });

      })
    });
  }

  private chooseBackupDir() {
    DialogManager.showOpenDialog({title: "EMS Backup Directory", directories: true}).then((data: string[]) => {
      if (data.length > 0) {
        this.props.setBackupDir(data[0]);
        CONFIG_STORE.set("backupDir", data[0]).then(() => {
          console.log("Set backup directory. Now backing up.");
        }).catch((error: AppError) => {
          DialogManager.showErrorBox(error);
        });
      }
    }).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }

  private purgeLocal() { // TODO - Flush out the redux state as well.
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

  private forceBackup() {
    console.log("forcing backup");
    InternalStateManager.createBackup(this.props.backupDir).then(() => {
      console.log("Successfully created backup");
    }).catch((error: AppError) => {
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

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    backupDir: configState.backupDir,
    teams: internalState.teamList,
    qualMatches: internalState.qualificationMatches,
    playoffMatches: internalState.playoffsMatches,
    event: configState.event
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step)),
    setBackupDir: (backupDir: string) => dispatch(setBackupDir(backupDir))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSyncConfig);
