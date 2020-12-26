import { ILifeCycle, IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
import { Config, Configuration, ALL, Inject, App } from '@midwayjs/decorator';
import { join } from 'path';
import * as typeorm from '@midwayjs/orm'
import * as tool from 'midway-tool/src'

@Configuration({
    namespace: 'SQL',
    importConfigs: [
        join(__dirname, 'config')
    ],
    imports: [
        typeorm,
        tool
    ]
})
export class SQLConfiguration implements ILifeCycle {

    @App()
    app: IMidwayApplication

    @Config(ALL)
    config: any

    @Inject()
    appDir: any
    
    async onReady(content: IMidwayContainer) {
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
}