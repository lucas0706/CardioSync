export interface TargetRange {
  min?: number
  max?: number
}


export class TargetRangeEvaluator {

  static isWithinRange(
    value: number,
    range?: TargetRange,
  ): boolean {

    if (!range) {
      return true
    }


    if (
      range.min !== undefined &&
      value < range.min
    ) {
      return false
    }


    if (
      range.max !== undefined &&
      value > range.max
    ) {
      return false
    }


    return true
  }
}
