import { plugins } from '@alicloud/cloud-charts';
import '@alicloud/cloud-charts/build/worldmap';

//从 plugins 中结构出对应的插件
// @ts-ignore
const { WorldMap: ConsoleWorldmapChart } = plugins;

export default ConsoleWorldmapChart;
