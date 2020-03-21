import { TSMirai } from "../index";
import {TypedEvent} from "../TypeEvent";
import {Message} from "../core/typings";
import {Command} from "../command";
import {Inline} from "../inline";
import {At, Plain} from "../core/MessageComponent";
import {singlePlainMessageArgs} from "../utils";

let bot: TSMirai = new TSMirai('http://127.0.0.1:8080', '123456789', 114514);

bot.onSignal('authed', async () => {
    console.log(`Authed with session key ${bot.sessionKey}`);
    await bot.verify();
});

bot.onSignal('verified', async () => {
    console.log(`Verified with session key ${bot.sessionKey}`);
    const friendList = await bot.getFriendList();
    console.log(`There are ${friendList.length} friends in bot`);
});

let helpCmd = new TypedEvent<Message>();
helpCmd.on((message: Message) => {
    (new Command('/help').handle(message, () => {
        message.reply('This is a example help');
    }));
});

let pingCmd = new TypedEvent<Message>();
pingCmd.on((message: Message) => {
    (new Command('/ping').handle(message, () => {
        message.reply('pong');
    }));
});

let echoCmd = new TypedEvent<Message>();
echoCmd.on((message: Message) => {
    const args = singlePlainMessageArgs(message);
    (new Command('/echo', ...args).handle(message, (args: Array<string>) => {
        message.reply([Plain(args.join(' '))]);
    }));
});

let catInline = new TypedEvent<Message>();
catInline.on((message: Message) => {
    (new Inline(bot.qq, '/cat').handle(message, () => {
        message.quoteReply([At(message.sender.id), Plain('喵')]);
    }))
});

let whoInline = new TypedEvent<Message>();
whoInline.on((message: Message) => {
    (new Inline(bot.qq, '/whoami').handle(message, () => {
        message.quoteReply([At(message.sender.id), Plain(`${message.sender.memberName}(${message.sender.id}): 你是 GAY !`)]);
    }))
});

let gayInline = new TypedEvent<Message>();
gayInline.on((message: Message) => {
    const args = singlePlainMessageArgs(message);
    if(args.length !== 1) return;
    (new Inline(bot.qq, '/gay', ...args).handle(message, (args: Array<string>) => {
        message.reply([Plain(`${args.join(' ')} 是 GAY !`)]);
    }))
});

let ChouInline = new TypedEvent<Message>();
ChouInline.on((message: Message) => {
    const args = singlePlainMessageArgs(message);
    if(args.length !== 1) return;
    (new Inline(bot.qq, '/恶臭化', ...args).handle(message, (args: Array<string>) => {
        message.reply([Plain(`${args[0].split('').join(' ')}`)]);
    }))
});

bot.addEvent(helpCmd);
bot.addEvent(pingCmd);
bot.addEvent(catInline);
bot.addEvent(echoCmd);
bot.addEvent(whoInline);
bot.addEvent(gayInline);
bot.addEvent(ChouInline);

bot.registerEvents();

bot.listen('all');

process.on('exit', async () => {
    await bot.release();
});
