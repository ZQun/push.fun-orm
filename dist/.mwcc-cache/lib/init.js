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
exports.InitLib = void 0;
const decorator_1 = require("@midwayjs/decorator");
let InitLib = class InitLib {
    async start(config) {
        if (!config)
            return null;
        const result = await this.ctx.curl('https://registry.npm.taobao.org/egg/latest', {
            dataType: 'json',
        });
        console.log('--result', result.data.version);
        return `加密处理：${config}`;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], InitLib.prototype, "ctx", void 0);
InitLib = __decorate([
    decorator_1.Provide()
], InitLib);
exports.InitLib = InitLib;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvUXVuL1VuY2x1dHRlci/kuZ3ms7Doja/kuJrpobnnm64vc2VydmVyL3NyYy9jb21wb25lbnRzL21pZHdheS1vcm0tc3FsL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pbml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUFtRTtBQUluRSxJQUFhLE9BQU8sR0FBcEIsTUFBYSxPQUFPO0lBS2hCLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBZTtRQUN2QixJQUFHLENBQUMsTUFBTTtZQUFFLE9BQU8sSUFBSSxDQUFBO1FBRXZCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsNENBQTRDLEVBQUc7WUFDOUUsUUFBUSxFQUFFLE1BQU07U0FDbkIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUU1QyxPQUFPLFFBQVEsTUFBTSxFQUFFLENBQUE7SUFDM0IsQ0FBQztDQUNKLENBQUE7QUFiRztJQURDLGtCQUFNLEVBQUU7O29DQUNEO0FBSEMsT0FBTztJQURuQixtQkFBTyxFQUFFO0dBQ0csT0FBTyxDQWdCbkI7QUFoQlksMEJBQU8ifQ==