const _ = require('lodash');
const requester = require('request-promise');

class Inquirer {
    async inquireBrand(options, name, type) {
        return new Promise((resolve) => {
            requester(options)
                .then((body) => {
                    var items = _(body).get('result.list')
                        .filter((item) => (item['tradename'].trim() == name.trim()))
                        .filter((item) => (_.includes(['无效', '其他'], item['process'].trim())))
                        .map((item) => _.pick(item, ['tradename', 'clsname', 'process', 'regno', 'applynamecn']));
                    resolve({name, items});
                })
                .catch((err) => {
                    console.log(err);
                    resolve(false);
                });
        });
    }

    async inquire(names, type) {
        for (let name of names) {
            const options = {
                uri: "https://www.iptop.cn/search/services/tmsearch/searchTm",
                body: {
                    "likeQueryList": [{"field": "name", "fieldValue": name}, {"field": "cls", "fieldValue": type}],
                    "pageSize": 1000,
                },
                json: true,
                method: "POST",
            };
            console.log(await this.inquireBrand(options, name, type));
        }
    }
};

module.exports = Inquirer;

