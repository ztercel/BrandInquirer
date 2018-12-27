const _ = require('lodash');

class Generator {
    generate(seeds) {
        let names = [];
        seeds = _.uniq(seeds);
        _.forEach(seeds, (head) => {
            _.forEach(seeds, (tail) => names.push(head + tail));
        });
        return names;
    }
};

module.exports = Generator;