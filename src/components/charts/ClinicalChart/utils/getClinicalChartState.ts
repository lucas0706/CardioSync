export interface ClinicalChartState {
  loading: boolean
  empty: boolean
  ready: boolean
}

export function getClinicalChartState(
  loading: boolean,
  hasData: boolean,
): ClinicalChartState {

  return {
    loading,

    empty:
      !loading &&
      !hasData,

    ready:
      !loading &&
      hasData,
  }
}
