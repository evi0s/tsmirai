import { Message } from './core/typings';

class Command {

    public cmd: string;
    public args: Array<string>;

    constructor(cmd: string, ...args: string[]) {
        this.cmd = cmd;
        this.args = args;
    }

    public handle(message: Message, callback: Function) {
        const chain = message.messageChain;

        if(chain.length < 2) return;

        if(chain[1].type === 'Plain') {
            if(chain[1].text.split(' ')[0] === this.cmd) {
                callback(this.args);
            }
        }
    }
}

export { Command }
