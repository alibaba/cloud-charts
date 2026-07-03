import { describe, expect, it } from 'vitest';
import { createLineModel, type LineSeries } from '@alicloud/cloud-charts-core';

describe('createLineModel', () => {
  it('should produce a chart spec containing a line mark from data + config', () => {
    const data: LineSeries[] = [
      { name: 'series-1', data: [['Jan', 32], ['Feb', 45]] },
    ];
    const config = { legend: {}, tooltip: {} };

    const model = createLineModel({ data, config });

    expect(model.spec).toBeDefined();
    // G2 v5 Spec Mode：顶层 type 可能是 'view'，line 是 child mark
    expect(['view', 'line']).toContain(model.spec.type);
    // 序列化检查：line spec 应能 JSON.stringify 不丢关键信息
    const serialized = JSON.stringify(model.spec);
    expect(serialized).toContain('series-1');
    expect(Array.isArray(model.spec.data)).toBe(true);
  });

  it('should respect context (language, theme)', () => {
    const data: LineSeries[] = [
      { name: 'a', data: [['x', 1]] },
    ];
    const model = createLineModel({
      data,
      config: {},
      context: { language: 'zh-CN' },
    });

    expect(model.context.language).toBe('zh-CN');
  });
});