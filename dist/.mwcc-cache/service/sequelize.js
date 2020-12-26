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
exports.Sequelize = void 0;
const decorator_1 = require("@midwayjs/decorator");
const init_1 = require("../lib/init");
let Sequelize = class Sequelize {
    async Add() {
    }
    async Delete() {
    }
    async Update() {
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
    async Get(tableName, options, transaction) {
        // const init = await this.init.start('Get')
        const SE = this.ctx.app.Sequelize;
        // console.log('--->SE', SE)
        // console.log('--->se', this.ctx.model)
        console.log('--->sequelize', this.sequelize);
    }
    /**
     * 获取书籍ID
     * @param id 参数
     */
    async getBookById(id) {
        // Get get
        // Update update
        // Add add Create create
        // Delete delete
        // console.log('---->config', this.user)
        const init = await this.init.start('hello');
        console.log('---->init', init);
        return `id: ${id}`;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], Sequelize.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject('initLib'),
    __metadata("design:type", init_1.InitLib)
], Sequelize.prototype, "init", void 0);
__decorate([
    decorator_1.Config(),
    __metadata("design:type", Object)
], Sequelize.prototype, "sequelize", void 0);
Sequelize = __decorate([
    decorator_1.Provide()
], Sequelize);
exports.Sequelize = Sequelize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVsaXplLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9RdW4vVW5jbHV0dGVyL+S5neazsOiNr+S4mumhueebri9zZXJ2ZXIvc3JjL2NvbXBvbmVudHMvbWlkd2F5LW9ybS1zcWwvc3JjLyIsInNvdXJjZXMiOlsic2VydmljZS9zZXF1ZWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQW1FO0FBRW5FLHNDQUFxQztBQUdyQyxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO0lBV2xCLEtBQUssQ0FBQyxHQUFHO0lBRVQsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO0lBRVosQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO0lBRVosQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBaUIsRUFBRSxPQUFtQixFQUFFLFdBQWlCO1FBRS9ELDRDQUE0QztRQUU1QyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDbEMsNEJBQTRCO1FBQzVCLHdDQUF3QztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBVztRQUV6QixVQUFVO1FBQ1YsZ0JBQWdCO1FBQ2hCLHdCQUF3QjtRQUN4QixnQkFBZ0I7UUFFaEIsd0NBQXdDO1FBRXhDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFOUIsT0FBTyxPQUFPLEVBQUUsRUFBRSxDQUFBO0lBQ3RCLENBQUM7Q0FDSixDQUFBO0FBbkVHO0lBREMsa0JBQU0sRUFBRTs7c0NBQ0Q7QUFHUjtJQURDLGtCQUFNLENBQUMsU0FBUyxDQUFDOzhCQUNaLGNBQU87dUNBQUE7QUFHYjtJQURDLGtCQUFNLEVBQUU7OzRDQUNLO0FBVEwsU0FBUztJQURyQixtQkFBTyxFQUFFO0dBQ0csU0FBUyxDQXNFckI7QUF0RVksOEJBQVMifQ==