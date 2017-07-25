'use strict';

import merge from '../utils/merge';

class Base {

  constructor (selector, options){
    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.options = options || {};
    this.data = [];
    this.event = {};
  }

  destroy (){
    this.element.innerHTML = '';
  }

  getData (index){
    if(typeof index === 'undefined' || index === '') return this.data;
    if(typeof index === 'number') return this.data[index] || null;
    let ret = null;
    this.data.forEach((item)=>{
      if(index === item.name) ret = item.data;
    });
    return ret;
  }

  setData (data, sync){ //通用全量传入数据方法
    sync = sync === undefined ? true : sync;
    this.data = [];
    if(data && !Array.isArray(data) && typeof data === 'object'){
      data = [data];
    }
    data.forEach((d,i)=>{
      if(!d){
        this.data.push({
          name: 'data' + i,
          data: []
        });
      }else if(Array.isArray(d)){
        this.data.push({
          name: 'data' + i,
          data: d
        });
      }else{
        this.data.push({
          name: d.name || 'data' + i,
          data: d.data
        });
      }
    });
    if(sync) this.render();
  }

  addData (data, index, shift, sync){
    this.concatData([data], index, shift, sync);
  }

  concatData (data, index, shift, sync){
    sync = sync === undefined ? true : sync;
    
    this.data.forEach((item)=>{
      if(index === item.name){
        let d = item.data;
        d = d.concat(data);
        if(shift) d.splice(0,data.length);
        item.data = d;
      }
    });
    if(sync) this.render();
  }

  updateData (data, index, sync){
    sync = sync === undefined ? true : sync;
    this.data.forEach((item)=>{
      if(index === item.name){
        item.data = data;
      }
    });
    if(sync) this.render();
  }

  getOption (key){
    if(key) return this.options[key];
    else return this.options;
  }

  setOption (options, sync){
    sync = sync === undefined ? true : sync;
    merge(this.options, options);
    if(sync) this.render();
  }

  on (event, callback){
    if(!this.event[event]) this.event[event] = [];
    this.event[event].push(callback);
  }

  fire (event, ...args){
    if(this.event[event]){
      this.event[event].forEach((callback)=>{
        callback.call(this, ...args);
      });
    }
  }

  render (){
  }

}

export default Base;