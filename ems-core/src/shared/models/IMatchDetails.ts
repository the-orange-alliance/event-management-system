interface IMatchDetails {
  matchKey: string;
  matchDetailKey: string;
  getRedScore(minPen: number, majPen: number): number;
  getBlueScore(minPen: number, majPen: number): number;
  toJSON(): object;
  fromJSON(json: any): IPostableObject;
}