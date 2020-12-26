import { Provide, Config, ALL, Inject } from '@midwayjs/decorator';
import { OrmOptions } from '../interface'

@Provide()
export class InitLib {

    @Inject()
    ctx: any

    async start(config?: string): Promise<any> {
        if(!config) return null

        const result = await this.ctx.curl('https://registry.npm.taobao.org/egg/latest',  {
            dataType: 'json',
        });

        console.log('--result', result.data.version)

        return `加密处理：${config}`
    }
}