import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Card, CardActionArea, CardContent, CardMedia, Container, Divider, Grid, Typography} from "@material-ui/core";
import AUDIENCE_DISPLAY from "../res/audience_display.png";
import SCORING_APPLICATION from "../res/scoring_application.png";
import DOWNLOAD_ICON from "../res/download_icon.png";
import DOCUMENTATION_ICON from "../res/documentation_icon.png";
import DownloadsPage from "./DownloadsPage";

const styles = {
  container: {
    padding: '16px',
    backgroundColor: '#f5f6f7'
  },
  cardImage: {
    width: '100%',
    height: '230px'
  },
  divider: {
    marginTop: '16px',
    marginBottom: '16px'
  }
};

interface IState {
  page: string;
}

class HomePage extends React.Component<RouteComponentProps, IState> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      page: "home"
    };

    this.navigateToAudienceDisplay = this.navigateToAudienceDisplay.bind(this);
    this.navigateToScoringApp = this.navigateToScoringApp.bind(this);
    this.navigateToDownloads = this.navigateToDownloads.bind(this);
  }

  public render() {
    return (
      <Container style={styles.container}>
        <Typography variant={'h3'} component={'h1'}>Event Management Hub</Typography>
        {this.renderPage()}
      </Container>
    );
  }

  private renderPage() {
    const {page} = this.state;
    switch (page) {
      case "home":
        return this.renderHomePage();
      case "downloads":
        return <DownloadsPage/>;
      default:
        return this.renderHomePage();
    }
  }

  private renderHomePage() {
    return (
      <div>
        <Typography gutterBottom={true} variant={'body1'} component={'p'}>
          This is the hub website for extra pages within EMS. Click on a card to access the content it describes.
        </Typography>
        <Divider style={styles.divider}/>
        <Grid container={true} spacing={3}>
          {/* AUDIENCE DISPLAY */}
          <Grid item={true} xs={12} sm={12} md={6} lg={4}>
            <Card raised={true}>
              <CardActionArea onClick={this.navigateToAudienceDisplay}>
                <CardMedia
                  style={styles.cardImage}
                  component={'img'}
                  image={AUDIENCE_DISPLAY}
                  title={'Audience Display'}
                />
                <CardContent>
                  <Typography variant={'h5'} component={'h2'}>Audience Display</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Web application that provides real-time access to views during the course of the event.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {/* SCORING APP */}
          <Grid item={true} xs={12} sm={12} md={6} lg={4}>
            <Card raised={true}>
              <CardActionArea onClick={this.navigateToScoringApp}>
                <CardMedia
                  style={styles.cardImage}
                  component={'img'}
                  image={SCORING_APPLICATION}
                  title={'Scoring Application'}
                />
                <CardContent>
                  <Typography variant={'h5'} component={'h2'}>Scoring Application</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    The scoring application is a web application for event scorers/referees.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {/* DOWNLOADS */}
          <Grid item={true} xs={12} sm={12} md={6} lg={4}>
            <Card raised={true}>
              <CardActionArea onClick={this.navigateToDownloads}>
                <CardMedia
                  style={styles.cardImage}
                  component={'img'}
                  image={DOWNLOAD_ICON}
                  title={'Downloads'}
                />
                <CardContent>
                  <Typography variant={'h5'} component={'h2'}>Downloads</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Files served up for your ease of access such as a google chrome apk.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {/* DOCUMENTATION */}
          <Grid item={true} xs={12} sm={12} md={6} lg={4}>
            <Card raised={true}>
              <CardActionArea>
                <CardMedia
                  style={styles.cardImage}
                  component={'img'}
                  image={DOCUMENTATION_ICON}
                  title={'Documentation'}
                />
                <CardContent>
                  <Typography variant={'h5'} component={'h2'}>Documentation</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    All of the documentation that was ever created for Event Management System.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

  public navigateToAudienceDisplay() {
    window.location.href = window.location.href = "/audience";
  }

  public navigateToScoringApp() {
    window.location.href = window.location.href = "/ref";
  }

  public navigateToDownloads() {
    this.setState({page: "downloads"});
  }
}

export default HomePage;