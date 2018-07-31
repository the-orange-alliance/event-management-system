interface IMatchRanker {
  prepare(matchJSON: any[]): Map<number, IPostableObject>; // Map teamKey to Rank object
  sort(items: IPostableObject[], left: number, right: number): IPostableObject[] // Generally, this is a recursive quicksort
  execute(matchJSON: any[]): IPostableObject[]; // Returns a fully sorted list of rankings
}