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
exports.SQLConfiguration = void 0;
const decorator_1 = require("@midwayjs/decorator");
const path_1 = require("path");
const typeorm = require("@midwayjs/orm");
const tool = require("midway-tool/src");
let SQLConfiguration = class SQLConfiguration {
    async onReady(content) {
        // console.log('-->组件内：configuration执行')
        // console.log('-->orm', this.config.orm)
        // Object.defineProperty(this.app, 'nis', {
        //     value: 'abc',
        //     writable: false
        // })
        // console.log('--->this.app', this.app)
        // console.log('-->App:', this.app)
        // console.log('--->appDir', this.appDir)
        // console.log('--->config.env', this.config.env)
        // console.info('\n======================================')
        // console.info('            push.fun Started          ')
        // console.info('======================================\n')       
    }
};
__decorate([
    decorator_1.App(),
    __metadata("design:type", Object)
], SQLConfiguration.prototype, "app", void 0);
__decorate([
    decorator_1.Config(decorator_1.ALL),
    __metadata("design:type", Object)
], SQLConfiguration.prototype, "config", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], SQLConfiguration.prototype, "appDir", void 0);
SQLConfiguration = __decorate([
    decorator_1.Configuration({
        namespace: 'SQL',
        importConfigs: [
            path_1.join(__dirname, 'config')
        ],
        imports: [
            typeorm,
            tool
        ]
    })
], SQLConfiguration);
exports.SQLConfiguration = SQLConfiguration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvUXVuL1VuY2x1dHRlci/kuZ3ms7Doja/kuJrpobnnm64vc2VydmVyL3NyYy9jb21wb25lbnRzL21pZHdheS1vcm0tc3FsL3NyYy8iLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQThFO0FBQzlFLCtCQUE0QjtBQUM1Qix5Q0FBd0M7QUFDeEMsd0NBQXVDO0FBWXZDLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWdCO0lBV3pCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBeUI7UUFDbkMsd0NBQXdDO1FBQ3hDLHlDQUF5QztRQUN6QywyQ0FBMkM7UUFDM0Msb0JBQW9CO1FBQ3BCLHNCQUFzQjtRQUN0QixLQUFLO1FBQ0wsd0NBQXdDO1FBQ3hDLG1DQUFtQztRQUNuQyx5Q0FBeUM7UUFDekMsaURBQWlEO1FBQ2pELDJEQUEyRDtRQUMzRCx5REFBeUQ7UUFDekQsa0VBQWtFO0lBQ3RFLENBQUM7Q0FDSixDQUFBO0FBdkJHO0lBREMsZUFBRyxFQUFFOzs2Q0FDaUI7QUFHdkI7SUFEQyxrQkFBTSxDQUFDLGVBQUcsQ0FBQzs7Z0RBQ0Q7QUFHWDtJQURDLGtCQUFNLEVBQUU7O2dEQUNFO0FBVEYsZ0JBQWdCO0lBVjVCLHlCQUFhLENBQUM7UUFDWCxTQUFTLEVBQUUsS0FBSztRQUNoQixhQUFhLEVBQUU7WUFDWCxXQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztTQUM1QjtRQUNELE9BQU8sRUFBRTtZQUNMLE9BQU87WUFDUCxJQUFJO1NBQ1A7S0FDSixDQUFDO0dBQ1csZ0JBQWdCLENBMEI1QjtBQTFCWSw0Q0FBZ0IifQ==