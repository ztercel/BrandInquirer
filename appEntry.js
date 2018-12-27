const _ = require('lodash');
const requester = require('request-promise');

 async function inquireBrand(options, name, type) {
    return new Promise((resolve) => {
        requester(options)
            .then((body) => {
                console.log("商标名: " + name);
                var items   = _(body).get('result.list')
                    .filter((item) => (item['tradename'].trim().localeCompare(name.trim()) == 0))
                    .map((item) => _.pick(item, ['tradename', 'clsname', 'regno', 'applynamecn', 'process']));
                if (0 == items.length) {
                    console.log("商标名: " + name + "  商标分类: " + type + "-家具  状态:  未注册");
                } else {
                    items.forEach((item) => {
                       console.log("商标名: " + name + "  商标分类: " + type + "-家具  状态:  " + item['process'] +
                                   "(注册公司: " + item['applynamecn'] + "  注册号: " + item['regno'] +")");
                    });
                }
                resolve(true);
            })
            .catch((err) => {
                console.log(err);
                resolve(false);
            });
    });
}

async function batchInquireBrand(names, type) {
     for (let name of names) {
         const options = {
             uri:    "https://www.iptop.cn/search/services/tmsearch/searchTm",
             body:   {
                 "likeQueryList":[{"field":"name","fieldValue":name},{"field":"cls","fieldValue": type}],
                 "pageSize":1000,
             },
             json:   true,
             method: "POST",
         };
         await inquireBrand(options, name, type);
     };
}

function nameGenerator(seeds) {
    let names = [];
    _.forEach(seeds, (head) => {
        _.forEach(seeds, (tail) => names.push(head + tail));
    });
    return names;
}

const seeds = '卓美宫蝶云万如双致简子美伊子天尹星秋梦兰长欧枫千语';
type = 20;  // 家具
const names = nameGenerator(seeds);
console.log(names);

batchInquireBrand(names, type);










/* /*body:   {
                "aggreQueryList":[{"key":"cls"},{"key":"year"},{"key":"lawStatus"}],
                "currentPage":0,
                "database":"trademark",
                "likeQueryList":[{"field":"name","fieldValue":name},{"field":"cls","fieldValue":type},{"field":"year","fieldValue":""},{"field":"lawStatus","fieldValue":""},{"field":"exactRegno","fieldValue":""},{"field":"applyName","fieldValue":""}],
                "sortList":[{"field":"cls","fieldValue":""},{"field":"applyDate","fieldValue":""}],
                "pageSize":1000,
                "table":"summary"
            },*/