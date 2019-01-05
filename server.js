const Koa    = require('koa');
const fs     = require('fs');
const Brand  = require('./brand');
const Router = require('koa-router');
const logger = require("koa-logger");
const parser = require('koa-bodyparser');

const router    = Router();
router.get('/', async(ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./resource/page.html');
});
router.post('/', async(ctx, next) => {
    await next();

    let {category, categoryName, name} = ctx.request.body;
    let brand = new Brand();
    console.log("body: {", category, categoryName, name, "}");

    let data = await brand.inquire(name, category, categoryName);
    ctx.response.status = 200;
    ctx.response.body = data;
    console.log(data);
});

const app    = new Koa();
app.use(logger());
app.use(parser());
app.use(router.routes());
app.listen(3000);
console.log('service(port: 3000) is running...');

/*
const name = '福民', type = 21;
let brand = new Brand();
async function test() {
   console.log(await brand.inquire(name, type, "type"));
};
test();
*/

//const Generator = require('./Generator/generator');
/*
const seeds = '卓美美宫蝶云万如双致简子伊天尹星秋梦兰长欧枫千语';
 type = 21;  // 家具
const brand  = new Brand();
//const generator = new Generator();
brand.batchInquire(['卓美'], type); */






/*
var items = [ {name: '没没', items: [{company: 'ddd', no:'1212', status: '注册'}] },
{name: '声所', items: [{company: 'ddd', no:'1212', status: '未注册'}, {company: 'cccc', no:'1212', status: '注册'}] }];
*/








/*if (0 == items.length) {
    console.log("商标名: " + name + "  商标分类: " + type + "-家具  状态:  未注册");
} else {
    items.forEach((item) => {
       console.log("商标名: " + name + "  商标分类: " + type + "-家具  状态:  " + item['process'] +
                   "(注册公司: " + item['applynamecn'] + "  注册号: " + item['regno'] +")");
    });
}
resolve(true);*/