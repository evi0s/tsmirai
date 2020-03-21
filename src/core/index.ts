import { init } from './init';
import { SignalList, Signal, EventNames } from './signal';
import { getFriendList, getGroupList, getMessageById } from './manager';
import { sendFriendMessage, sendQuotedFriendMessage, sendGroupMessage, sendQuotedGroupMessage, sendImageMessage, uploadImage } from './sendMessage';
import { verify } from './verify';
import { release } from './release';
import { recall } from './recall';
import { Message, MessageChain } from './typings';
import { Plain } from './MessageComponent';
import * as WebSocket from 'ws';



class MiraiCore {

    public host: string;
    public qq: number;
    public sessionKey: string;

    private authKey: string;
    private eventListeners: SignalList;
    private signal: Signal;
    private types: Array<string>;

    private isEventListeningStarted: boolean = false;

    constructor(host: string, authKey: string, qq: number) {
        this.host = host;
        this.qq = qq;
        this.authKey = authKey;

        this.signal = new Signal();
        this.eventListeners = {
            message: []
        };
        for (let event in EventNames) {
            this.eventListeners[EventNames[event]] = [];
        }
        this.types = [];

        this.auth();
    }

    private auth() {
        init(this.host, this.authKey).then(data => {
            const { code, session } = data;
            if (code !== 0) {
                console.error('Failed @ auth: Invalid auth key');
                return { code, session };
            }
            this.sessionKey = session;
            this.signal.emit('authed');
            this.startListeningEvents();
            return { code, session };
        }).catch(() => {
            console.error('Failed @ auth: Invalid host');
            return {
                code: 2,
                msg: 'Invalid host',
            };
        });
    }

    public async verify() {
        const data = await verify(this.host, this.sessionKey, this.qq);
        if(data.code !== 0) {
            console.error('Failed @ verify: Invalid session key');
            return;
        }
        this.signal.emit('verified');
    }

    public async release() {
        const data = await release(this.host, this.sessionKey, this.qq);
        if(data.code !== 0) {
            console.error('Failed @ release: Invalid session key');
            return;
        }
        this.signal.emit('released');
    }

    public async sendFriendMessage(messageChain: Array<MessageChain>, qq: number) {
        return sendFriendMessage(
            this.host,
            messageChain,
            qq,
            this.sessionKey,
        );
    }
    public async sendGroupMessage(message: Array<MessageChain>, target: number) {
        return sendGroupMessage(
            this.host,
            message,
            target,
            this.sessionKey
        );
    }

    public async sendImageMessage(url: string, target: Message) {
        switch (target.type) {
            case 'FriendMessage':
                return sendImageMessage(
                    this.host,
                    url,
                    this.sessionKey,
                    target.sender.id,
                    undefined
                );
            case 'GroupMessage':
                return sendImageMessage(
                    this.host,
                    url,
                    this.sessionKey,
                    undefined,
                    target.sender.group.id,
                );
            default:
                console.error('Error @ sendImageMessage: unknown target type');
        }
    }

    public async uploadImage(url: string, target: Message) {
        let type;
        switch (target.type) {
            case 'FriendMessage':
                type = 'friend';
                break;
            case 'GroupMessage':
                type = 'group';
                break;
            default:
                console.error('Error @ uploadImage: unknown target type');
        }
        return uploadImage(
            this.host,
            url,
            type,
            this.sessionKey,
        );
    }

    public async sendMessage(message: Array<MessageChain>, target: Message) {
        switch (target.type) {
            case 'FriendMessage':
                return this.sendFriendMessage(message, target.sender.id);
            case 'GroupMessage':
                return this.sendGroupMessage(message, target.sender.group.id);
            default:
                console.error('Invalid target @ sendMessage');
        }
    }

    public async sendQuotedFriendMessage(message: Array<MessageChain>, target: number, quote: number) {
        return sendQuotedFriendMessage(
            this.host,
            message,
            target, quote,
            this.sessionKey,
        );
    }

