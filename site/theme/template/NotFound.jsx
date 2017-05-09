import React from 'react';
import { Link } from 'react-router';
import { MessagePage } from '@alife/aisc';

export default function NotFound({ location }) {
  return (
    <div className="center">
      <MessagePage  buttons={[{buttonType:"primary",link:"/",text:"返回首页"},{onClick:()=>{history.back()},text:"返回上一页"}]}/>
    </div>
  );
}
