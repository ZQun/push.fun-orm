import { Provide, Config, ALL, Inject } from '@midwayjs/decorator';
import { getManager, getRepository, In, Between } from "typeorm";
import { OrmOptions } from '../interface'
import { InitLib } from '../lib/init'
import { Nanoid, Tool } from 'midway-tool/src'

@Provide()
export class Typeorm {

    @Inject()
    ctx: any

    @Inject('initLib')
    init: InitLib

    @Inject('TOOL:nanoid')
    nanoid: Nanoid

    @Inject('TOOL:tool')
    tool: Tool

    @Config()
    sequelize: any

    private entityManager = getManager()

    /**
     * <数据库查询方法>
     * @param Entity [实体名称] --> "Users"
     * @param options [Object] --> type[查询类型] where[查询条件]
     * @param options.type [查询类型] --> one[单条] all[全部] page[分页] count[查询数量] default[默认全部]
     * @param options.where [查询条件] --> { id: xxx }
     * @param options.order [排序条件] --> [ ['id', 'DESC'] ]
     * @param options.include [关联查询] --> [ { model: 'xx', as: 'xx' } ]
     * @param options.attr [聚合查询] attributes: { include: [], exclude: [] }
     * @param options.inc [包含字段] --> ['name']
     * @param options.exc [排除字段] --> ['age']
     * @param options.paranoid [虚拟删除查询] false[查询已删除字段] true[不查询已删除字段] default[true] 
     * @param options.page [分页页码] default[第1页] --> page: 1
     * @param options.count [分页显示条数] default[20条] --> count: 20
     * @param options.cache [缓存:redis] true[启用缓存] false[禁止缓存] default[false]
     * @param options.cache.time [缓存过期时间/秒] --> time: 2
     * @param transaction [事务操作] 传入事务对象transaction
     */
    async Get(Entity: any, options?: {
        /**
         * @param type [查询类型]
         * @example
         * ```ts
         * type: 'all' // 查询全部[默认]
         * type: 'one' // 单条查询
         * type: 'page' // 分页查询
         * type: 'count' // 查询数量
         * ```
         */
        type?: string,
        /**
         * @param where [查询条件]
         * @example
         * ```ts
         * // demo1
         * where: {
         *     id: 1 // 查询id=1
         * }
         * // demo2
         * where: {
         *     id: [1, 2] // 查询id=1或id=2
         * }
         * // demo3
         * where: {
         *     id: [ // []数组内参数之间查询关系是：OR(或)  {}对象内属性之间查询关系是：AND(和)
         *         { 'In': 1 }, // 查询id=1
         *         { 'Between': [1, 3] } // 查询id=1,2,3
         *     ]
         * }
         * // demo4
         * where: [ // []数组内参数之间查询关系是：OR(或)
         *     { //  {}对象内属性之间查询关系是：AND(和)
         *         id: 1,
         *         name: 'push'
         *     },
         *     {
         *         id: [2, 3]
         *     }
         * ]
         * ```
         */
        where?: object | Array<object>,
        /**
         * @param page [当前页码]
         * @case 1 查询第1页内容[默认1]
         */
        page?: number,
        /**
         * @param count [每页显示条数]
         * @case 20 每页显示20条[默认20]
         */
        count?: number,
        order?: object,
        include?: Array<object | string>
    }, transaction?: any): Promise<any>;
    /**
     * @param options 根据数组id查询 --> [12, 13, 14]
     */
    async Get(Entity: any, options?: Array<number>, transaction?: any): Promise<any>;
    /**
     * @param options 根据id查询 --> 999
     */
    async Get(Entity: any, options?: number, transaction?: any): Promise<any>;
    async Get(Entity: any, options?: number | object | Array<number>, transaction?: any): Promise<any> {
        
        // 判断options类型是否为对象
        // let isOptionsObject: boolean = options && typeof options === 'object' && !Array.isArray(options);
        let isOptionsObject: boolean = this.ctx.is.Object(options)
        // 判断options类型是否为数组
        // let isOptionsArray: boolean = options && typeof options === 'object' && Array.isArray(options);
        let isOptionsArray: boolean = this.ctx.is.Array(options)
        // 判断options类型是否为数值
        // let isOptionsNumber: boolean = options && typeof options === 'number';
        let isOptionsNumber: boolean = this.ctx.is.Number(options)

        // TODO: 2.解析where exec queryBuilder方法
        const parseWhere = async (opt: any) => {

            // 如果没有传options 直接返回
            if(!opt) return

            let name: string = this.tool.parseClassName(Entity)

            let sql = this.entityManager
                .createQueryBuilder(Entity, name)

            // 尽量与find用法对标～
            const tool = {
                In: (value: Array<number>, key: string, i: number, ii: number, str: string, boot: boolean) => {
                    let data = {
                        str: ``,
                        data: {}
                    }
                    let inkey: string = ``
                    let uuid: string = this.nanoid.setId(6)
                    for(let i:number = 0, length: number = value.length; i < length; i++) {
                        data.data[`in_${uuid}_${i}`] = value[i]
                        if(!i) {
                            inkey = `:in_${uuid}_${i}`
                        } else {
                            inkey += `, :in_${uuid}_${i}`
                        }
                    }
                    if(i === 1 && ii === 1) {
                        data.str = `${name}.${key} IN(${inkey})`
                    } else {
                        data.str = `${str} AND ${name}.${key} IN(${inkey})`
                    }
                    // 数组嵌套内对象
                    if(boot) {
                        data.str = `${name}.${key} IN(${inkey})`
                    }
                    return data
                },
                Between: (value: Array<number>, key: string, i: number, ii: number, str: string, boot: boolean) => {
                    let data = {
                        str: ``,
                        data: {}
                    }
                    let uuid: string = this.nanoid.setId(6)
                    data.data[`bet_${uuid}_0`] = value[0]
                    data.data[`bet_${uuid}_1`] = value[1]
                    console.log('i: ', i);
                    console.log('ii: ', ii);
                    if(i === 1 && ii === 1) {
                        data.str = `${name}.${key} BETWEEN :bet_${uuid}_0 AND :bet_${uuid}_1`
                    } else {
                        data.str = `${str} AND ${name}.${key} BETWEEN :bet_${uuid}_0 AND :bet_${uuid}_1`
                    }
                    // 数组嵌套内对象
                    if(boot) {
                        data.str = `${name}.${key} BETWEEN :bet_${uuid}_0 AND :bet_${uuid}_1`
                    }
                    return data
                },
                Not: (value: string | number, key: string, i: number, ii: number, str: string, boot: boolean) => {
                    let data = {
                        str: ``,
                        data: {}
                    }
                    let uuid: string = this.nanoid.setId(6)
                    data.data[`not_${uuid}`] = value
                    if(i === 1 && ii === 1) {
                        data.str = `${name}.${key} != :not_${uuid}`
                    } else {
                        data.str = `${str} AND ${name}.${key} != :not_${uuid}`
                    }
                    // 数组嵌套内对象
                    if(boot) {
                        data.str = `${name}.${key} != :not_${uuid}`
                    }
                    return data
                }
            }

            const whereToString = (whereStatus: string): any => {
                // options参数转化
                let keyToObj = (obj: object) => {
                    let i: number = 0
                    let whereObj: object = {}
                    let whereStr: string = ``
                    let linObj: object = obj
                    const xunObj: object = obj
                    for(let key in xunObj) {
                        i += 1 // 持续累加
                        if(linObj.hasOwnProperty(key) === true) {
                            // 判断当前value 属于什么类型
                            let value: any = linObj[key]
                            let data: object = {}

                            // 1 字符串或数字
                            if(typeof value === 'string' || typeof value === 'number') {
                                let keys: string = this.nanoid.setId(6)
                                if(i === 1) {
                                    whereStr = `${name}.${key} = :${keys}`
                                } else {
                                    whereStr = `(${whereStr}) AND ${name}.${key} = :${keys}`
                                }
                                data[keys] = xunObj[key]
                                delete linObj[key]
                            }
    
                            // 2 数组
                            if(typeof value === 'object' && Array.isArray(value)) {
                                if(!Array.isArray(value[0])) {
                                    // 如果数组内为对象
                                    for(let s = 0, length = value.length; s < length; s++) {
                                        let objdata = value[s]
                                        if(typeof objdata === 'object' && !Array.isArray(objdata)) {
                                            let ii: number = 0
                                            let valueLen: number = Object.keys(objdata).length
                                            for(let objectKey in objdata) {
                                                ii += 1
                                                if(objdata.hasOwnProperty(objectKey) === true) {
                                                    let objectValue = objdata[objectKey]
                                                    let val = tool[objectKey](objectValue, key, i, ii, whereStr, true)
                                                    // s 数组内对象循环次数
                                                    // ii 数组内对象内的属性循环次数
                                                    // valueLen 是数组内对象内的属性个数
                                                    // i 是where内对象属性循环次数
                                                    // s 才是用来判断执行到第几个对象属性！

                                                    // 说明当前对象执行的是第一个
                                                    if(s === 0 && i === 1 && ii === 1) {
                                                        if(valueLen === 1) {
                                                            // 说明只有一个
                                                            whereStr = `(${val.str})`
                                                        }
                                                        if(valueLen > 1) {
                                                            // 说明不止有一个
                                                            whereStr = `(${val.str}`
                                                        }
                                                    }
                                                    // 说明第一个对象内后续属性循环
                                                    if(s === 0 && i === 1 && ii !== 1) {
                                                        // 第一个数组内，第一个属性内，不是第一个对象
                                                        if(valueLen !== 1 && valueLen !== ii) {
                                                            // 说明执行第二个属性 不是最后一个
                                                            whereStr = `${whereStr} AND (${val.str})`
                                                        }
                                                        if(valueLen === ii) {
                                                            // 说明执行到最后一个属性
                                                            whereStr = `${whereStr} AND (${val.str}))`
                                                        }
                                                    }

                                                    // 第二个对象开始循环
                                                    if(s !== 0 && s + 1 !== value.length && i === 1 && ii === 1) {
                                                        // 需要判断当前第一个循环，是不是最后一个循环
                                                        if(valueLen === 1) {
                                                            // 说明只有一个
                                                            whereStr = `${whereStr} OR (${val.str})`
                                                        }
                                                        if(valueLen > 1) {
                                                            // 说明不止有一个
                                                            whereStr = `${whereStr} OR (${val.str}`
                                                        }
                                                    }
                                                    if(s !== 0 && s + 1 !== value.length && i === 1 && ii !== 1) {
                                                        if(valueLen !== 1 && valueLen !== ii) {
                                                            whereStr = `${whereStr} AND (${val.str})`
                                                        }
                                                        if(valueLen === ii) {
                                                            whereStr = `${whereStr} AND (${val.str}))`
                                                        }
                                                    }

                                                    // 最后一个对象循环
                                                    if(s !== 0 && s + 1 === value.length && i === 1 && ii === 1) {
                                                        // 需要判断当前第一个循环，是不是最后一个循环
                                                        if(valueLen === 1) {
                                                            // 说明只有一个
                                                            whereStr = `${whereStr} OR (${val.str})`
                                                        }
                                                        if(valueLen > 1) {
                                                            // 说明不止有一个
                                                            whereStr = `${whereStr} OR (${val.str}`
                                                        }
                                                    }
                                                    if(s !== 0 && s + 1 === value.length && i === 1 && ii !== 1) {
                                                        if(valueLen !== 1 && valueLen !== ii) {
                                                            whereStr = `${whereStr} AND (${val.str})`
                                                        }
                                                        if(valueLen === ii) {
                                                            whereStr = `${whereStr} AND (${val.str}))`
                                                        }
                                                    }
                                                    Object.assign(data, val.data)
                                                }
                                            }
                                        }
                                        if(typeof objdata === 'string' || typeof objdata === 'number') {
                                            let keys: string = this.nanoid.setId(6)
                                            if(!s) {
                                                // 第一个
                                                whereStr = `(${name}.${key} = :${keys})`
                                            } else {
                                                // 说明不是第一个
                                                whereStr = `${whereStr} OR (${name}.${key} = :${keys})`
                                            }
                                            data[keys] = xunObj[key][s]
                                        }
                                        if(s + 1 === value.length) {
                                            delete linObj[key]
                                        }
                                    }
                                }
                                if(typeof value[0] === 'object' && Array.isArray(value[0])) {
                                    // 数组为简化and写法
                                    let inkey: string = ``
                                    for(let s: number = 0; s < value.length; s++) {
                                        if(!s) {
                                            inkey = `:${key+s}`
                                        } else {
                                            inkey += `, :${key+s}`
                                        }
                                        data[key+s] = value[s]
                                    }
                                    if(i === 1) {
                                        whereStr = `${name}.${key} IN(${inkey})`
                                    } else {
                                        whereStr = `(${whereStr}) AND ${name}.${key} IN(${inkey})`
                                    }
                                    delete linObj[key]
                                }
                            }
    
                            // 3 对象
                            if(typeof value === 'object' && !Array.isArray(value)) {
                                // 对象则解析对象体内的key
                                let ii: number = 0
                                let valueLen: number = Object.keys(value).length
                                for(let objectKey in value) {
                                    ii += 1
                                    if(value.hasOwnProperty(objectKey) === true) {
                                        // FIXME: 支持多种操作符操作,不同操作符间为 AND
                                        let objectValue = value[objectKey]
                                        let val = tool[objectKey](objectValue, key, i, ii, whereStr)
                                        whereStr = val.str
                                        Object.assign(data, val.data)
                                        delete linObj[key][objectKey]
                                        if(ii === valueLen) {
                                            delete linObj[key]
                                            if(whereObj[key]) {
                                                delete whereObj[key]
                                            }
                                        }
                                    }
                                }
                            }
                            Object.assign(whereObj, linObj, data)
                        }
                    }
                    console.log('-->where',  { whereStr, whereObj })
                    return { whereStr, whereObj }
                }

                let obj: any = null
                if(whereStatus === 'where') {
                    obj = opt.where
                    return keyToObj(obj)
                }

                if(whereStatus === 'array') {
                    obj = opt.where
                    let arr: Array<object> = []
                    for(let i = 0, length = obj.length; i < length; i++) {
                        let get = keyToObj(obj[i])
                        arr.push(get)
                    }
                    return arr
                }

                if(whereStatus === 'noWhere') {
                    obj = opt
                    // 阻止传入type && where
                    if(obj.type) delete obj.type
                    if(obj.where) delete obj.where
                    return keyToObj(obj)
                }
            }

            // 如果传入的options是对象不是数组
            if(opt && typeof opt === 'object' && !Array.isArray(opt)) {

                let ws: any = {
                    whereStr: '',
                    whereObj: {}
                }
                
                // 判断对象体内是否有 where
                if(opt.where && typeof opt.where === 'object' && !Array.isArray(opt.where)) {
                    // 如果有where直接遍历where下属性
                    ws = whereToString('where')
                }

                // 判断opt.where是否为数组
                // 并且数组内是否存在对象
                if(opt.where && typeof opt.where === 'object' && Array.isArray(opt.where)) {
                    // 如果是数组，判断数组内是否有对象
                    let s: any = []
                    let a: any = {
                        whereStr: '',
                        whereObj: {}
                    }
                    if(typeof opt.where[0] === 'object' && !Array.isArray(opt.where[0])) {
                        s = whereToString('array')
                    } else {
                        // 此处说明是空数组 []
                        s = [{ whereStr: '', whereObj: {} }]
                    }
                    for(let i = 0, length = s.length; i < length; i++) {
                        if(!i) {
                            a.whereStr = `(${s[i].whereStr})`
                        } else {
                            a.whereStr = `${a.whereStr} OR (${s[i].whereStr})`
                        }
                        Object.assign(a.whereObj, s[i].whereObj)
                    }
                    ws = a
                }

                // 如果没有where 直接遍历options下属性
                if(!opt.where && opt.type !== 'page') {
                    // 此配置会将type 和 where字段变为数据库限制字段！
                    ws = whereToString('noWhere')
                }

                // page分页
                if(opt.type === 'page') {
                    const page = opt.page
                    const countPage = opt.count
                    const limit = countPage;
                    const offset = countPage * (page - 1);

                    return sql
                        .where(ws.whereStr, ws.whereObj)
                        .take(limit)
                        .skip(offset)
                        .getManyAndCount()
                }

                // count总条数
                if(opt.type === 'count') {

                }

                return sql
                    .where(ws.whereStr, ws.whereObj)
                    .getMany()
            }
            // TODO: 如果传入的options是数组
            if(opt && typeof opt === 'object' && Array.isArray(opt)) {
                // 并且数组内的参数为 number
                // 根据数组内参数进行查询 id
                // ***大概率执行不到这里***
            }
        }
        
        // type 部分
        const Type: object = {
            all: async () => {
                return await parseWhere(options)
            },
            one: async () => {
                let opt: any = {}
                if(isOptionsNumber) {
                    opt = options
                }
                if(isOptionsObject) {
                    let opt: any = options
                    if(opt.where && typeof opt.where === 'object') {
                        opt = opt.where
                    }
                }
                return await this.entityManager.findOne(Entity, opt)
            },
            arr: async () => {
                let opt: any = options
                return await this.entityManager.findByIds(Entity, opt)
            },
            page: async () => {
                let opt: any = options
                if(!opt.page) opt.page = 1
                if(!opt.count) opt.count = 20
                
                return await parseWhere(opt)
            },
            count: () => {
                // 查询总条数
                console.log('---count');
            }
        }
        let optionsType: string = 'all'
        // 如果options中设置type则根据类型查询
        if(isOptionsObject) {
            let opt: any = options
            if(opt.type) optionsType = opt.type
            // FIXME:  此处逻辑大概有问题！   判断是否有where 执行单条筛选查询
            // if(!(opt.where && typeof opt.where === 'object')) optionsType = 'one'
        }
        // 如果options为数组，执行数组id查询
        if(isOptionsArray) optionsType = 'arr'
        // one 如果options为数值，直接执行单条查询
        if(isOptionsNumber) optionsType = 'one'

        // exec get
        const data = await Type[optionsType]()

        return data

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

}