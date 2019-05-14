import themes from './normal';

// 横杠连接符转为小驼峰
Object.keys(themes).forEach((key) => {
  if (key.indexOf('-') > -1) {
    const newKey = key.replace(/-(\w)/g, function(all, letter){
      return letter.toUpperCase();
    });
    if (!themes[newKey]) {
      themes[newKey] = themes[key];
    }
  }
});

export default themes;
