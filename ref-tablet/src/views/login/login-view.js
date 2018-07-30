import React, {Component} from "react";
import "./login-view.css";

import fgLogoWhite from "../../assets/FG_white.png";

class LoginView extends Component {

	attemptLogin(type) {
		this.props.onLogin(type);
	}

	render() {

		return (
			<div id="lv-container">
				<div id="lv-header">
					<img src={fgLogoWhite} alt="FGC Logo" className="header-logo" />
				</div>
				<div id="lv-body">
					<div id="lv-body-status">
						<span>Status: </span><span className={this.props.connected ? "success" : "error"}>{this.props.connected ? "CONNECTED" : "NOT CONNECTED"}</span>
					</div>
					<div id="lv-body-button-container">
						<div className="lv-body-button-row">
							<button className="big-button red-btn" onClick={() => this.attemptLogin(0)}>Red Alliance</button>
							<button className="big-button blue-btn" onClick={() => this.attemptLogin(1)}>Blue Alliance</button>
						</div>
						<div className="lv-body-button-row">
							<button className="big-button wide yellow-btn" onClick={() => this.attemptLogin(2)}>Head Ref</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LoginView;
