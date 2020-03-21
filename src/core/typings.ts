interface BaseResponse {
    code: number;
    msg?: string;
}

interface MessageChain {
    type: string;
    id?: number;
    time?: number;
    groupId?: number;
    senderId?: number;
    origin?: Array<MessageChain>;
    text?: string;
    target?: number;
    display?: string;
    faceId?: number;
    imageId?: string;
    url?: string;
    path?: string;
    xml?: string;
    json?: string;
    content?: string;
}

interface Message {
    code?: number;
    type?: string;
    messageChain?: Array<MessageChain>;
    sender?: FriendListItem & MemberListItem;
    reply?: Function;
    quoteReply?: Function;
    recall?: Function;
}


interface FriendListItem {
    id: number;
    nickname: string;
    remark: string;
}

interface GroupListItem {
    id: number;
    name: string;
    permission: string;
}

interface MemberListItem {
    id: number,
    memberName: string;
    permission: string;
    group: GroupListItem
}

interface SendMessageBaseResponse extends BaseResponse {
    messageId: number;
}

interface ImageResponse {
    imageId: string;
    url: string;
    path: string;
}

export {
    BaseResponse,
    Message, MessageChain,
    FriendListItem, GroupListItem, MemberListItem,
    SendMessageBaseResponse, ImageResponse
}
