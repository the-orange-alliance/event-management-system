import * as React from "react";
import {WPAKey} from "@the-orange-alliance/lib-ems";

interface IProps {
  wpaKeys: WPAKey[],
  event: any
}

interface IState {
  fileType: string,
  fileDownloadUrl: string,
  status: string,
}

class WPAKeys extends React.Component<IProps, IState> {

  private fileDownloadAnchor: HTMLAnchorElement;

  constructor(props: IProps) {
    super(props);
    this.state = {
      fileType: '',
      fileDownloadUrl: null,
      status: "",
    };
  }

  public componentDidMount(): void {
    this.download(this.props.event);
  }

  private download (event: any) {
    // event.preventDefault();
    // Prepare data
    let output = '';
    this.props.wpaKeys.forEach((data) => {
      output += `${data.teamKey},${data.wpaKey}\n`;
    });

    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    this.setState ({fileDownloadUrl: fileDownloadUrl},
      () => {
        this.fileDownloadAnchor.click();
        URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
        this.setState({fileDownloadUrl: ""})
      })
  }

  public render() {
    return (
      <a className="hidden"
         download={"wpa_keys.csv"}
         href={this.state.fileDownloadUrl}
         ref={e => this.fileDownloadAnchor = e}
      >Download didn't start? Click here</a>
    )
  }
}

export default WPAKeys;
