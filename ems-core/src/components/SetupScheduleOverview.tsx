import * as React from "react";
import {Card, Table} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import DialogManager from "../managers/DialogManager";
import {AxiosResponse} from "axios";
import {EMSProvider, HttpError, ScheduleItem, TournamentType} from "@the-orange-alliance/lib-ems";

interface IProps {
  type: TournamentType
}

interface IState {
  scheduleItems: ScheduleItem[]
}

class SetupScheduleOverview extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      scheduleItems: []
    };
  }

  public componentDidMount() {
    EMSProvider.getScheduleItems(this.props.type).then((response: AxiosResponse) => {
      const items: ScheduleItem[] = [];
      if (response.data.payload && response.data.payload.length > 0) {
        for (const item of response.data.payload) {
          items.push(new ScheduleItem(this.props.type).fromJSON(item));
        }
      }
      this.setState({scheduleItems: items});
    }).catch((err: HttpError) => {
      DialogManager.showErrorBox(err);
    });
  }

  public render() {
    const scheduleItems = this.state.scheduleItems.map(item => {
      return (
        <Table.Row key={item.key}>
          <Table.Cell width={2}>{item.day + 1}</Table.Cell>
          <Table.Cell width={4}>{item.name}</Table.Cell>
          <Table.Cell width={4}>{item.formattedStartTime}</Table.Cell>
          <Table.Cell width={4}>{item.duration}</Table.Cell>
        </Table.Row>
      );
    });
    return (
      <div className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            {
              scheduleItems.length > 0 &&
              <span><i>The following schedule was generated from the given parameters in the 'Schedule Parameters' tab. Make sure the schedule looks okay, and then head over to the 'Match Maker Parameters' tab.</i></span>
            }
            {
              scheduleItems.length === 0 &&
              <span><i>There is currently no generated {this.props.type.toString().toLowerCase()} schedule. Generate one from the 'Schedule Parameters' tab.</i></span>
            }
          </Card.Content>
          <Card.Content>
            <Table color={getTheme().secondary} attached={true} celled={true} selectable={true} textAlign="center" columns={16}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={2}>Day</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Item</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Start Time</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Duration</Table.HeaderCell>
                </Table.Row>
                {scheduleItems}
              </Table.Header>
            </Table>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default SetupScheduleOverview;