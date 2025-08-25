import express from "express"
import {Bot, Keyboard, webhookCallback} from "grammy"
import dotenv from "dotenv"
import cors from 'cors'
import {configComposer, clientComposer} from "./composer/index.js"


dotenv.config()
let STATUS = true
const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL
const TOKEN = process.env.BOT_TOKEN
const ADMIN_ID = process.env.ADMIN_ID


const bot = new Bot(TOKEN)
const app = express()
app.use(express.json())
app.use(cors())



bot.filter(async (ctx)=>ctx.from.id === Number(ADMIN_ID) || true).command('start', async (ctx) => {
    return await ctx.reply(`
<b>Qurilma holati</b>

HOLATI: <b>${STATUS? '✅ Ruxsat berilgan' : '⛔  Bloklangan'}  </b>
    
    `, {
        parse_mode:"HTML",
        reply_markup: new Keyboard()
            .text('✅ Ruxsat berish')
            .text('⛔ Bloklash').resized()
    })
})



bot.command('whoAmI', async (ctx) => {
    return await ctx.reply(ctx.from.id)
})

bot.filter(async (ctx)=>ctx.from.id === Number(ADMIN_ID) || true).hears('✅ Ruxsat berish', async (ctx)=>{
    STATUS = true
    await ctx.reply('✅ Ruxsat berildi')

})
bot.filter(async (ctx)=>ctx.from.id === Number(ADMIN_ID) || true).hears('⛔ Bloklash', async (ctx)=>{
    STATUS = false
    await ctx.reply('⛔ Bloklandi')

})

app.get('/status', async (req, res)=>{
    await res.status(200).send({status:STATUS})
})

















app.use(`/${TOKEN}`, webhookCallback(bot, "express"));


app.listen(PORT, async () => {
    console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`)

    const webhookUrl = `${BASE_URL}/${TOKEN}`

    bot.api.setWebhook(webhookUrl, {
        allowed_updates:["my_chat_member", "chat_member", "message", "callback_query", "inline_query", "chat_join_request"]
    }).then((res)=>{
        console.log(`Webhook bot set to ${webhookUrl}`);
    }).catch((error)=>{
        console.log(error)
    });
})



process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason)
})

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err)
})
