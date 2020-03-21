interface SignalList {
    [index: string]: Array<Function>;

    online?: Array<Function>;
    offlineActive?: Array<Function>;
    offlineForce?: Array<Function>;
    offlineDropped?: Array<Function>;
    relogin?: Array<Function>;
    groupPermissionChange?: Array<Function>;
    mute?: Array<Function>;
    unmute?: Array<Function>;
    joinGroup?: Array<Function>;
    groupNameChange?: Array<Function>;
    groupEntranceAnnouncementChange?: Array<Function>;
    groupMuteAll?: Array<Function>;
    groupAllowAnonymousChat?: Array<Function>;
    groupAllowConfessTalk?: Array<Function>;
    groupAllowMemberInvite?: Array<Function>;
    memberJoin?: Array<Function>;
    memberLeaveKick?: Array<Function>;
    memberLeaveQuit?: Array<Function>;
    memberCardChange?: Array<Function>;
    memberSpecialTitleChange?: Array<Function>;
    memberPermissionChange?: Array<Function>;
    memberMute?: Array<Function>;
    memberUnmute?: Array<Function>;
    message?: Array<Function>;
}


class Signal {

    public signalList: SignalList;

    constructor() {
        this.signalList = {};
    }

    on (signalName: string, callback: Function) {
        if (!this.signalList[signalName]) this.signalList[signalName] = [];
        this.signalList[signalName].push(callback);
    }

    emit(signalName: string) {
        if (!this.signalList[signalName]) return;
        for (let callback of this.signalList[signalName]) callback();
    }
}

const EventNames: { [index:string]: string } = {
    "BotOnlineEvent": "online",
    "BotOfflineEventActive": "offlineActive",
    "BotOfflineEventForce": "offlineForce",
    "BotOfflineEventDropped": "offlineDropped",
    "BotReloginEvent": "relogin",
    "BotGroupPermissionChangeEvent": "groupPermissionChange",
    "BotMuteEvent": "mute",
    "BotUnmuteEvent": "unmute",
    "BotJoinGroupEvent": "joinGroup",
    "GroupNameChangeEvent": "groupNameChange",
    "GroupEntranceAnnouncementChangeEvent": "groupEntranceAnnouncementChange",
    "GroupMuteAllEvent": "groupMuteAll",
    "GroupAllowAnonymousChatEvent": "groupAllowAnonymousChat",
    "GroupAllowConfessTalkEvent": "groupAllowConfessTalk",
    "GroupAllowMemberInviteEvent": "groupAllowMemberInvite",
    "MemberJoinEvent": "memberJoin",
    "MemberLeaveEventKick": "memberLeaveKick",
    "MemberLeaveEventQuit": "memberLeaveQuit",
    "MemberCardChangeEvent": "memberCardChange",
    "MemberSpecialTitleChangeEvent": "memberSpecialTitleChange",
    "MemberPermissionChangeEvent": "memberPermissionChange",
    "MemberMuteEvent": "memberMute",
    "MemberUnmuteEvent": "memberUnmute"
};

export { SignalList, Signal, EventNames }
