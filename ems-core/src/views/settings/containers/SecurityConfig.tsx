import * as React from "react";
import {Button, Checkbox, CheckboxProps, Divider, Form, Icon, Modal, Tab, Table} from "semantic-ui-react";
import {User, EMSProvider} from "@the-orange-alliance/lib-ems"


interface IProps {

}

enum ModalMode {
  CreateUser,
  EditUser,
  CreateApi,
  EditApi,
}

interface IState {
  users: User[]
  apiKeys: User[],
  modalOpen: boolean,
  modalMode: ModalMode,
  modalData: any,
  openUser: number,
}

class SecurityConfig extends React.Component<IProps, IState> {

  private usernameTimeout: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      users: [],
      apiKeys: [],
      modalOpen: false,
      modalMode: ModalMode.CreateUser,
      modalData: {can_ref: false, can_control_match: false, can_control_event: false, can_control_fms: false} as any,
      openUser: -1,
    }
  }

  componentDidMount(): void {
    EMSProvider.getUsers().then((users) => {
      this.setState({users: users})
    }).catch((err) => {
      // TODO: toast failure
    });
    EMSProvider.getApiKeys().then((keys) => {
      this.setState({apiKeys: keys})
    }).catch((err) => {
      // TODO: toast failure
    });
  }

  public render() {
    const panes = [
      { menuItem: 'Users', render: () => <Tab.Pane>{this.UsersTab()}</Tab.Pane> },
      { menuItem: 'API Applications', render: () => <Tab.Pane>{this.ApiAppsTab()}</Tab.Pane> }
    ];
    return (
      <>
        <Tab.Pane className="tab-subview">
          <h3>EMS Security Configuration</h3>
          <Divider />
          <Tab panes={panes} />
        </Tab.Pane>

        <Modal
          onClose={() => this.toggleModal(false, true, this.state.modalMode)}
          onOpen={() => this.setState({modalOpen: true})}
          open={this.state.modalOpen}
        >
          { this.state.modalMode === ModalMode.CreateUser && <Modal.Header>Create New User</Modal.Header>}
          { this.state.modalMode === ModalMode.EditUser && <Modal.Header>Update User</Modal.Header>}
          <Modal.Content>
              <Form>
                {(this.state.modalMode === ModalMode.EditApi || this.state.modalMode === ModalMode.CreateApi) &&
                <Form.Field>
                    <label>Description</label>
                    <input placeholder='Description' value={this.state.modalData.description? this.state.modalData.description : ''}
                           onChange={(e: any) => this.updateModalData('description', e, 'value')}
                    />
                </Form.Field>
                }
                {this.state.modalMode === ModalMode.CreateUser &&
                    <>
                      <Form.Field>
                          <label>Username</label>
                          <Form.Input placeholder='Username' value={this.state.modalData.username? this.state.modalData.username : ''}
                                      loading={this.state.modalData.username_loading} disabled={this.state.modalData.username_loading}
                                      onChange={(e: any) => this.updateModalData('username', e, 'value')}
                                      error={this.state.modalData.username_error}
                          />
                      </Form.Field>
                      <Form.Field>
                          <label>Password</label>
                          <input placeholder='Password' type={'password'} value={this.state.modalData.password? this.state.modalData.password : ''}
                                 onChange={(e: any) => this.updateModalData('password', e, 'value')}
                          />
                      </Form.Field>
                    </>
                  }
                  { (this.state.modalMode === ModalMode.CreateUser ||  this.state.modalMode === ModalMode.CreateApi) &&
                  <>
                    <Form.Field>
                        <Checkbox label='Can Ref' checked={this.state.modalData.can_ref}
                                  onChange={(e: any, c: CheckboxProps) => this.setState({modalData: {...this.state.modalData, can_ref: c.checked}})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label='Can Control Match' checked={this.state.modalData.can_control_match}
                                  onChange={(e: any, c: CheckboxProps) => this.setState({modalData: {...this.state.modalData, can_control_match: c.checked}})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label='Can Control Event' checked={this.state.modalData.can_control_event}
                                  onChange={(e: any, c: CheckboxProps) => this.setState({modalData: {...this.state.modalData, can_control_event: c.checked}})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label='Can Control FMS' checked={this.state.modalData.can_control_fms}
                                  onChange={(e: any, c: CheckboxProps) => this.setState({modalData: {...this.state.modalData, can_control_fms: c.checked}})}
                        />
                    </Form.Field>
                  </>
                  }
                {this.state.modalMode === ModalMode.EditUser &&
                <Form.Field>
                    <label>Update Password</label>
                    <input placeholder='New Password' type={'password'} value={this.state.modalData.password? this.state.modalData.password : ''}
                           onChange={(e: any) => this.updateModalData('password', e, 'value')}
                    />
                </Form.Field>
                }
              </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => {this.toggleModal(false, true, ModalMode.CreateUser)}}>
              Cancel
            </Button>
            <Button
              content={(this.state.modalMode === ModalMode.CreateUser || this.state.modalMode === ModalMode.CreateApi) ? "Create" : "Update"}
              labelPosition='right'
              icon='add'
              onClick={() => {this.createUser()}}
              positive
              disabled={this.state.modalData.username_error}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }

  private ApiAppsTab() {
    return (
      <>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>API Key</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>FMS Access</Table.HeaderCell>
              <Table.HeaderCell>Event Management Access</Table.HeaderCell>
              <Table.HeaderCell>Match Management Access</Table.HeaderCell>
              <Table.HeaderCell>Referee Access</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { this.state && this.state.users && this.state.users.length > 0 &&
            <>
              {
                this.state.apiKeys.map((key: User, index: number) => (
                  <Table.Row disabled={key.description && key.description.indexOf('autogenerated') > -1} key={key.apiKey}>
                    <Table.Cell><Button circular icon='copy outline' onClick={() => {}} /></Table.Cell>
                    <Table.Cell>{key.description}<Button circular icon='edit outline' onClick={() => this.editModal(key, ModalMode.EditApi)} floated={"right"} /></Table.Cell>
                    <Table.Cell><Checkbox checked={key.canControlFms} onChange={(e, c) => this.updateKey(key, 'fms', c.checked, index)}/></Table.Cell>
                    <Table.Cell><Checkbox checked={key.canControlEvent} onChange={(e, c) => this.updateKey(key, 'event', c.checked, index)}/></Table.Cell>
                    <Table.Cell><Checkbox checked={key.canControlMatch} onChange={(e, c) => this.updateKey(key, 'match', c.checked, index)}/></Table.Cell>
                    <Table.Cell><Checkbox checked={key.canRef} onChange={(e, c) => this.updateKey(key, 'ref', c.checked, index)}/></Table.Cell>
                    <Table.Cell><Button circular icon='trash alternate outline' onClick={() => this.deleteKey(key, index)} /></Table.Cell>
                  </Table.Row>
                ))
              }
            </>
            }
          </Table.Body>
        </Table>
        <Button color={"green"} icon labelPosition='left' onClick={() => this.toggleModal(true, true, ModalMode.CreateApi)}>
          <Icon name='add' />
          Add API Key
        </Button>
      </>
    )
  }

  private UsersTab() {
    return (
      <>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>FMS Access</Table.HeaderCell>
              <Table.HeaderCell>Event Management Access</Table.HeaderCell>
              <Table.HeaderCell>Match Management Access</Table.HeaderCell>
              <Table.HeaderCell>Referee Access</Table.HeaderCell>
              <Table.HeaderCell>Password</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { this.state && this.state.users && this.state.users.length > 0 &&
              <>
                {
                  this.state.users.map((user: User, index: number) => (
                    <Table.Row disabled={user.username === 'ems-admin'} key={user.username}>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell><Checkbox checked={user.canControlFms} onChange={(e, c) => this.updateUser(user, 'fms', c.checked, index)}/></Table.Cell>
                      <Table.Cell><Checkbox checked={user.canControlEvent} onChange={(e, c) => this.updateUser(user, 'event', c.checked, index)}/></Table.Cell>
                      <Table.Cell><Checkbox checked={user.canControlMatch} onChange={(e, c) => this.updateUser(user, 'match', c.checked, index)}/></Table.Cell>
                      <Table.Cell><Checkbox checked={user.canRef} onChange={(e, c) => this.updateUser(user, 'ref', c.checked, index)}/></Table.Cell>
                      <Table.Cell><Button circular icon='edit outline' onClick={() => this.editModal(user, ModalMode.EditUser)} /></Table.Cell>
                      <Table.Cell><Button circular icon='trash alternate outline' onClick={() => this.deleteUser(user, index)} /></Table.Cell>
                    </Table.Row>
                  ))
                }
              </>
            }
          </Table.Body>
        </Table>
        <Button color={"green"} icon labelPosition='left' onClick={() => this.toggleModal(true, true, ModalMode.CreateUser)}>
          <Icon name='add' />
          Add User
        </Button>
      </>
    )
  }

  private async updateModalData(prop: string, event: any, targetProp: string) {
    const newData = {...this.state.modalData};
    newData[prop] = event.target[targetProp];
    if (prop === 'username') {
      if(typeof this.usernameTimeout !== 'undefined') clearTimeout(this.usernameTimeout);
      this.setState({modalData: newData});
      this.usernameTimeout = setTimeout(async () => {
        this.setState({modalData: {...this.state.modalData, username_loading: true}});
        const usernameChecked = {...newData, username_loading: false};
        const usernameAvaliable = await EMSProvider.checkUsername(newData.username).catch(() => {});
        if(!usernameAvaliable){
          usernameChecked.username_error = { content: 'Username taken', pointing: 'below' }
        } else {
          usernameChecked.username_error = undefined;
        }
        this.setState({modalData: usernameChecked});
      }, 700)
    } else {
      this.setState({modalData: newData});
    }
  }

  private toggleModal(open: boolean, clear: boolean, mode: ModalMode) {
    if(clear) {
      const md = {can_control_event: false, can_ref: false, can_control_match: false, can_control_fms: false, username_error: false, username_loading: false};
      this.setState({modalOpen: open, modalData: md, modalMode: mode});
    } else {
      this.setState({modalOpen: open, modalMode: mode})
    }
  }

  private editModal(user: User, mode: ModalMode) {
    this.setState({modalOpen: true, modalMode: mode, modalData: user.toJSON() })
  }

  private createUser() {
    const user = new User().fromJSON(this.state.modalData);
    if (this.state.modalMode === ModalMode.CreateUser) {
      user.password = this.state.modalData.password;
      EMSProvider.createUser(user).then(() => {
        this.setState({users: [...this.state.users, user]});
        this.toggleModal(false, true, this.state.modalMode);
      }).catch(() => {
        // todo: toast failure
      })
    } else if (this.state.modalMode === ModalMode.EditUser) {
      user.password = this.state.modalData.password;
      EMSProvider.updateUser(user).then(() => {
        this.toggleModal(false, true, this.state.modalMode);
      }).catch(() => {
        // todo: toast failure
      })
    } else if (this.state.modalMode === ModalMode.CreateApi) {
      user.ownerUserId = 0;
      user.description = this.state.modalData.description;
      EMSProvider.createUser(user).then((data) => {
        if (Array.isArray(data.api_keys) && data.api_keys.length > 0) {
          user.apiKey = data.api_keys[0].key;
        }
        this.setState({apiKeys: [...this.state.apiKeys, user]});
        this.toggleModal(false, true, this.state.modalMode);
      }).catch((err) => {
        console.log(err)
        // todo: toast failure
      })
    } else if (this.state.modalMode === ModalMode.EditApi) {
      user.description = this.state.modalData.description;
      EMSProvider.updateApiKey(user).then(() => {
        const newKeys = [...this.state.apiKeys];
        const changedIndex = newKeys.findIndex(u => u.apiKey === user.apiKey);
        newKeys[changedIndex] = user;
        this.setState({apiKeys: newKeys});
        this.toggleModal(false, true, this.state.modalMode);
      }).catch(() => {
        // todo: toast failure
      })
    }
  }

  private updateUser(user: User, property: "fms" | "event" | "match" | "ref", value: boolean, pos: number) {
    switch(property){
      case "fms": user.canControlFms = value; break;
      case "match": user.canControlMatch = value; break;
      case "event": user.canControlEvent = value; break;
      case "ref": user.canRef = value; break;
    }
    EMSProvider.updateUser(user).then(() => {
      const newUsers: User[] = [...this.state.users];
      newUsers[pos] = user;
      this.setState({users: newUsers});
      this.toggleModal(false, true, this.state.modalMode);
    }).catch(() => {
      // todo: toast failure
    })
  }

  private updateKey(user: User, property: "fms" | "event" | "match" | "ref", value: boolean, pos: number) {
    switch(property){
      case "fms": user.canControlFms = value; break;
      case "match": user.canControlMatch = value; break;
      case "event": user.canControlEvent = value; break;
      case "ref": user.canRef = value; break;
    }
    EMSProvider.updateApiKey(user).then(() => {
      const newKeys: User[] = [...this.state.apiKeys];
      newKeys[pos] = user;
      this.setState({apiKeys: newKeys});
      this.toggleModal(false, true, this.state.modalMode);
    }).catch(() => {
      // todo: toast failure
    })
  }

  private deleteUser(user: User, pos: number) {
    EMSProvider.deleteUser(user.username).then(() => {
      const newUsers = [...this.state.users];
      newUsers.splice(pos, 1);
      this.setState({users: newUsers});
    }).catch((err) => {
      // todo: toast failure
    })
  }

  private deleteKey(user: User, pos: number) {
    EMSProvider.deleteKey(user.apiKey).then(() => {
      const newKeys = [...this.state.apiKeys];
      newKeys.splice(pos, 1);
      this.setState({apiKeys: newKeys});
    }).catch((err) => {
      // todo: toast failure
    })
  }
}

export default SecurityConfig;
