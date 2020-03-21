import { MiraiCore } from './core';
import { TypedEvent } from './TypeEvent';
import { Message } from './core/typings';

class TSMirai extends MiraiCore {

    private registeredEvents: Array<TypedEvent<Message>>;

    constructor(host: string, authKey: string, qq: number) {
        super(host, authKey, qq);
        this.registeredEvents = [];
    }

    public addEvent(event: TypedEvent<Message>) {
        this.registeredEvents.push(event);
    }

    public registerEvents() {
        this.onMessage((message: Message) => {
            this.registeredEvents.forEach((event: TypedEvent<Message>) => {
                event.emit(message);
            });
        });
    }
}

export { TSMirai }
