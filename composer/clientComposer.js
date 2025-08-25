import {Composer} from "grammy"

const bot = new Composer().chatType('private')


bot.filter(async (ctx)=>ctx.from.id).command('start', async (ctx) => {
    return await ctx.reply('Hello!')
})



bot.command('whoAmI', async (ctx) => {
    return await ctx.reply(ctx.from.id)
})


bot.hears('')







export const clientComposer =  bot