import { Provide, Config, ALL, Inject } from '@midwayjs/decorator';
import { OrmOptions } from '../interface'
import { InitLib } from '../lib/init'

@Provide()
export class Sequelize {

    @Inject()
    ctx: any

    @Inject('initLib')
    init: InitLib

    @Config()
    sequelize: any

    async Add(): Promise<any> {

    }
    
    async Delete(): Promise<any> {
        
    }

    async Update(): Promise<any> {
        
    }

    /**
     * <数据库查询方法>
     * @param tableName [表名称] --> "db_name"
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
    async Get(tableName: string, options: OrmOptions, transaction?: any): Promise<any> {

        // const init = await this.init.start('Get')

        const SE = this.ctx.app.Sequelize;
        // console.log('--->SE', SE)
        // console.log('--->se', this.ctx.model)
        console.log('--->sequelize', this.sequelize)
    }

    /**
     * 获取书籍ID
     * @param id 参数
     */
    async getBookById(id?: number) {

        // Get get
        // Update update
        // Add add Create create
        // Delete delete

        // console.log('---->config', this.user)

        const init = await this.init.start('hello')

        console.log('---->init', init)

        return `id: ${id}`
    }
}