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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZW9ybS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvUXVuL1VuY2x1dHRlci/kuZ3ms7Doja/kuJrpobnnm64vc2VydmVyL3NyYy9jb21wb25lbnRzL21pZHdheS1vcm0tc3FsL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZpY2UvdHlwZW9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtREFBbUU7QUFDbkUscUNBQWlFO0FBRWpFLDJDQUErQztBQUcvQyxJQUFhLE9BQU8sR0FBcEIsTUFBYSxPQUFPO0lBQXBCO1FBY1ksa0JBQWEsR0FBRyxvQkFBVSxFQUFFLENBQUE7SUF3a0J4QyxDQUFDO0lBbmZHLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBVyxFQUFFLE9BQXlDLEVBQUUsV0FBaUI7UUFFL0UsbUJBQW1CO1FBQ25CLG9HQUFvRztRQUNwRyxJQUFJLGVBQWUsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUQsbUJBQW1CO1FBQ25CLGtHQUFrRztRQUNsRyxJQUFJLGNBQWMsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEQsbUJBQW1CO1FBQ25CLHlFQUF5RTtRQUN6RSxJQUFJLGVBQWUsR0FBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFMUQsc0NBQXNDO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFBRSxHQUFRLEVBQUUsRUFBRTtZQUVsQyxvQkFBb0I7WUFDcEIsSUFBRyxDQUFDLEdBQUc7Z0JBQUUsT0FBTTtZQUVmLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRW5ELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhO2lCQUN2QixrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFckMsZUFBZTtZQUNmLE1BQU0sSUFBSSxHQUFHO2dCQUNULEVBQUUsRUFBRSxDQUFDLEtBQW9CLEVBQUUsR0FBVyxFQUFFLENBQVMsRUFBRSxFQUFVLEVBQUUsR0FBVyxFQUFFLElBQWEsRUFBRSxFQUFFO29CQUN6RixJQUFJLElBQUksR0FBRzt3QkFDUCxHQUFHLEVBQUUsRUFBRTt3QkFDUCxJQUFJLEVBQUUsRUFBRTtxQkFDWCxDQUFBO29CQUNELElBQUksS0FBSyxHQUFXLEVBQUUsQ0FBQTtvQkFDdEIsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ3ZDLEtBQUksSUFBSSxDQUFDLEdBQVUsQ0FBQyxFQUFFLE1BQU0sR0FBVyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2xFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7d0JBQ3ZDLElBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQ0gsS0FBSyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFBO3lCQUM3Qjs2QkFBTTs0QkFDSCxLQUFLLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUE7eUJBQ2hDO3FCQUNKO29CQUNELElBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO3dCQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLEdBQUcsQ0FBQTtxQkFDM0M7eUJBQU07d0JBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsUUFBUSxJQUFJLElBQUksR0FBRyxPQUFPLEtBQUssR0FBRyxDQUFBO3FCQUN0RDtvQkFDRCxVQUFVO29CQUNWLElBQUcsSUFBSSxFQUFFO3dCQUNMLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxPQUFPLEtBQUssR0FBRyxDQUFBO3FCQUMzQztvQkFDRCxPQUFPLElBQUksQ0FBQTtnQkFDZixDQUFDO2dCQUNELE9BQU8sRUFBRSxDQUFDLEtBQW9CLEVBQUUsR0FBVyxFQUFFLENBQVMsRUFBRSxFQUFVLEVBQUUsR0FBVyxFQUFFLElBQWEsRUFBRSxFQUFFO29CQUM5RixJQUFJLElBQUksR0FBRzt3QkFDUCxHQUFHLEVBQUUsRUFBRTt3QkFDUCxJQUFJLEVBQUUsRUFBRTtxQkFDWCxDQUFBO29CQUNELElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN4QixJQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3QkFDcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxHQUFHLGlCQUFpQixJQUFJLGVBQWUsSUFBSSxJQUFJLENBQUE7cUJBQ3hFO3lCQUFNO3dCQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFFBQVEsSUFBSSxJQUFJLEdBQUcsaUJBQWlCLElBQUksZUFBZSxJQUFJLElBQUksQ0FBQTtxQkFDbkY7b0JBQ0QsVUFBVTtvQkFDVixJQUFHLElBQUksRUFBRTt3QkFDTCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsaUJBQWlCLElBQUksZUFBZSxJQUFJLElBQUksQ0FBQTtxQkFDeEU7b0JBQ0QsT0FBTyxJQUFJLENBQUE7Z0JBQ2YsQ0FBQztnQkFDRCxHQUFHLEVBQUUsQ0FBQyxLQUFzQixFQUFFLEdBQVcsRUFBRSxDQUFTLEVBQUUsRUFBVSxFQUFFLEdBQVcsRUFBRSxJQUFhLEVBQUUsRUFBRTtvQkFDNUYsSUFBSSxJQUFJLEdBQUc7d0JBQ1AsR0FBRyxFQUFFLEVBQUU7d0JBQ1AsSUFBSSxFQUFFLEVBQUU7cUJBQ1gsQ0FBQTtvQkFDRCxJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFBO29CQUNoQyxJQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3QkFDcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxHQUFHLFlBQVksSUFBSSxFQUFFLENBQUE7cUJBQzlDO3lCQUFNO3dCQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFFBQVEsSUFBSSxJQUFJLEdBQUcsWUFBWSxJQUFJLEVBQUUsQ0FBQTtxQkFDekQ7b0JBQ0QsVUFBVTtvQkFDVixJQUFHLElBQUksRUFBRTt3QkFDTCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsWUFBWSxJQUFJLEVBQUUsQ0FBQTtxQkFDOUM7b0JBQ0QsT0FBTyxJQUFJLENBQUE7Z0JBQ2YsQ0FBQzthQUNKLENBQUE7WUFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLFdBQW1CLEVBQU8sRUFBRTtnQkFDL0MsY0FBYztnQkFDZCxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO29CQUMzQixJQUFJLENBQUMsR0FBVyxDQUFDLENBQUE7b0JBQ2pCLElBQUksUUFBUSxHQUFXLEVBQUUsQ0FBQTtvQkFDekIsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFBO29CQUN6QixJQUFJLE1BQU0sR0FBVyxHQUFHLENBQUE7b0JBQ3hCLE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQTtvQkFDMUIsS0FBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7d0JBQ25CLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxPQUFPO3dCQUNkLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUU7NEJBQ3BDLG1CQUFtQjs0QkFDbkIsSUFBSSxLQUFLLEdBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBOzRCQUM1QixJQUFJLElBQUksR0FBVyxFQUFFLENBQUE7NEJBRXJCLFdBQVc7NEJBQ1gsSUFBRyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO2dDQUN2RCxJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQ0FDdkMsSUFBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO29DQUNSLFFBQVEsR0FBRyxHQUFHLElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUE7aUNBQ3pDO3FDQUFNO29DQUNILFFBQVEsR0FBRyxJQUFJLFFBQVEsU0FBUyxJQUFJLElBQUksR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO2lDQUMzRDtnQ0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dDQUN4QixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTs2QkFDckI7NEJBRUQsT0FBTzs0QkFDUCxJQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dDQUNsRCxJQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQ0FDekIsV0FBVztvQ0FDWCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dDQUNuRCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7d0NBQ3RCLElBQUcsT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTs0Q0FDdkQsSUFBSSxFQUFFLEdBQVcsQ0FBQyxDQUFBOzRDQUNsQixJQUFJLFFBQVEsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQTs0Q0FDbEQsS0FBSSxJQUFJLFNBQVMsSUFBSSxPQUFPLEVBQUU7Z0RBQzFCLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0RBQ1AsSUFBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtvREFDM0MsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO29EQUNwQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtvREFDbEUsY0FBYztvREFDZCxtQkFBbUI7b0RBQ25CLHdCQUF3QjtvREFDeEIsb0JBQW9CO29EQUNwQixzQkFBc0I7b0RBRXRCLGdCQUFnQjtvREFDaEIsSUFBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3REFDL0IsSUFBRyxRQUFRLEtBQUssQ0FBQyxFQUFFOzREQUNmLFNBQVM7NERBQ1QsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO3lEQUM1Qjt3REFDRCxJQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUU7NERBQ2IsVUFBVTs0REFDVixRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7eURBQzNCO3FEQUNKO29EQUNELGlCQUFpQjtvREFDakIsSUFBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3REFDL0Isd0JBQXdCO3dEQUN4QixJQUFHLFFBQVEsS0FBSyxDQUFDLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTs0REFDbEMsbUJBQW1COzREQUNuQixRQUFRLEdBQUcsR0FBRyxRQUFRLFNBQVMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO3lEQUM1Qzt3REFDRCxJQUFHLFFBQVEsS0FBSyxFQUFFLEVBQUU7NERBQ2hCLGNBQWM7NERBQ2QsUUFBUSxHQUFHLEdBQUcsUUFBUSxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTt5REFDN0M7cURBQ0o7b0RBRUQsWUFBWTtvREFDWixJQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3REFDekQsd0JBQXdCO3dEQUN4QixJQUFHLFFBQVEsS0FBSyxDQUFDLEVBQUU7NERBQ2YsU0FBUzs0REFDVCxRQUFRLEdBQUcsR0FBRyxRQUFRLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO3lEQUMzQzt3REFDRCxJQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUU7NERBQ2IsVUFBVTs0REFDVixRQUFRLEdBQUcsR0FBRyxRQUFRLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO3lEQUMxQztxREFDSjtvREFDRCxJQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3REFDekQsSUFBRyxRQUFRLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7NERBQ2xDLFFBQVEsR0FBRyxHQUFHLFFBQVEsU0FBUyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7eURBQzVDO3dEQUNELElBQUcsUUFBUSxLQUFLLEVBQUUsRUFBRTs0REFDaEIsUUFBUSxHQUFHLEdBQUcsUUFBUSxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTt5REFDN0M7cURBQ0o7b0RBRUQsV0FBVztvREFDWCxJQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3REFDekQsd0JBQXdCO3dEQUN4QixJQUFHLFFBQVEsS0FBSyxDQUFDLEVBQUU7NERBQ2YsU0FBUzs0REFDVCxRQUFRLEdBQUcsR0FBRyxRQUFRLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO3lEQUMzQzt3REFDRCxJQUFHLFFBQVEsR0FBRyxDQUFDLEVBQUU7NERBQ2IsVUFBVTs0REFDVixRQUFRLEdBQUcsR0FBRyxRQUFRLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO3lEQUMxQztxREFDSjtvREFDRCxJQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTt3REFDekQsSUFBRyxRQUFRLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7NERBQ2xDLFFBQVEsR0FBRyxHQUFHLFFBQVEsU0FBUyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7eURBQzVDO3dEQUNELElBQUcsUUFBUSxLQUFLLEVBQUUsRUFBRTs0REFDaEIsUUFBUSxHQUFHLEdBQUcsUUFBUSxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTt5REFDN0M7cURBQ0o7b0RBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO2lEQUNoQzs2Q0FDSjt5Q0FDSjt3Q0FDRCxJQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7NENBQzNELElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBOzRDQUN2QyxJQUFHLENBQUMsQ0FBQyxFQUFFO2dEQUNILE1BQU07Z0RBQ04sUUFBUSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsT0FBTyxJQUFJLEdBQUcsQ0FBQTs2Q0FDM0M7aURBQU07Z0RBQ0gsVUFBVTtnREFDVixRQUFRLEdBQUcsR0FBRyxRQUFRLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTyxJQUFJLEdBQUcsQ0FBQTs2Q0FDMUQ7NENBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt5Q0FDOUI7d0NBQ0QsSUFBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7NENBQ3ZCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO3lDQUNyQjtxQ0FDSjtpQ0FDSjtnQ0FDRCxJQUFHLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29DQUN4RCxhQUFhO29DQUNiLElBQUksS0FBSyxHQUFXLEVBQUUsQ0FBQTtvQ0FDdEIsS0FBSSxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0NBQzFDLElBQUcsQ0FBQyxDQUFDLEVBQUU7NENBQ0gsS0FBSyxHQUFHLElBQUksR0FBRyxHQUFDLENBQUMsRUFBRSxDQUFBO3lDQUN0Qjs2Q0FBTTs0Q0FDSCxLQUFLLElBQUksTUFBTSxHQUFHLEdBQUMsQ0FBQyxFQUFFLENBQUE7eUNBQ3pCO3dDQUNELElBQUksQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO3FDQUN6QjtvQ0FDRCxJQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7d0NBQ1IsUUFBUSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLEdBQUcsQ0FBQTtxQ0FDM0M7eUNBQU07d0NBQ0gsUUFBUSxHQUFHLElBQUksUUFBUSxTQUFTLElBQUksSUFBSSxHQUFHLE9BQU8sS0FBSyxHQUFHLENBQUE7cUNBQzdEO29DQUNELE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lDQUNyQjs2QkFDSjs0QkFFRCxPQUFPOzRCQUNQLElBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQ0FDbkQsZ0JBQWdCO2dDQUNoQixJQUFJLEVBQUUsR0FBVyxDQUFDLENBQUE7Z0NBQ2xCLElBQUksUUFBUSxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFBO2dDQUNoRCxLQUFJLElBQUksU0FBUyxJQUFJLEtBQUssRUFBRTtvQ0FDeEIsRUFBRSxJQUFJLENBQUMsQ0FBQTtvQ0FDUCxJQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO3dDQUN6QywrQkFBK0I7d0NBQy9CLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTt3Q0FDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTt3Q0FDNUQsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUE7d0NBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTt3Q0FDN0IsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7d0NBQzdCLElBQUcsRUFBRSxLQUFLLFFBQVEsRUFBRTs0Q0FDaEIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7NENBQ2xCLElBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dEQUNkLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBOzZDQUN2Qjt5Q0FDSjtxQ0FDSjtpQ0FDSjs2QkFDSjs0QkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7eUJBQ3hDO3FCQUNKO29CQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7b0JBQ2hELE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUE7Z0JBQ2pDLENBQUMsQ0FBQTtnQkFFRCxJQUFJLEdBQUcsR0FBUSxJQUFJLENBQUE7Z0JBQ25CLElBQUcsV0FBVyxLQUFLLE9BQU8sRUFBRTtvQkFDeEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7b0JBQ2YsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ3ZCO2dCQUVELElBQUcsV0FBVyxLQUFLLE9BQU8sRUFBRTtvQkFDeEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7b0JBQ2YsSUFBSSxHQUFHLEdBQWtCLEVBQUUsQ0FBQTtvQkFDM0IsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDakQsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO3FCQUNoQjtvQkFDRCxPQUFPLEdBQUcsQ0FBQTtpQkFDYjtnQkFFRCxJQUFHLFdBQVcsS0FBSyxTQUFTLEVBQUU7b0JBQzFCLEdBQUcsR0FBRyxHQUFHLENBQUE7b0JBQ1Qsb0JBQW9CO29CQUNwQixJQUFHLEdBQUcsQ0FBQyxJQUFJO3dCQUFFLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQTtvQkFDNUIsSUFBRyxHQUFHLENBQUMsS0FBSzt3QkFBRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUE7b0JBQzlCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUN2QjtZQUNMLENBQUMsQ0FBQTtZQUVELHNCQUFzQjtZQUN0QixJQUFHLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUV0RCxJQUFJLEVBQUUsR0FBUTtvQkFDVixRQUFRLEVBQUUsRUFBRTtvQkFDWixRQUFRLEVBQUUsRUFBRTtpQkFDZixDQUFBO2dCQUVELGtCQUFrQjtnQkFDbEIsSUFBRyxHQUFHLENBQUMsS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDeEUsdUJBQXVCO29CQUN2QixFQUFFLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUM5QjtnQkFFRCxtQkFBbUI7Z0JBQ25CLGNBQWM7Z0JBQ2QsSUFBRyxHQUFHLENBQUMsS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3ZFLG1CQUFtQjtvQkFDbkIsSUFBSSxDQUFDLEdBQVEsRUFBRSxDQUFBO29CQUNmLElBQUksQ0FBQyxHQUFRO3dCQUNULFFBQVEsRUFBRSxFQUFFO3dCQUNaLFFBQVEsRUFBRSxFQUFFO3FCQUNmLENBQUE7b0JBQ0QsSUFBRyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ2pFLENBQUMsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7cUJBQzdCO3lCQUFNO3dCQUNILGNBQWM7d0JBQ2QsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO3FCQUN2QztvQkFDRCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMvQyxJQUFHLENBQUMsQ0FBQyxFQUFFOzRCQUNILENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUE7eUJBQ3BDOzZCQUFNOzRCQUNILENBQUMsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQTt5QkFDckQ7d0JBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtxQkFDM0M7b0JBQ0QsRUFBRSxHQUFHLENBQUMsQ0FBQTtpQkFDVDtnQkFFRCwyQkFBMkI7Z0JBQzNCLElBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29CQUNsQyxnQ0FBZ0M7b0JBQ2hDLEVBQUUsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUE7aUJBQ2hDO2dCQUVELFNBQVM7Z0JBQ1QsSUFBRyxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtvQkFDcEIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtvQkFDckIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtvQkFDM0IsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDO29CQUN4QixNQUFNLE1BQU0sR0FBRyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRXRDLE9BQU8sR0FBRzt5QkFDTCxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO3lCQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDO3lCQUNYLElBQUksQ0FBQyxNQUFNLENBQUM7eUJBQ1osZUFBZSxFQUFFLENBQUE7aUJBQ3pCO2dCQUVELFdBQVc7Z0JBQ1gsSUFBRyxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtpQkFFeEI7Z0JBRUQsT0FBTyxHQUFHO3FCQUNMLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUM7cUJBQy9CLE9BQU8sRUFBRSxDQUFBO2FBQ2pCO1lBQ0Qsd0JBQXdCO1lBQ3hCLElBQUcsR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNyRCxtQkFBbUI7Z0JBQ25CLGlCQUFpQjtnQkFDakIsa0JBQWtCO2FBQ3JCO1FBQ0wsQ0FBQyxDQUFBO1FBRUQsVUFBVTtRQUNWLE1BQU0sSUFBSSxHQUFXO1lBQ2pCLEdBQUcsRUFBRSxLQUFLLElBQUksRUFBRTtnQkFDWixPQUFPLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3BDLENBQUM7WUFDRCxHQUFHLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ1osSUFBSSxHQUFHLEdBQVEsRUFBRSxDQUFBO2dCQUNqQixJQUFHLGVBQWUsRUFBRTtvQkFDaEIsR0FBRyxHQUFHLE9BQU8sQ0FBQTtpQkFDaEI7Z0JBQ0QsSUFBRyxlQUFlLEVBQUU7b0JBQ2hCLElBQUksR0FBRyxHQUFRLE9BQU8sQ0FBQTtvQkFDdEIsSUFBRyxHQUFHLENBQUMsS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7d0JBQzNDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO3FCQUNsQjtpQkFDSjtnQkFDRCxPQUFPLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3hELENBQUM7WUFDRCxHQUFHLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ1osSUFBSSxHQUFHLEdBQVEsT0FBTyxDQUFBO2dCQUN0QixPQUFPLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQzFELENBQUM7WUFDRCxJQUFJLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLEdBQVEsT0FBTyxDQUFBO2dCQUN0QixJQUFHLENBQUMsR0FBRyxDQUFDLElBQUk7b0JBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUE7Z0JBQzFCLElBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSztvQkFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtnQkFFN0IsT0FBTyxNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNoQyxDQUFDO1lBQ0QsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFDUixRQUFRO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUIsQ0FBQztTQUNKLENBQUE7UUFDRCxJQUFJLFdBQVcsR0FBVyxLQUFLLENBQUE7UUFDL0IsMEJBQTBCO1FBQzFCLElBQUcsZUFBZSxFQUFFO1lBQ2hCLElBQUksR0FBRyxHQUFRLE9BQU8sQ0FBQTtZQUN0QixJQUFHLEdBQUcsQ0FBQyxJQUFJO2dCQUFFLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1lBQ25DLDJDQUEyQztZQUMzQyx3RUFBd0U7U0FDM0U7UUFDRCx3QkFBd0I7UUFDeEIsSUFBRyxjQUFjO1lBQUUsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUN0Qyw0QkFBNEI7UUFDNUIsSUFBRyxlQUFlO1lBQUUsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUV2QyxXQUFXO1FBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQTtRQUV0QyxPQUFPLElBQUksQ0FBQTtRQUVYLFNBQVM7UUFDVCxrQkFBa0I7UUFDbEIsc0JBQXNCO1FBRXRCLFNBQVM7UUFDVCxrQkFBa0I7UUFDbEIsMEJBQTBCO1FBQzFCLHNCQUFzQjtRQUV0QixnQ0FBZ0M7UUFDaEMsc0JBQXNCO1FBRXRCLDZDQUE2QztRQUM3QyxrQkFBa0I7UUFFbEIsbURBQW1EO1FBQ25ELDJCQUEyQjtRQUMzQiwwREFBMEQ7UUFDMUQsNEJBQTRCO1FBRTVCLFVBQVU7UUFDVix3QkFBd0I7UUFDeEIsb0JBQW9CO1FBQ3BCLGVBQWU7UUFDZixnQkFBZ0I7UUFDaEIsS0FBSztRQUVMLFdBQVc7UUFDWCx3QkFBd0I7UUFDeEIsb0JBQW9CO1FBQ3BCLEtBQUs7UUFFTCxlQUFlO1FBQ2Ysa0NBQWtDO1FBQ2xDLGdCQUFnQjtRQUNoQiwwQkFBMEI7UUFDMUIscUJBQXFCO1FBQ3JCLGFBQWE7UUFDYixPQUFPO1FBRVAsV0FBVztRQUNYLHdCQUF3QjtRQUN4QixlQUFlO1FBQ2YscUJBQXFCO1FBQ3JCLFFBQVE7UUFDUixLQUFLO1FBRUwsZ0JBQWdCO1FBQ2hCLHdCQUF3QjtRQUN4QixpQkFBaUI7UUFDakIsWUFBWTtRQUNaLDJCQUEyQjtRQUMzQix5QkFBeUI7UUFDekIsd0JBQXdCO1FBQ3hCLFlBQVk7UUFDWixRQUFRO1FBQ1IsS0FBSztJQUNULENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRztJQUVULENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtJQUVaLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtJQUVaLENBQUM7Q0FFSixDQUFBO0FBbmxCRztJQURDLGtCQUFNLEVBQUU7O29DQUNEO0FBR1I7SUFEQyxrQkFBTSxDQUFDLGFBQWEsQ0FBQzs4QkFDZCxhQUFNO3VDQUFBO0FBR2Q7SUFEQyxrQkFBTSxDQUFDLFdBQVcsQ0FBQzs4QkFDZCxXQUFJO3FDQUFBO0FBR1Y7SUFEQyxrQkFBTSxFQUFFOzswQ0FDSztBQVpMLE9BQU87SUFEbkIsbUJBQU8sRUFBRTtHQUNHLE9BQU8sQ0FzbEJuQjtBQXRsQlksMEJBQU8ifQ==