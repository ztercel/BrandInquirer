const _ = require('lodash');
const requester = require('request-promise');

class Brand {
    async inquire(name, category, categoryName) {
        const options = {
            uri: "https://www.iptop.cn/search/services/tmsearch/searchTm",
            body: {
                "likeQueryList": [{"field": "name", "fieldValue": name}, {"field": "cls", "fieldValue": category}],
                "pageSize": 1000,
            },
            json: true,
            method: "POST",
        };
        return new Promise((resolve) => {
            requester(options)
                .then((body) => {
                    let items   = [];
                    let list    = _(body).get('result.list');
                    if (list) {
                        items = list.filter((item) => (item['tradename'].trim() == name.trim()));
                        if (items.length) {  // 找到相同的名字返回结果
                            items = items.filter((item) => (_.includes(['已注册', '无效', '其他'], item['process'].trim())))
                                         .map((item) => _.pick(item, ['tradename', 'clsname', 'process', 'regno', 'applynamecn']));
                        }
                    }
                    if (!items.length) {
                        items[0] = {process: '未注册', clsname: categoryName};
                    }
                    resolve({name, items});
                })
                .catch((err) => {
                    console.log(err);
                    resolve(false);
                });
        });
    }

    async batchInquire(names, category, categoryName) {
        for (let name of names) {
            console.log(await this.inquire(name, category, categoryName));
        }
    }
};

module.exports = Brand;
