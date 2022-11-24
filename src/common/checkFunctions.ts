// 空数据检测
export function checkEmptyData(data: any) {
  console.log('data check:', data);
  if (!data) {
    return true;
  }
  if (Array.isArray(data)) {
    return data?.length === 0 || data?.every((item: any) => !item?.data || item?.data?.length === 0);
  }
  if (typeof data === 'object') {
    return Object.keys(data).length === 0 || data?.children?.length === 0;
  }

  return false;
}