    public async sendQuotedGroupMessage(message: Array<MessageChain>, target: number, quote: number) {
        return sendQuotedGroupMessage(
            this.host,
            message,
            target, quote,
            this.sessionKey,
        );
    }

    public async sendQuotedMessage(message: Array<MessageChain>, target: Message) {

        function throwError() {
            throw new Error();
        }

        try {
            let quote = target.messageChain[0].type === 'Source' ? target.messageChain[0].id : -1;
            if (quote < 0) throwError();
            // console.log(target.type, quote);
            switch (target.type) {
                case 'FriendMessage':
                    return await this.sendQuotedFriendMessage(message, target.sender.id, quote);
                case 'GroupMessage':
                    return await this.sendQuotedGroupMessage(message, target.sender.group.id, quote);
                default:
                    console.error('Invalid target @ sendMessage');
                // process.exit(1);
            }
        } catch (e) {
            // 无法引用时退化到普通消息
            // console.log('Back to send message');
            return this.sendMessage(message, target);
        }
    }

    public reply(replyMsg: Array<MessageChain>, srcMsg: Message) {
        const replyMessage = typeof replyMsg === 'string' ? [ Plain(replyMsg) ] : replyMsg;
        return this.sendMessage(replyMessage, srcMsg);
    }

    public quoteReply(replyMsg: Array<MessageChain>, srcMsg: Message) {
        const replyMessage = typeof replyMsg === 'string' ? [ Plain(replyMsg) ] : replyMsg;
        return this.sendQuotedMessage(replyMessage, srcMsg);
    }

    public recall(msg: Message) {
        try {
            const target = msg.messageChain[0].id;
            return recall(
                this.host,
                this.sessionKey,
                target
            );
        } catch (e) {
            console.error('Error @ recall', e.message);
        }
    }

    public async getFriendList() {
        return await getFriendList(this.host, this.sessionKey);
    }

    public async getGroupList() {
        return await getGroupList(this.host, this.sessionKey);
    }

    public async getMessageById(messageId: number) {
        return await getMessageById(messageId, this.host, this.sessionKey);
    }

    private on(name: string, callback: Function) {
        if (name === 'message') return this.onMessage(callback);
        else if (name in this.signal.signalList) return this.onSignal(name, callback);
        return this.onEvent(name, callback);
    }

    public onSignal(eventName: string, callback: Function) {
        return this.signal.on(eventName, callback);
    }

    public onMessage(callback: Function) {
        this.eventListeners.message.push(callback);
    }

    public onEvent(event: string, callback: Function) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(callback);
    }

    public listen(type: string = 'all') {
        this.types = [];
        switch (type) {
            case 'group': this.types.push('GroupMessage'); break;
            case 'friend': this.types.push('FriendMessage'); break;
            case 'all': this.types.push('FriendMessage', 'GroupMessage'); break;
            default:
                console.error('Invalid listen type. Type should be "all", "friend" or "group"');
                process.exit(1);
        }
    }

    private emitEventListener (message: Message) {
        if (this.types.includes(message.type)) {
            message.reply = (msg: Array<MessageChain>) => this.reply(msg, message);
            message.quoteReply = (msg: Array<MessageChain>) => this.quoteReply(msg, message);
            message.recall = () => this.recall(message);
            for (let listener of this.eventListeners.message) {
                listener(message);
            }
        }
        else if (message.type in EventNames) {
            for (let listener of this.eventListeners[EventNames[message.type]]) {
                listener(message);
            }
        }
    }

    private startListeningEvents() {
        if (this.isEventListeningStarted) return;
        this.isEventListeningStarted = true;

        this.onSignal('verified', () => {
            const wsHost = `${this.host.replace('http', 'ws')}/all?sessionKey=${this.sessionKey}`;
            try {
                (new WebSocket(wsHost)).on('message', message => {
                    this.emitEventListener(JSON.parse(message.toString()));
                });
            } catch (e) {
                console.error(e.message);
            }
        });
    }
}

export {
    MiraiCore
}
