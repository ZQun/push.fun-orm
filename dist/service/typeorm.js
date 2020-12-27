"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typeorm = void 0;
const decorator_1 = require("@midwayjs/decorator");
const typeorm_1 = require("typeorm");
const init_1 = require("../lib/init");
const dist_1 = require("midway-tool/dist");
let Typeorm = class Typeorm {
    constructor() {
        this.entityManager = typeorm_1.getManager();
    }
    async Get(Entity, options, transaction) {
        // 判断options类型是否为对象
        // let isOptionsObject: boolean = options && typeof options === 'object' && !Array.isArray(options);
        let isOptionsObject = this.ctx.is.Object(options);
        // 判断options类型是否为数组
        // let isOptionsArray: boolean = options && typeof options === 'object' && Array.isArray(options);
        let isOptionsArray = this.ctx.is.Array(options);
        // 判断options类型是否为数值
        // let isOptionsNumber: boolean = options && typeof options === 'number';
        let isOptionsNumber = this.ctx.is.Number(options);
        // TODO: 2.解析where exec queryBuilder方法
        const parseWhere = async (opt) => {
            // 如果没有传options 直接返回
            if (!opt)
                return;
            let name = this.tool.parseClassName(Entity);
            let sql = this.entityManager
                .createQueryBuilder(Entity, name);
            // 尽量与find用法对标～
            const tool = {
                In: (value, key, i, ii, str, boot) => {
                    let data = {
                        str: ``,
                        data: {}
                    };
                    let inkey = ``;
                    let uuid = this.nanoid.setId(6);
                    for (let i = 0, length = value.length; i < length; i++) {
                        data.data[`in_${uuid}_${i}`] = value[i];
                        if (!i) {
                            inkey = `:in_${uuid}_${i}`;
                        }
                        else {
                            inkey += `, :in_${uuid}_${i}`;
                        }
                    }
                    if (i === 1 && ii === 1) {
                        data.str = `${name}.${key} IN(${inkey})`;
                    }
                    else {
                        data.str = `${str} AND ${name}.${key} IN(${inkey})`;
                    }
                    // 数组嵌套内对象
                    if (boot) {
                        data.str = `${name}.${key} IN(${inkey})`;
                    }
                    return data;
                },
                Between: (value, key, i, ii, str, boot) => {
                    let data = {
                        str: ``,
                        data: {}
                    };
                    let uuid = this.nanoid.setId(6);
                    data.data[`bet_${uuid}_0`] = value[0];
                    data.data[`bet_${uuid}_1`] = value[1];
                    console.log('i: ', i);
                    console.log('ii: ', ii);
                    if (i === 1 && ii === 1) {
                        data.str = `${name}.${key} BETWEEN :bet_${uuid}_0 AND :bet_${uuid}_1`;
                    }
                    else {
                        data.str = `${str} AND ${name}.${key} BETWEEN :bet_${uuid}_0 AND :bet_${uuid}_1`;
                    }
                    // 数组嵌套内对象
                    if (boot) {
                        data.str = `${name}.${key} BETWEEN :bet_${uuid}_0 AND :bet_${uuid}_1`;
                    }
                    return data;
                },
                Not: (value, key, i, ii, str, boot) => {
                    let data = {
                        str: ``,
                        data: {}
                    };
                    let uuid = this.nanoid.setId(6);
                    data.data[`not_${uuid}`] = value;
                    if (i === 1 && ii === 1) {
                        data.str = `${name}.${key} != :not_${uuid}`;
                    }
                    else {
                        data.str = `${str} AND ${name}.${key} != :not_${uuid}`;
                    }
                    // 数组嵌套内对象
                    if (boot) {
                        data.str = `${name}.${key} != :not_${uuid}`;
                    }
                    return data;
                }
            };
            const whereToString = (whereStatus) => {
                // options参数转化
                let keyToObj = (obj) => {
                    let i = 0;
                    let whereObj = {};
                    let whereStr = ``;
                    let linObj = obj;
                    const xunObj = obj;
                    for (let key in xunObj) {
                        i += 1; // 持续累加
                        if (linObj.hasOwnProperty(key) === true) {
                            // 判断当前value 属于什么类型
                            let value = linObj[key];
                            let data = {};
                            // 1 字符串或数字
                            if (typeof value === 'string' || typeof value === 'number') {
                                let keys = this.nanoid.setId(6);
                                if (i === 1) {
                                    whereStr = `${name}.${key} = :${keys}`;
                                }
                                else {
                                    whereStr = `(${whereStr}) AND ${name}.${key} = :${keys}`;
                                }
                                data[keys] = xunObj[key];
                                delete linObj[key];
                            }
                            // 2 数组
                            if (typeof value === 'object' && Array.isArray(value)) {
                                if (!Array.isArray(value[0])) {
                                    // 如果数组内为对象
                                    for (let s = 0, length = value.length; s < length; s++) {
                                        let objdata = value[s];
                                        if (typeof objdata === 'object' && !Array.isArray(objdata)) {
                                            let ii = 0;
                                            let valueLen = Object.keys(objdata).length;
                                            for (let objectKey in objdata) {
                                                ii += 1;
                                                if (objdata.hasOwnProperty(objectKey) === true) {
                                                    let objectValue = objdata[objectKey];
                                                    let val = tool[objectKey](objectValue, key, i, ii, whereStr, true);
                                                    // s 数组内对象循环次数
                                                    // ii 数组内对象内的属性循环次数
                                                    // valueLen 是数组内对象内的属性个数
                                                    // i 是where内对象属性循环次数
                                                    // s 才是用来判断执行到第几个对象属性！
                                                    // 说明当前对象执行的是第一个
                                                    if (s === 0 && i === 1 && ii === 1) {
                                                        if (valueLen === 1) {
                                                            // 说明只有一个
                                                            whereStr = `(${val.str})`;
                                                        }
                                                        if (valueLen > 1) {
                                                            // 说明不止有一个
                                                            whereStr = `(${val.str}`;
                                                        }
                                                    }
                                                    // 说明第一个对象内后续属性循环
                                                    if (s === 0 && i === 1 && ii !== 1) {
                                                        // 第一个数组内，第一个属性内，不是第一个对象
                                                        if (valueLen !== 1 && valueLen !== ii) {
                                                            // 说明执行第二个属性 不是最后一个
                                                            whereStr = `${whereStr} AND (${val.str})`;
                                                        }
                                                        if (valueLen === ii) {
                                                            // 说明执行到最后一个属性
                                                            whereStr = `${whereStr} AND (${val.str}))`;
                                                        }
                                                    }
                                                    // 第二个对象开始循环
                                                    if (s !== 0 && s + 1 !== value.length && i === 1 && ii === 1) {
                                                        // 需要判断当前第一个循环，是不是最后一个循环
                                                        if (valueLen === 1) {
                                                            // 说明只有一个
                                                            whereStr = `${whereStr} OR (${val.str})`;
                                                        }
                                                        if (valueLen > 1) {
                                                            // 说明不止有一个
                                                            whereStr = `${whereStr} OR (${val.str}`;
                                                        }
                                                    }
                                                    if (s !== 0 && s + 1 !== value.length && i === 1 && ii !== 1) {
                                                        if (valueLen !== 1 && valueLen !== ii) {
                                                            whereStr = `${whereStr} AND (${val.str})`;
                                                        }
                                                        if (valueLen === ii) {
                                                            whereStr = `${whereStr} AND (${val.str}))`;
                                                        }
                                                    }
                                                    // 最后一个对象循环
                                                    if (s !== 0 && s + 1 === value.length && i === 1 && ii === 1) {
                                                        // 需要判断当前第一个循环，是不是最后一个循环
                                                        if (valueLen === 1) {
                                                            // 说明只有一个
                                                            whereStr = `${whereStr} OR (${val.str})`;
                                                        }
                                                        if (valueLen > 1) {
                                                            // 说明不止有一个
                                                            whereStr = `${whereStr} OR (${val.str}`;
                                                        }
                                                    }
                                                    if (s !== 0 && s + 1 === value.length && i === 1 && ii !== 1) {
                                                        if (valueLen !== 1 && valueLen !== ii) {
                                                            whereStr = `${whereStr} AND (${val.str})`;
                                                        }
                                                        if (valueLen === ii) {
                                                            whereStr = `${whereStr} AND (${val.str}))`;
                                                        }
                                                    }
                                                    Object.assign(data, val.data);
                                                }
                                            }
                                        }
                                        if (typeof objdata === 'string' || typeof objdata === 'number') {
                                            let keys = this.nanoid.setId(6);
                                            if (!s) {
                                                // 第一个
                                                whereStr = `(${name}.${key} = :${keys})`;
                                            }
                                            else {
                                                // 说明不是第一个
                                                whereStr = `${whereStr} OR (${name}.${key} = :${keys})`;
                                            }
                                            data[keys] = xunObj[key][s];
                                        }
                                        if (s + 1 === value.length) {
                                            delete linObj[key];
                                        }
                                    }
                                }
                                if (typeof value[0] === 'object' && Array.isArray(value[0])) {
                                    // 数组为简化and写法
                                    let inkey = ``;
                                    for (let s = 0; s < value.length; s++) {
                                        if (!s) {
                                            inkey = `:${key + s}`;
                                        }
                                        else {
                                            inkey += `, :${key + s}`;
                                        }
                                        data[key + s] = value[s];
                                    }
                                    if (i === 1) {
                                        whereStr = `${name}.${key} IN(${inkey})`;
                                    }
                                    else {
                                        whereStr = `(${whereStr}) AND ${name}.${key} IN(${inkey})`;
                                    }
                                    delete linObj[key];
                                }
                            }
                            // 3 对象
                            if (typeof value === 'object' && !Array.isArray(value)) {
                                // 对象则解析对象体内的key
                                let ii = 0;
                                let valueLen = Object.keys(value).length;
                                for (let objectKey in value) {
                                    ii += 1;
                                    if (value.hasOwnProperty(objectKey) === true) {
                                        // FIXME: 支持多种操作符操作,不同操作符间为 AND
                                        let objectValue = value[objectKey];
                                        let val = tool[objectKey](objectValue, key, i, ii, whereStr);
                                        whereStr = val.str;
                                        Object.assign(data, val.data);
                                        delete linObj[key][objectKey];
                                        if (ii === valueLen) {
                                            delete linObj[key];
                                            if (whereObj[key]) {
                                                delete whereObj[key];
                                            }
                                        }
                                    }
                                }
                            }
                            Object.assign(whereObj, linObj, data);
                        }
                    }
                    console.log('-->where', { whereStr, whereObj });
                    return { whereStr, whereObj };
                };
                let obj = null;
                if (whereStatus === 'where') {
                    obj = opt.where;
                    return keyToObj(obj);
                }
                if (whereStatus === 'array') {
                    obj = opt.where;
                    let arr = [];
                    for (let i = 0, length = obj.length; i < length; i++) {
                        let get = keyToObj(obj[i]);
                        arr.push(get);
                    }
                    return arr;
                }
                if (whereStatus === 'noWhere') {
                    obj = opt;
                    // 阻止传入type && where
                    if (obj.type)
                        delete obj.type;
                    if (obj.where)
                        delete obj.where;
                    return keyToObj(obj);
                }
            };
            // 如果传入的options是对象不是数组
            if (opt && typeof opt === 'object' && !Array.isArray(opt)) {
                let ws = {
                    whereStr: '',
                    whereObj: {}
                };
                // 判断对象体内是否有 where
                if (opt.where && typeof opt.where === 'object' && !Array.isArray(opt.where)) {
                    // 如果有where直接遍历where下属性
                    ws = whereToString('where');
                }
                // 判断opt.where是否为数组
                // 并且数组内是否存在对象
                if (opt.where && typeof opt.where === 'object' && Array.isArray(opt.where)) {
                    // 如果是数组，判断数组内是否有对象
                    let s = [];
                    let a = {
                        whereStr: '',
                        whereObj: {}
                    };
                    if (typeof opt.where[0] === 'object' && !Array.isArray(opt.where[0])) {
                        s = whereToString('array');
                    }
                    else {
                        // 此处说明是空数组 []
                        s = [{ whereStr: '', whereObj: {} }];
                    }
                    for (let i = 0, length = s.length; i < length; i++) {
                        if (!i) {
                            a.whereStr = `(${s[i].whereStr})`;
                        }
                        else {
                            a.whereStr = `${a.whereStr} OR (${s[i].whereStr})`;
                        }
                        Object.assign(a.whereObj, s[i].whereObj);
                    }
                    ws = a;
                }
                // 如果没有where 直接遍历options下属性
                if (!opt.where && opt.type !== 'page') {
                    // 此配置会将type 和 where字段变为数据库限制字段！
                    ws = whereToString('noWhere');
                }
                // page分页
                if (opt.type === 'page') {
                    const page = opt.page;
                    const countPage = opt.count;
                    const limit = countPage;
                    const offset = countPage * (page - 1);
                    return sql
                        .where(ws.whereStr, ws.whereObj)
                        .take(limit)
                        .skip(offset)
                        .getManyAndCount();
                }
                // count总条数
                if (opt.type === 'count') {
                }
                return sql
                    .where(ws.whereStr, ws.whereObj)
                    .getMany();
            }
            // TODO: 如果传入的options是数组
            if (opt && typeof opt === 'object' && Array.isArray(opt)) {
                // 并且数组内的参数为 number
                // 根据数组内参数进行查询 id
                // ***大概率执行不到这里***
            }
        };
        // type 部分
        const Type = {
            all: async () => {
                return await parseWhere(options);
            },
            one: async () => {
                let opt = {};
                if (isOptionsNumber) {
                    opt = options;
                }
                if (isOptionsObject) {
                    let opt = options;
                    if (opt.where && typeof opt.where === 'object') {
                        opt = opt.where;
                    }
                }
                return await this.entityManager.findOne(Entity, opt);
            },
            arr: async () => {
                let opt = options;
                return await this.entityManager.findByIds(Entity, opt);
            },
            page: async () => {
                let opt = options;
                if (!opt.page)
                    opt.page = 1;
                if (!opt.count)
                    opt.count = 20;
                return await parseWhere(opt);
            },
            count: () => {
                // 查询总条数
                console.log('---count');
            }
        };
        let optionsType = 'all';
        // 如果options中设置type则根据类型查询
        if (isOptionsObject) {
            let opt = options;
            if (opt.type)
                optionsType = opt.type;
            // FIXME:  此处逻辑大概有问题！   判断是否有where 执行单条筛选查询
            // if(!(opt.where && typeof opt.where === 'object')) optionsType = 'one'
        }
        // 如果options为数组，执行数组id查询
        if (isOptionsArray)
            optionsType = 'arr';
        // one 如果options为数值，直接执行单条查询
        if (isOptionsNumber)
            optionsType = 'one';
        // exec get
        const data = await Type[optionsType]();
        return data;
        // 1. all
        // 获取该实体下全部all数据列表
        // this.SQL.Get(Photo)
        // 2. one
        // 获取单个数据，支持根据id查询
        // this.SQL.Get(Photo, 99)
        // 如果options为直传id，则取单条
        // this.SQL.Get(Photo, [1,2,99])
        // 如果传入为数组，则取数组内所有id列表
        // this.SQL.Get(Photo, { where: { id: 99 } })
        // 通过where对象获取id条件
        // this.SQL.Get(Photo, { where: { id: [1,2,99] } })
        // 通过where对象内数组参数，获取数组内id列表
        // this.SQL.Get(Photo, { where: { name: ['lee', 'wu'] } })
        // 顺带将where下其他属性对应的数组也依次查询遍历
        // 3. page
        // this.SQL.Get(Photo, {
        //     type: 'page',
        //     page: 1,
        //     count: 20
        // })
        // 4. count
        // this.SQL.Get(Photo, {
        //     type: 'count'
        // })
        // where 筛选和运算符
        // this.SQL.Get(Photo, { where: { 
        // 百分号like模糊查询类型
        // name: { like: '%xxx%' }
        // 仿照sequelize运算符验证方法
        // name: {  }
        // } })
        // order 排序
        // this.SQL.Get(Photo, {
        //     order: {
        //         id: 'DESC'
        //     }
        // })
        // include 关联表查询
        // this.SQL.Get(Photo, {
        //     include: [
        //         {
        //             model: User,
        //             where: {},
        //             order: {}
        //         }
        //     ]
        // })
    }
    async Add() {
    }
    async Update() {
    }
    async Delete() {
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], Typeorm.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject('initLib'),
    __metadata("design:type", init_1.InitLib)
], Typeorm.prototype, "init", void 0);
__decorate([
    decorator_1.Inject('TOOL:nanoid'),
    __metadata("design:type", dist_1.Nanoid)
], Typeorm.prototype, "nanoid", void 0);
__decorate([
    decorator_1.Inject('TOOL:tool'),
    __metadata("design:type", dist_1.Tool)
], Typeorm.prototype, "tool", void 0);
__decorate([
    decorator_1.Config(),
    __metadata("design:type", Object)
], Typeorm.prototype, "sequelize", void 0);
Typeorm = __decorate([
    decorator_1.Provide()
], Typeorm);
exports.Typeorm = Typeorm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZW9ybS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvUXVuL1VuY2x1dHRlci/kuZ3ms7Doja/kuJrpobnnm64vc2VydmVyL3NyYy9jb21wb25lbnRzL21pZHdheS1vcm0tc3FsL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZpY2UvdHlwZW9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtREFBbUU7QUFDbkUscUNBQWlFO0FBRWpFLHNDQUFxQztBQUNyQywyQ0FBK0M7QUFHL0MsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBTztJQUFwQjtRQWlCWSxrQkFBYSxHQUFHLG9CQUFVLEVBQUUsQ0FBQTtJQXdrQnhDLENBQUM7SUFuZkcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFXLEVBQUUsT0FBeUMsRUFBRSxXQUFpQjtRQUUvRSxtQkFBbUI7UUFDbkIsb0dBQW9HO1FBQ3BHLElBQUksZUFBZSxHQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMxRCxtQkFBbUI7UUFDbkIsa0dBQWtHO1FBQ2xHLElBQUksY0FBYyxHQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4RCxtQkFBbUI7UUFDbkIseUVBQXlFO1FBQ3pFLElBQUksZUFBZSxHQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUUxRCxzQ0FBc0M7UUFDdEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUFFLEdBQVEsRUFBRSxFQUFFO1lBRWxDLG9CQUFvQjtZQUNwQixJQUFHLENBQUMsR0FBRztnQkFBRSxPQUFNO1lBRWYsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFbkQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWE7aUJB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