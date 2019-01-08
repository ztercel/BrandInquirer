const fs    = require('fs');
const _     = require('lodash');
const Brand = require('./brand');
const Named = require('./named');
let named = new Named();
let brand = new Brand();

function introduction(names, category, categoryName, path, LINE = 120) {
    console.log('-'.repeat(LINE));
    console.log(`商标所属类型: ${categoryName}[${category}]`);
    console.log(`需搜索商标名: ${names.length}个\n[${names}]`);
    console.log('-'.repeat(LINE));
    console.log(_.padStart("搜索中，慢慢等...", 60));
    console.log(`搜索结果路径: ${path}`);
    console.log('='.repeat(LINE));
}

function epilogue(LINE=120) {
    console.log('~'.repeat(LINE));
    console.log("终于搜索完了，累死宝宝!");
    console.log('~'.repeat(LINE));
}

function readSeeds(filePath) {
    let data = '';
    if (filePath) {
        data = fs.readFileSync(filePath, {encoding: 'UTF-8'});
    }
    return data;
}

function output(source, dstFile, posFile, tmpFile) {
    let index = 0;
    let count = 0;
    if (fs.existsSync(posFile)) {
        let pos = JSON.parse(fs.readFileSync(posFile).toString());
        index = pos.index;
        count = pos.count;
    }
    return (item) => {
            let record = '';
            record += _.padEnd(`商标名: ${item['tradename']}`, 10) + '\t';
            record += _.padEnd(`状态: ${item['process']}`, 10) + '\t';
            record += _.padEnd(`类型: ${item['clsname'] || ''}`, 15) + '\t';
            record += _.padEnd(`编码: ${item['regno'] || ''}`, 15) + '\t';
            record += _.padEnd(`公司: ${item['applynamecn'] || ''}`, 100) + '\t';
            if (item['process'] != '已注册') {
                count++;
                let content = _.padEnd(count, 5) + '\t' + record + '\n';
                fs.appendFile(dstFile, content, () => {});
                //console.log(content);
            }
            index++;
            let print = _.padEnd(index, 5) + '\t' + record;
            console.log(print);

            fs.writeFile(posFile, JSON.stringify({index, count}), ()=> {});
            fs.appendFile(tmpFile, item['tradename'] + ' ', () => {});
    }
}

async function app() {
    const CATEGORY  = 20;
    const CATENAME  = '20-非金制品';

    // 获取候选词文件路径以及输出文件目录
    let destDir = __dirname + '/doc/';
    let tempDir = __dirname + '/tmp/';
    let srcFile = __dirname + '/doc/seeds.txt';
    let dstFile = destDir + '/brands.txt';
    let sdsFile = tempDir + '/~sds.txt';
    let posFile = tempDir + '/~pos.txt';
    let tmpFile = tempDir + '/~tmp.txt';

    let seeds = readSeeds(srcFile);
    if (seeds) {
        console.log('*'.repeat(120));
        console.log(`原始候选词: ${seeds.length}个\n[${seeds}]`);
        let result = named.named(seeds);
        console.log(`有效候选词: ${result.seeds.length}个\n[${result.seeds}]`);

        // 保存候选词
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // 本次运算的候选词有无发生变更
        if (fs.existsSync(sdsFile)) {
            let sds = fs.readFileSync(sdsFile).toString();
            if (sds != seeds) {
                fs.unlinkSync(sdsFile);
                fs.unlinkSync(posFile);
                fs.unlinkSync(tmpFile);
            }
        } else {
            fs.writeFileSync(sdsFile, seeds);
        }

        let searchNames = result.names;
        if (fs.existsSync(tmpFile)){
            let array = _.split(_.trim(fs.readFileSync(tmpFile).toString()), ' ');
            searchNames = _.xor(array, result.names);
        }

        introduction(result.names, CATEGORY, CATENAME, dstFile);
        await brand.batchSearch(searchNames, CATEGORY, output(result.names, dstFile, posFile, tmpFile));
        epilogue();
    } else {
        console.log(`候选词不能为空, 检查文件: ${srcFile}`);
    }
}
app();