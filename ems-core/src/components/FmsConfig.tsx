import * as React from "react";
import {
    Card,
    Divider,
    Tab,
    Checkbox,
    Grid,
    Form,
    GridColumn,
    Dropdown, Button
} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {SocketProvider} from "@the-orange-alliance/lib-ems";

interface IProps {
    idkWhatToPutHere?: number
}

interface IState {
    enableFms: boolean,
    enableAdvNet: boolean,
    apIpAddress: string,
    apUsername: string,
    apPassword: string
    apTeamCh: number,
    apAdminCh: number,
    apAdminWpaKey: string,
    switchIpAddress: string,
    switchPassword: string,
    enablePlc: boolean,
    plcIpAddress: string,
}


class FmsConfig extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {enableFms: false, enableAdvNet: false, apIpAddress:'10.0.100.1', apUsername:'root',
            apPassword: '1234Five', apTeamCh: 157, apAdminCh: -1, apAdminWpaKey:'56Seven', switchIpAddress: '10.0.100.2',
            switchPassword: '56Seven', enablePlc: false, plcIpAddress: '10.0.100.10'};
        this.saveAndApply = this.saveAndApply.bind(this);
        this.toggleFms = this.toggleFms.bind(this);
        this.toggleAdvNet = this.toggleAdvNet.bind(this);
        this.togglePlc = this.togglePlc.bind(this);
    }

    // TODO: Emit fms-request-settings and listen to fms-settings to get settings from FMS
    public componentDidMount(): void {
        SocketProvider.on('fms-settings', (data) => {
            const config = JSON.parse(data);
            this.setState({
                enableFms: config.enable_fms,
                enableAdvNet: config.enable_adv_net,
                apIpAddress: config.ap_ip,
                apUsername: config.ap_username,
                apPassword: config.ap_password,
                apTeamCh: config.ap_team_ch,
                apAdminCh: config.ap_admin_ch,
                apAdminWpaKey: config.ap_admin_wpa,
                switchIpAddress: config.switch_ip,
                switchPassword: config.switch_password,
                enablePlc: config.enable_plc,
                plcIpAddress: config.plc_ip
            });
        });
        SocketProvider.emit("fms-request-settings");
    }

    private toggleFms() {
        this.setState({
            enableFms: !this.state.enableFms,
            enablePlc: !this.state.enableFms,
            enableAdvNet: !this.state.enableFms
        });
    }

    private toggleAdvNet() {
        this.setState({
            enableAdvNet: !this.state.enableAdvNet
        });
    }

    private togglePlc() {
        this.setState({
            enablePlc: !this.state.enablePlc
        });
    }

    public render() {
        const adminWifiOpts = [
            { key: 'Disabled', text: 'Disabled', value: -1 },
            { key: '1',  text: 'Ch 1',  value: 1  },
            { key: '6',  text: 'Ch 6',  value: 6  },
            { key: '11', text: 'Ch 11', value: 11 },
        ];
        const teamWifiOpts = [
            { key: '36',  text: 'Ch 36',  value: 36  },
            { key: '40',  text: 'Ch 40',  value: 40  },
            { key: '44',  text: 'Ch 44',  value: 44  },
            { key: '48',  text: 'Ch 48',  value: 48  },
            { key: '149', text: 'Ch 149', value: 149 },
            { key: '153', text: 'Ch 153', value: 153 },
            { key: '157', text: 'Ch 157', value: 157 },
            { key: '161', text: 'Ch 161', value: 161 },
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
                                    <GridColumn><Checkbox checked={this.state.enableFms} onChange={this.toggleFms}/></GridColumn>
                                </Grid.Row>
                            </Grid>
                        </Card.Content>
                    </Card>
                    {this.state.enableFms &&
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
                                        <GridColumn><Checkbox checked={this.state.enableAdvNet} onChange={this.toggleAdvNet}/></GridColumn>
                                    </Grid.Row>

                                </Grid>
                            </Card.Content>
                        </Card>
                    }
                    {(this.state.enableFms && this.state.enableAdvNet) &&
                        <Card fluid={true} color={getTheme().secondary}>
                            <Card.Content>
                                <Grid>
                                    <Grid.Row columns={1}>
                                        <GridColumn>
                                            <h4>Field AP Information</h4>
                                        </GridColumn>
                                    </Grid.Row>
                                    <Grid.Row columns={5}>
                                        <GridColumn><span>AP IP Address</span></GridColumn>
                                        <GridColumn><Form.Input fluid={true}  value={this.state.apIpAddress} onChange={(e) => this.setState({apIpAddress: e.target.value})}/></GridColumn>
                                        <GridColumn/>
                                        <GridColumn><span>AP Team Channel (5GHz) </span></GridColumn>
                                        <GridColumn>
                                            <Dropdown
                                              placeholder={'Disabled'}
                                              fluid={true}
                                              selection={true}
                                              options={teamWifiOpts}
                                              value={this.state.apTeamCh}
                                              onChange={(e, d) => this.setState({apTeamCh: d.value as number})}
                                            />
                                        </GridColumn>
                                    </Grid.Row>
                                    <Grid.Row columns={5}>
                                        <GridColumn><span>AP Username</span></GridColumn>
                                        <GridColumn><Form.Input fluid={true} value={this.state.apUsername}/></GridColumn>
                                        <GridColumn/>
                                        <GridColumn><span>AP Admin Channel (2.4GHz) </span></GridColumn>
                                        <GridColumn>
                                            <Dropdown
                                              placeholder={'Disabled'}
                                              fluid={true}
                                              selection={true}
                                              options={adminWifiOpts}
                                              value={this.state.apAdminCh}
                                              onChange={(e, d) => this.setState({apAdminCh: d.value as number})}
                                            />
                                        </GridColumn>
                                    </Grid.Row>
                                    <Grid.Row columns={5}>
                                        <GridColumn><span>AP Password</span></GridColumn>
                                        <GridColumn><Form.Input fluid={true} value={this.state.apPassword} type={"password"} onChange={(e) => this.setState({apPassword: e.target.value})}/></GridColumn>
                                        <GridColumn/>
                                        <GridColumn><span>AP Admin WPA Key </span></GridColumn>
                                        <GridColumn><Form.Input fluid={true} value={this.state.apAdminWpaKey} type={"password"} onChange={(e) => this.setState({apAdminWpaKey: e.target.value})}/></GridColumn>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                    }
                    {(this.state.enableFms && this.state.enableAdvNet) &&
                        <Card fluid={true} color={getTheme().secondary}>
                            <Card.Content>
                                <Grid>
                                    <Grid.Row columns={1}>
                                        <GridColumn>
                                            <h4>Switch Information</h4>
                                        </GridColumn>
                                    </Grid.Row>
                                    <Grid.Row columns={5}>
                                        <GridColumn><span>Switch Address</span></GridColumn>
                                        <GridColumn><Form.Input fluid={true} value={this.state.switchIpAddress} onChange={(e) => this.setState({switchIpAddress: e.target.value})}/></GridColumn>
                                        <GridColumn/>
                                        <GridColumn><span>Switch Password</span></GridColumn>
                                        <GridColumn><Form.Input fluid={true} value={this.state.switchPassword} type={"password"} onChange={(e) => this.setState({switchPassword: e.target.value})}/></GridColumn>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                    }
                    {(this.state.enableFms && this.state.enableAdvNet) &&
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
                                        <GridColumn><Checkbox checked={this.state.enablePlc} onChange={this.togglePlc}/></GridColumn>
                                        <GridColumn/>
                                        <GridColumn><span>PLC Address</span></GridColumn>
                                        <GridColumn><Form.Input fluid={true} value={this.state.plcIpAddress} onChange={(e) => this.setState({plcIpAddress: e.target.value})}/></GridColumn>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                    }
                </Card.Group>
                <Divider/>
                <Button fluid={true} color={getTheme().primary} onClick={this.saveAndApply}>Save and Apply</Button>
            </Tab.Pane>
        );
    }

    private saveAndApply() {
        const json = {
            enable_fms: this.state.enableFms,
            enable_adv_net: this.state.enableAdvNet,
            ap_ip: this.state.apIpAddress,
            ap_username: this.state.apUsername,
            ap_password: this.state.apPassword,
            ap_team_ch: this.state.apTeamCh,
            ap_admin_ch: this.state.apAdminCh,
            ap_admin_wpa: this.state.apAdminWpaKey,
            switch_ip: this.state.switchIpAddress,
            switch_password: this.state.switchPassword,
            enable_plc: this.state.enablePlc,
            plc_ip: this.state.plcIpAddress
        };
        SocketProvider.emit("fms-settings-update", JSON.stringify(json)); // TODO: setTimeout and wait for socket 'fms-settings-update-success'
    }
}

export default FmsConfig;
