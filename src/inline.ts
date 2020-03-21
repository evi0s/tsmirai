import { Message } from './core/typings';

class Inline {

    public qq: number;
    public cmd: string;
    public args: Array<string>;

    constructor(qq: number, cmd: string, ...args: string[]) {
        this.qq = qq;
        this.cmd = cmd;
        this.args = args;
    }

    public handle(message: Message, callback: Function) {
        const chain = message.messageChain;

        if(chain.length < 2) return;

        if(chain[1].type === 'At') {
            if(chain[1].target === this.qq) {
                if(chain.length >= 3) {
                    if(chain[2].type === 'Plain' && chain[2].text.split(' ')[1] === this.cmd) {
                        callback(this.args);
                    }
                }
            }
        }
    }
}

export { Inline }
