import EmptyDataType, { EmptyJudgeType } from './emptyDataType';

// 空数据检测
export function checkEmptyData(data: any, chartType: string) {
  const type = (EmptyDataType as any)[chartType]?.emptyJudge;
  if (type === EmptyJudgeType.COMMON) {
    return data?.length === 0 || data?.every((item: any) => !item?.data || item?.data?.length === 0);
  }
  if (type === EmptyJudgeType.CHILDREN) {
    return !data?.children || data?.children?.length === 0;
  }
  if (type === EmptyJudgeType.ARRAY) {
    return data?.length === 0 || data?.every((item: any) => item?.x === undefined || item?.y === undefined);
  }
  if (type === EmptyJudgeType.GRAPH) {
    return !data?.nodes || data?.nodes?.length === 0 || !data?.links || data?.links?.length === 0;
  }

  return false;
}
