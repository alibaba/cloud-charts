/**
 * G2 v5 类型统一导出入口。
 *
 * 设计：所有 `@antv/g2` / `@antv/component` 真实类型在 g2-types/ 下集中 re-export，
 * runtime/features/* 等业务代码统一从这里 import，方便：
 * - G2 升级时一处同步
 * - AI agent 一处查找
 * - 包外消费者按需 import
 */

export * from './legend';
export * from './axis';
