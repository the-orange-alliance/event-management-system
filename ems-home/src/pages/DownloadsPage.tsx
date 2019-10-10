import * as React from "react";
import {Divider, Grid, List, ListItem, ListItemText, Typography} from "@material-ui/core";

const styles = {
  divider: {
    marginTop: '16px',
    marginBottom: '16px'
  }
};

class DownloadsPage extends React.Component {
  constructor(props: any) {
    super(props);

    this.downloadNode = this.downloadNode.bind(this);
    this.downloadTournamentConfig = this.downloadTournamentConfig.bind(this);
    this.downloadChromeAPK = this.downloadChromeAPK.bind(this);
  }

  public render() {
    return (
      <div>
        <Typography gutterBottom={true} variant={'body1'} component={'p'}>
          Click on any of the following links below to start downloading documents and important files.
        </Typography>
        <Divider style={styles.divider}/>
        <Grid container={true} spacing={3}>
          {/* AUDIENCE DISPLAY */}
          <Grid item={true} xs={12} sm={12} md={6} lg={4}>
            <List component={"nav"}>
              <ListItem button={true} onClick={this.downloadNode}>
                <ListItemText primary={"Node.js"}/>
              </ListItem>
              <ListItem button={true} onClick={this.downloadTournamentConfig}>
                <ListItemText primary={"FIRST Global 2019 Tournament Configuration"}/>
              </ListItem>
              <ListItem button={true} onClick={this.downloadChromeAPK}>
                <ListItemText primary={"Google chrome android apk"}/>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }

  private downloadNode() {
    window.open("downloads/node-v10.16.3-x64.msi", "__blank");
  }

  private downloadTournamentConfig() {
    window.open("downloads/FGC 2019 Tournament Configuration.json", "__blank");
  }

  private downloadChromeAPK() {
    window.open("downloads/chrome.apk", "__blank");
  }
}

export default DownloadsPage;