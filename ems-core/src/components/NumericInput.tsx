import * as React from "react";
import {Form, InputProps, LabelProps, SemanticShorthandItem} from "semantic-ui-react";
import {SyntheticEvent} from "react";

interface IProps {
  error?: boolean,
  label?: SemanticShorthandItem<LabelProps>,
  value: string | number,
  onUpdate: (value: number) => void
}

class NumericInput extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  public render() {
    const {error, label, value} = this.props;
    return (
      <Form.Input
        error={error ? error : false}
        fluid={true}
        label={label}
        value={value}
        onChange={this.onChange}
      />
    );
  }

  private onChange(event: SyntheticEvent, props: InputProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(props.value, 10)) || value.length <= 0) {
      const newValue: number = parseInt(value, 10) > 0 ? parseInt(value, 10) : 0;
      this.props.onUpdate(newValue);
    }
  }
}

export default NumericInput;