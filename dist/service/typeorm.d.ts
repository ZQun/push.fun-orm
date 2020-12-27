import { InitLib } from '../lib/init';
import { Nanoid, Tool } from 'midway-tool/dist';
export declare class Typeorm {
    ctx: any;
    init: InitLib;
    nanoid: Nanoid;
    tool: Tool;
    sequelize: any;
    private entityManager;
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
    Get(Entity: any, options?: {
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
        type?: string;
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
        where?: object | Array<object>;
        /**
         * @param page [当前页码]
         * @case 1 查询第1页内容[默认1]
         */
        page?: number;
        /**
         * @param count [每页显示条数]
         * @case 20 每页显示20条[默认20]
         */
        count?: number;
        order?: object;
        include?: Array<object | string>;
    }, transaction?: any): Promise<any>;
    /**
     * @param options 根据数组id查询 --> [12, 13, 14]
     */
    Get(Entity: any, options?: Array<number>, transaction?: any): Promise<any>;
    /**
     * @param options 根据id查询 --> 999
     */
    Get(Entity: any, options?: number, transaction?: any): Promise<any>;
    Add(): Promise<void>;
    Update(): Promise<void>;
    Delete(): Promise<void>;
}
