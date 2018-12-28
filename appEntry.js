const Koa    = require('koa');
const fs     = require('fs');
const Router = require('koa-router');

const router    = Router();
router.get('/', async(ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./resource/page.html');
});
router.post('/', async(ctx, next) => {
   ctx.response.body = 'good';
});

const app    = new Koa();
app.use(router.routes());
app.listen(3000);

console.log('service is running...');
/*

const Inquirer  = require('./Inquirer/inquirer');
const Generator = require('./Generator/generator');

const seeds = '卓美';//美宫蝶云万如双致简子伊天尹星秋梦兰长欧枫千语';
 type = 20;  // 家具
const inquirer  = new Inquirer();
const generator = new Generator();
inquirer.inquire(generator.generate(seeds), type);
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