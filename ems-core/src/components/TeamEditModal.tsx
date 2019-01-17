import * as React from "react";
import {Button, Form, Grid, Icon, InputProps, Modal} from "semantic-ui-react";
import ExplanationIcon from "./ExplanationIcon";
import {SyntheticEvent} from "react";
import TeamValidator from "../views/event-manager/controllers/TeamValidator";
import {Team} from "@the-orange-alliance/lib-ems";

interface IProps {
  open: boolean,
  onClose: () => void
  onUpdate: (updatedTeam: Team) => void,
  team: Team
}

interface IState {
  editableTeam: Team,
  teamValidator: TeamValidator
}

class TeamEditModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      editableTeam: null,
      teamValidator: new TeamValidator(new Team())
    };
    this.updateTeamKey = this.updateTeamKey.bind(this);
    this.updateTeamNameShort = this.updateTeamNameShort.bind(this);
    this.updateTeamNameLong = this.updateTeamNameLong.bind(this);
    this.updateTeamCountryCode = this.updateTeamCountryCode.bind(this);
    this.updateTeamCity = this.updateTeamCity.bind(this);
    this.updateTeamStateProv = this.updateTeamStateProv.bind(this);
    this.updateTeamCountry = this.updateTeamCountry.bind(this);
    this.updateTeamRobotName = this.updateTeamRobotName.bind(this);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.team !== this.props.team && this.props.team !== null) {
      let newTeam: Team = new Team();
      newTeam = newTeam.fromJSON(this.props.team.toJSON());
      this.state.teamValidator.update(newTeam);
      this.setState({editableTeam: newTeam});
      this.forceUpdate();
    }
  }

  public render() {
    const {editableTeam, teamValidator} = this.state;
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        closeOnDimmerClick={true}
        size='small'
      >
        <Modal.Header>Team Edit Dialog</Modal.Header>
        <Modal.Content>
          {
            this.props.team !== null && editableTeam !== null &&
            <Form>
              <Grid>
                <Grid.Row columns={16}>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.teamKey} onChange={this.updateTeamKey} error={!teamValidator.isValidTeamKey()} label="Team ID"/></Grid.Column>
                  <Grid.Column width={12}><Form.Input fluid={true} value={editableTeam.teamNameShort} onChange={this.updateTeamNameShort} error={!teamValidator.isValidTeamNameShort()} label="Team Name (Short)"/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16}>
                  <Grid.Column width={12}><Form.Input fluid={true} value={editableTeam.teamNameLong} onChange={this.updateTeamNameLong} error={!teamValidator.isValidTeamNameLong()} label="Team Name (Long)"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.countryCode} onChange={this.updateTeamCountryCode} error={!teamValidator.isValidCountryCode()} label={<ExplanationIcon title={"Country Code"} content={"This field is optional. A team's country code should be their ISO ALPHA-2 letter code."}/>}/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16}>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.city} onChange={this.updateTeamCity} error={!teamValidator.isValidCity()} label="City"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.stateProv} onChange={this.updateTeamStateProv} error={!teamValidator.isValidStateProv()} label="State/Province"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.country} onChange={this.updateTeamCountry} error={!teamValidator.isValidCountry()} label="Country"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.robotName} onChange={this.updateTeamRobotName} error={!teamValidator.isValidRobotName()} label="Robot Name"/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' disabled={!teamValidator.isValid} onClick={this.props.onUpdate.bind(this, this.state.editableTeam)}>
            <Icon name='checkmark' /> Update Team
          </Button>
          <Button color='red' onClick={this.props.onClose}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private updateTeamKey(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.state.editableTeam.teamKey = parseInt(props.value, 10);
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamNameShort(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.teamNameShort = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamNameLong(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.teamNameLong = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamCountryCode(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.countryCode = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamCity(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.city = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamStateProv(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.stateProv = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamCountry(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.country = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }

  private updateTeamRobotName(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.state.editableTeam.robotName = props.value;
      this.state.teamValidator.update(this.state.editableTeam);
      this.forceUpdate();
    }
  }
}

export default TeamEditModal;