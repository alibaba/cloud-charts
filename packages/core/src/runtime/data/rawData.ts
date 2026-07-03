export interface RawDataLookupConfig {
  dataType?: string;
}

export interface TooltipDataItem {
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getRawData(
  config: RawDataLookupConfig | undefined,
  rawData: Array<Record<string, unknown>> | undefined,
  item: TooltipDataItem,
): Record<string, unknown> {
  if (!rawData) {
    return {};
  }

  let originData = item.data || {};
  if (config?.dataType !== 'g2' && Array.isArray(rawData)) {
    rawData.some((record) => {
      if (record.name !== originData.type) {
        return false;
      }

      if (record.facet && originData.facet !== record.facet) {
        return false;
      }

      originData = record;
      return true;
    });
  }

  return originData;
}
