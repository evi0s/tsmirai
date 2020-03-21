import axios from 'axios';
import { FriendListItem, GroupListItem, Message } from './typings';


async function getFriendList(host: string, sessionKey: string): Promise<Array<FriendListItem>> {
    const data = await axios.get(`${host}/friendList?sessionKey=${sessionKey}`);
    return data.data;
}

async function getGroupList(host: string, sessionKey: string): Promise<Array<GroupListItem>> {
    const data = await axios.get(`${host}/groupList?sessionKey=${sessionKey}`);
    return data.data;
}

async function getMessageById(messageId: number, host: string, sessionKey: string): Promise<Message> {
    const data = await axios.get(`${host}/messageFromId?sessionKey=${sessionKey}&id=${messageId}`);
    return data.data;
}


export {
    getFriendList,
    getGroupList,
    getMessageById
}
