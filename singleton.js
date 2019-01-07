
const _     = require('lodash');
const Brand = require('./brand');
const Named = require('./named');
let named = new Named();
let brand = new Brand();
/*
 let source = process.argv.slice(2).toString();
    let seeds = source;
     let type = 20;
 */

async function searchBrand(names, type, out) {
    let data = await brand.batchInquire(names, type, "20类-非金制品", console.log);

};

function introduction(names, category, categoryName, path, LINE = 120) {
    console.log('-'.repeat(LINE));
    console.log(`商标类型: ${categoryName}[${category}]`);
    console.log(`搜索商标: ${names.length}\n[${names}]`);
    console.log(`搜索结果: ${path}`);
    console.log('-'.repeat(LINE));
    console.log(_.padStart("搜索中，慢慢等...", 60));
    console.log('='.repeat(LINE));
}

function over(LINE=120) {
    console.log('~'.repeat(LINE));
    console.log("终于搜索完了，累死宝宝!");
    console.log('~'.repeat(LINE));
}

function app() {
    const CATEGORY  = 20;
    const CATENAME  = '20-非金制品';

    let destDir = 'c:/';
    let srcFile = '';
    if (process.argv.length > 3) {
         srcFile = process.argv[2].toString();
         destDir = process.argv[3].toString();
    }
    console.log("=====> src: " + srcFile + "   destDir: " + destDir);

    let seeds   = '中办人';
    let names   = named.named(seeds);
    let path    = process.cwd() + '/brands.xls';

    introduction(names, CATEGORY, CATENAME, path);

    const writer = require('fs');
    let stream = writer.createWriteStream('./output.txt');
    stream.write('adsfasdf', 'UTF-8');
    stream.end();

    let data = [];
    const fs    = require('fs');

    over();
}

app();
