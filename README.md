# tsmirai

A QQ bot written by TypeScript based on Mirai

This package relies on [mirai-console v0.1.3](https://github.com/mamoe/mirai-console/releases/tag/wrapper-0.1.3) and [mirai api http v1.2.3](https://github.com/mamoe/mirai-api-http/releases/tag/v.1.2.3)

`src/core` is rebuilt from [node-mirai](https://github.com/RedBeanN/node-mirai)

Also, `enableWebsocket: true` must be added to `plugins/MiraiAPIHTTP/setting.yml`

## Bootstrap

```bash
git clone https://github.com/evi0s/tsmirai
```

### Install mirai-console

```bash
cd console && chmod +x bootstrap.sh && ./bootstrap.sh
```

### Start mirai-console

```bash
cd console && chmod +x start.sh && ./start.sh
# or simply
cd console && java -jar mirai-console.jar
```

## Usage

```typescript
import { TSMirai } from "./src/index";
import { TypedEvent } from "./src/TypeEvent";
import { Message } from "./src/core/typings";
import { Command } from "./src/command";
import { Inline } from "./src/inline";
import { At, Plain } from "./src/core/MessageComponent";
import { singlePlainMessageArgs } from "./src/utils";

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
        message.reply('This is an example help');
    }));
});

let pingCmd = new TypedEvent<Message>();
pingCmd.on((message: Message) => {
    (new Command('/ping').handle(message, () => {
        message.reply('pong');
    }));
});

let catInline = new TypedEvent<Message>();
catInline.on((message: Message) => {
    (new Inline(bot.qq, '/cat').handle(message, () => {
        message.quoteReply([At(message.sender.id), Plain('喵')]);
    }))
});

let echoCmd = new TypedEvent<Message>();
echoCmd.on((message: Message) => {
    const args = singlePlainMessageArgs(message);
    (new Command('/echo', ...args).handle(message, (args: Array<string>) => {
        message.reply([Plain(args.join(' '))]);
    }));
});

bot.addEvent(helpCmd);
bot.addEvent(pingCmd);
bot.addEvent(catInline);
bot.addEvent(echoCmd);

bot.registerEvents();

bot.listen('all');

process.on('exit', async () => {
    await bot.release();
});
```

