import { Message } from "./core/typings";

function singlePlainMessageSplit(message: Message): Array<string> {
    let msg: Array<string> = [];

    message.messageChain.forEach(chain => {
        if(chain.type === 'Plain')
            msg.push(chain.text);
    });

    if(msg.length === 0) return [];

    return msg[0].split(' ').filter(String);
}

function singlePlainMessageArgs(message: Message): Array<string> {

    const msg = singlePlainMessageSplit(message);

    if(msg.length === 0) return [];

    return msg.slice(1);
}

export {
    singlePlainMessageSplit,
    singlePlainMessageArgs
}
