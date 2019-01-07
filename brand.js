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

    async batchInquire(names, category, categoryName, out) {
        let data = [];
        const fs    = require('fs');
        fs.open(path, 'w+', (err, fd) => {});

        let index = 0;
        let count = 0;

        ++index;
        let record = '';
        record += _.padEnd(`商标名: ${name}`, 10) + '\t';
        record += _.padEnd(`类型: ${item['clsname']}`, 15) + '\t';
        record += _.padEnd(`状态: ${item['process']}`, 10) + '\t';
        record += _.padEnd(`编码: ` + (item['regno'] ? item['regno'] : ''), 15) + '\t';
        record += _.padEnd(`公司: ` + (item['applynamecn'] ? item['applynamecn'] : ''), 100) + '\t';
        if (item['process'] != '已注册') {
            count++;
            let content = _.padEnd(count, 5) + '\t' + record + '\n';
            await fs.appendFile(path, content, () => {});
        }
        let print = _.padEnd(index, 5) + '\t' + record;
        data.push(print);
        out(print);
        for (let name of names) {
            let names = await this.inquire(name, category, categoryName);
            let items = _(names).get('items');
            for (let item of items) {
                out(items);
            }
        }
        return data;
    }
}

module.exports = Brand;
