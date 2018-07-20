import * as React from "react";
import {Button, Form, Grid, Icon, Modal} from "semantic-ui-react";
import Team from "../shared/models/Team";
import ExplanationIcon from "./ExplanationIcon";

interface IProps {
  open: boolean,
  onClose: () => void
  onConfirm: () => void,
  team: Team
}

interface IState {
  editableTeam: Team
}

class TeamEditModal extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      editableTeam: null
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.team !== this.props.team) {
      this.setState({editableTeam: this.props.team});
    }
  }

  public render() {
    const {editableTeam} = this.state;
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
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.teamKey} label="Team ID"/></Grid.Column>
                  <Grid.Column width={12}><Form.Input fluid={true} value={editableTeam.teamNameShort} label="Team Name (Short)"/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16}>
                  <Grid.Column width={12}><Form.Input fluid={true} value={editableTeam.teamNameLong} label="Team Name (Long)"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.countryCode} label={<ExplanationIcon title={"Country Code"} content={"This field is optional. A team's country code should be their ISO ALPHA-2 letter code."}/>}/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16}>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.city} label="City"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.stateProv} label="State/Province"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.country} label="Country"/></Grid.Column>
                  <Grid.Column width={4}><Form.Input fluid={true} value={editableTeam.robotName} label="Robot Name"/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.props.onConfirm}>
            <Icon name='checkmark' /> Update Team
          </Button>
          <Button color='red' onClick={this.props.onClose}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default TeamEditModal;