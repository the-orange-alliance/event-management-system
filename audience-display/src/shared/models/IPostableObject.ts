interface IPostableObject {
  toJSON(): object,
  fromJSON(json: any): IPostableObject
}