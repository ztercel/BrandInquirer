const _ = require('lodash');

class Named {
    // 生成两个字组成词组
    named(seeds) {
        let names = [];
        seeds= _.uniq(_.trim(seeds).replace(/[\x00-\xff]+/g, ''));  // 去除数字，字母，标点符号且去重  [\u3002]
        seeds.forEach(first => {
           seeds.forEach(second => {
               names.push(first + second);
           });
        });
       return {seeds, names};
    }
}

module.exports = Named;