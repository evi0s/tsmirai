import { MiraiCore } from '../index';
import { Message } from '../typings';
import { At, Plain, PlainType, Image } from '../MessageComponent';

let bot = new MiraiCore('http://127.0.0.1:8080', '123456789', 114514);

bot.onSignal('authed', async () => {
    console.log(`Authed with session key ${bot.sessionKey}`);
    await bot.verify();
});

bot.onSignal('verified', async () => {
    console.log(`Verified with session key ${bot.sessionKey}`);
    const friendList = await bot.getFriendList();
    console.log(`There are ${friendList.length} friends in bot`);
});

bot.onMessage((message: Message) => {
    console.log(message);
    const { type, sender, messageChain, reply, quoteReply } = message;
    // let msg = '';
    // messageChain.forEach(chain => {
    //     if (chain.type === 'Plain') msg += Plain.value(<PlainType> chain);
    // });
    // // 直接回复
    // if (msg.includes('SYN')) reply('ACK'); // 或者: bot.reply('收到了', message)
    // // 引用回复, 失败时会自动退化到普通回复
    // else if (msg.includes('Quote')) quoteReply([At(sender.id), Plain('OK')], message);
    // // 撤回
    // else if (msg.includes('Recall')) bot.recall(message);
    messageChain.forEach(chain => {
        if(chain.type === 'Image') {
            console.log(chain);
            reply([Image(chain.imageId, chain.url, chain.path)])
        }
    });
});

bot.listen('all');

process.on('exit', async () => {
    await bot.release();
});
