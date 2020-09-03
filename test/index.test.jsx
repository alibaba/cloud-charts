import React from 'react';
import { shallow } from 'enzyme';
import ConsoleCharts from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<ConsoleCharts />);
  expect(wrapper.find('.ConsoleCharts').length).toBe(1);
});
