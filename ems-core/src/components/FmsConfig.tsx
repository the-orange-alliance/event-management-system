import * as React from "react";
import {
    Card,
    Divider,
    Tab,
    Checkbox,
    Grid,
    FormInput,
    GridColumn,
    Dropdown, Button
} from "semantic-ui-react";
import {getTheme} from "../AppTheme";

class FmsConfig extends React.Component {
    public render() {
        const adminWifiOpts = [
            {
                key: 'Disabled',
                text: 'Disabled',
                value: '-1',
            },
            {
                key: '1',
                text: 'Ch 1',
                value: '1',
            },
            {
                key: '6',
                text: 'Ch 6',
                value: '6',
            },
            {
                key: '11',
                text: 'Ch 11',
                value: '11',
            },
        ];
        const teamWifiOpts = [
            {
                key: '36',
                text: 'Ch 36',
                value: '36',
            },
            {
                key: '40',
                text: 'Ch 40',
                value: '40',
            },
            {
                key: '44',
                text: 'Ch 44',
                value: '44',
            },
            {
                key: '48',
                text: 'Ch 48',
                value: '48',
            },
            {
                key: '149',
                text: 'Ch 149',
                value: '149',
            },
            {
                key: '153',
                text: 'Ch 153',
                value: '153',
            },
            {
                key: '157',
                text: 'Ch 157',
                value: '157',
            },
            {
                key: '161',
                text: 'Ch 161',
                value: '161',
            },
        ];
        return (
            <Tab.Pane className="tab-subview">
                <h3>FMS Configuration</h3>
                <Divider />
                <Card.Group itemsPerRow={1}>
                    <Card fluid={true} color={getTheme().secondary}>
                        <Card.Content>
                            <Grid>
                                <Grid.Row columns={1}>
                                    <GridColumn>
                                        <h4>FMS</h4>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row>
                                    <GridColumn>
                                        <span>Enable EMS's FMS features: This allows EMS to control Driver Stations and interface with available field hardware.</span>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row>
                                    <GridColumn>
                                        <span>If enabled, please ensure that your IP Address is set to 10.0.100.5, or else things will not work as intended.</span>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>Enable FMS</span></GridColumn>
                                    <GridColumn><Checkbox /></GridColumn>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>
                    <Card fluid={true} color={getTheme().secondary}>
                        <Card.Content>
                            <Grid>
                                <Grid.Row columns={1}>
                                    <GridColumn>
                                        <h4>Advanced Networking Options</h4>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={1}>
                                    <GridColumn>
                                        <span>If you have a Linksys WRT1900ACS access point and Catalyst 3500-Series switch available,
                            for isolating each team to it's own SSID and Vlan</span>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>Enable Advanced Networking</span></GridColumn>
                                    <GridColumn><Checkbox /></GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>AP IP Address</span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                    <GridColumn/>
                                    <GridColumn><span>AP Team Channel (5GHz) </span></GridColumn>
                                    <GridColumn>
                                        <Dropdown
                                            placeholder={'Disabled'}
                                            fluid={true}
                                            selection={true}
                                            defaultValue={'-1'}
                                            options={adminWifiOpts}
                                        />
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>AP Username</span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                    <GridColumn/>
                                    <GridColumn><span>AP Admin Channel (2.4GHz) </span></GridColumn>
                                    <GridColumn>
                                        <Dropdown
                                            placeholder={'Disabled'}
                                            fluid={true}
                                            selection={true}
                                            defaultValue={'157'}
                                            options={teamWifiOpts}
                                        />
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>AP Password</span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                    <GridColumn/>
                                    <GridColumn><span>AP Admin WPA Key </span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                </Grid.Row>
                                <Grid.Row/>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>Switch Address</span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                    <GridColumn/>
                                    <GridColumn><span>Switch Password</span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>
                    <Card fluid={true} color={getTheme().secondary}>
                        <Card.Content>
                            <Grid>
                                <Grid.Row columns={1}>
                                    <GridColumn>
                                        <h4>PLC</h4>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row columns={5}>
                                    <GridColumn><span>Enable PLC Control</span></GridColumn>
                                    <GridColumn><Checkbox /></GridColumn>
                                    <GridColumn/>
                                    <GridColumn><span>PLC Address</span></GridColumn>
                                    <GridColumn><FormInput /></GridColumn>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>
                </Card.Group>
                <Divider/>
                <Button fluid={true} color={getTheme().primary} onClick={undefined}>Save and Apply</Button>
            </Tab.Pane>
        );
    }
}

export default FmsConfig;
