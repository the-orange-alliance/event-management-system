import * as React from "react";
import {Table} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";

class SetupScheduleOverview extends React.Component {
  public render() {
    return (
      <div className="step-view-tab">
        <Table color={getTheme().secondary} attached={true} celled={true} selectable={true} textAlign="center" columns={16}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={4}>Item</Table.HeaderCell>
              <Table.HeaderCell width={4}>Start Time</Table.HeaderCell>
              <Table.HeaderCell width={4}>Duration</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
      </div>
    );
  }
}

export default SetupScheduleOverview;