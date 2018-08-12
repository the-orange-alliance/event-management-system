import * as React from "react";
import "./SponsorScreen.css";

import REV_LOGO from "../res/sponsors/REV.jpg";

const IMAGE_TIME = 5000;

interface IState {
  activeIndex: number
}

class SponsorScreen extends React.Component<{}, IState> {
  private _timerID: any;
  private _sponsors: string[];

  constructor(props: any) {
    super(props);
    this._timerID = null;
    this._sponsors = [REV_LOGO];

    this.state = {
      activeIndex: -1
    };
  }

  public componentDidMount() {
    this.startImageCarousel(this._sponsors);
  }

  public componentWillUnmount() {
    this.stopImageCarousel();
  }

  public render() {
    const {activeIndex} = this.state;
    return (
      <div id="fgc-body">
        <div id="fgc-sponsor-container">
          <div id="fgc-sponsor-header">
            <span>Thank you to our wonderful sponsors</span>
          </div>
          <div id="fgc-sponsor-image">
            <img src={this._sponsors[activeIndex]} className="fit-h"/>
          </div>
        </div>
      </div>
    );
  }

  private startImageCarousel(imagesUrls: string[]) {
    this.setState({activeIndex: 0});
    this._timerID = global.setInterval(() => {
      let newIndex = this.state.activeIndex + 1;
      if (newIndex > imagesUrls.length - 1) {
        newIndex = 0;
      }
      console.log("Switching to new index: " + newIndex);
      this.setState({activeIndex: newIndex});
    }, IMAGE_TIME);
  }

  private stopImageCarousel() {
    if (this._timerID !== null) {
      global.clearInterval(this._timerID);
    }
  }
}

export default SponsorScreen;