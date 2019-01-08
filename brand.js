const fs = require('fs');
const _ = require('lodash');
const requester = require('request-promise');

class Brand {
    async inquire(name, category) {
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
                        if (items.length)  { // 找到相同的名字返回结果
                            items = items.filter((item) => (_.includes(['已注册', '无效', '其他'], item['process'].trim())))
                                         .map((item) => _.pick(item, ['tradename', 'clsname', 'process', 'regno', 'applynamecn']));
                        }
                    }
                    if (!items.length) {
                        items[0] = {tradename: name, process: '未注册'};
                    }
                    resolve({name, items});
                })
                .catch((err) => {
                    console.log(err);
                    resolve(false);
                });
        });
    }

    async batchSearch(names, category, output) {
        for (let name of names) {
            let names = await this.inquire(name, category);
            _(names).get('items').map((item) => {
                output(item);
            });
        }
    }
}

module.exports = Brand;
