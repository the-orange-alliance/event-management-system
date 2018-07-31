interface IPostableObject {
  getKey(): string;
  toJSON(): object;
  fromJSON(json: any): IPostableObject;
}