import axios from 'axios';
import { SendMessageBaseResponse, ImageResponse } from './typings';
import { Plain, Image } from './MessageComponent';
import { MessageChain } from './typings';
import * as FormData from 'form-data';
import { WriteStream, createWriteStream } from "fs";


interface SendFriendMessageResponse extends SendMessageBaseResponse {}

async function sendFriendMessage(
    host: string,
    messageChain: Array<MessageChain> | string,
    target: number,
    sessionKey: string): Promise<SendFriendMessageResponse> {

    if (typeof messageChain === 'string') {
        messageChain = [ Plain(messageChain) ];
    }

    try {
        const data = await axios.post(`${host}/sendFriendMessage`, {
            messageChain, target, sessionKey,
        });
        return data.data;
    } catch (err) {
        console.error('Unknown Error @ sendFriendMessage:', err.message);
    }
}

async function sendQuotedFriendMessage(
    host: string,
    messageChain: Array<MessageChain> | string,
    target: number,
    quote: number,
    sessionKey: string): Promise<SendFriendMessageResponse> {

    if (typeof messageChain === 'string') {
        messageChain = [ Plain(messageChain) ];
    }

    try {
        const data = await axios.post(`${host}/sendFriendMessage`, {
            messageChain, target, sessionKey, quote
        });
        return data.data;
    } catch (err) {
        console.error('Unknown Error @ sendQuotedFriendMessage:', err.message);
    }
}

interface SendGroupMessageResponse extends SendMessageBaseResponse {}

async function sendGroupMessage(
    host: string,
    messageChain: Array<MessageChain> | string,
    target: number,
    sessionKey: string): Promise<SendGroupMessageResponse> {

    if (typeof messageChain === 'string') {
        messageChain = [ Plain(messageChain) ];
    }

    try {
        const data = await axios.post(`${host}/sendGroupMessage`, {
            messageChain, target, sessionKey
        });
        return data.data;
    } catch (err) {
        console.error('Unknown Error @ sendGroupMessage:', err.message);
    }
}

async function sendQuotedGroupMessage(
    host: string,
    messageChain: Array<MessageChain> | string,
    target: number,
    quote: number,
    sessionKey: string): Promise<SendGroupMessageResponse> {

    if (typeof messageChain === 'string') {
        messageChain = [ Plain(messageChain) ];
    }

    try {
        const data = await axios.post(`${host}/sendGroupMessage`, {
            messageChain, target, sessionKey, quote
        });
        return data.data;
    } catch (err) {
        console.error('Unknown Error @ sendQuotedGroupMessage:', err.message);
    }
}

async function uploadImage(
    host: string,
    url: string,
    type: string,
    sessionKey: string): Promise<ImageResponse> {
    let img: WriteStream | string;
    if (typeof url === 'string') {
        img = createWriteStream(url);
    } else {
        img = url;
    }

    const form = new FormData();
    form.append('sessionKey', sessionKey);
    form.append('type', type);
    form.append('img', img);

    function throwError(status: number, response: string) {
        throw new Error(`Error response: ${status}, ${response}`);
    }

    try {
        const data = await axios.post(`$host/uploadImage`, form,
            { headers: form.getHeaders() });
        if(data.status !== 200) {
            throwError(data.status, data.data);
        }
        if(data.data === 'string') data.data = JSON.parse(data.data.toString());
        return data.data;
    } catch (err) {
        console.error("Unknown Error @ uploadImage:", err.message)
    }

}

async function sendImageMessage(
    host: string,
    url: string,
    sessionKey: string,
    qq?: number,
    group?: number): Promise<SendMessageBaseResponse> {
    let type: string, send: Function, target: number;

    if(qq) {
        type = 'friend';
        send = sendFriendMessage;
        target = qq;
    } else if(group) {
        type = 'group';
        send = sendGroupMessage;
        target = group;
    } else throw new Error('Error @ sendImageMessage: you should provide qq or group');

    const image = await uploadImage(host, url, type, sessionKey);
    const messageChain = [ Image(image.imageId, image.url, image.path) ];

    return send(
        host,
        messageChain,
        target,
        sessionKey
    )
}


export {
    sendFriendMessage,
    sendQuotedFriendMessage,
    sendGroupMessage,
    sendQuotedGroupMessage,
    uploadImage,
    sendImageMessage
}
