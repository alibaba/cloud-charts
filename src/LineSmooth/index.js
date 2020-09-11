import Wline from '@alicloud/cloud-charts/lib/Wline';
import factory from "../factory";

const CONFIG = {
  spline: true,
};

export default factory(Wline, 'LineBase', CONFIG);
