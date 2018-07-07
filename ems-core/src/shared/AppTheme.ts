import {SemanticCOLORS} from "semantic-ui-react";

class AppTheme {

  private _primaryColor: SemanticCOLORS;
  private _secondaryColor: SemanticCOLORS;

  constructor(primaryColor: SemanticCOLORS, secondaryColor: SemanticCOLORS) {
    this._primaryColor = primaryColor;
    this._secondaryColor = secondaryColor;
  }

  get primary() {
    return this._primaryColor;
  }

  get secondary() {
    return this._secondaryColor;
  }

}

export const FTC_THEME = new AppTheme("orange", "orange");
export const FGC_THEME = new AppTheme("green", "blue");

export function getTheme(): AppTheme {
  return FTC_THEME;
}