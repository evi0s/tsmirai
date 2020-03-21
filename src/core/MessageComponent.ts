import { MessageChain } from './typings';

interface SourceType extends MessageChain {
    id: number;
    time: number;
}

const Source = (id: number)  => {
    return {
        type: 'Source',
        id,
    };
};

Source.value = (source: SourceType) => {
    return {
        id: source.id,
        time: source.time,
    };
};

interface PlainType extends MessageChain {
    text: string
}

const Plain = (text: string) => {
    return {
        type: 'Plain',
        text,
    };
};
Plain.value = (plain: PlainType) => plain.text;

interface AtType extends MessageChain {
    target: number;
    display: string;
}

const At = (target: number) => {
    return {
        type: 'At',
        target,
    };
};
At.value = (at: AtType) => {
    return {
        target: at.target,
        display: at.display,
    };
};

const AtAll = () => {
    return {
        type: 'AtAll',
    };
};
AtAll.value = () => {};

interface FaceType extends MessageChain {
    faceId: number;
}

const Face = (faceId: number) => {
    return {
        type: 'Face',
        faceId,
    };
};
Face.value = (face: FaceType) => face.faceId;


interface ImageType extends MessageChain {
    imageId: string;
    url: string;
    path: string;
}

const Image = (imageId: string, url: string = '', path: string) => {
    return {
        type: 'Image',
        imageId,
        url,
        path
    };
};
Image.value = (image: ImageType) => {
    return {
        imageId: image.imageId,
        url: image.url,
        path: image.path
    };
};

interface XMLType extends MessageChain {
    xml: string;
}

const Xml = (xml: string) => {
    return {
        type: 'Xml',
        xml,
    };
};
Xml.value = (xml: XMLType) => xml.xml;

interface JSONType extends MessageChain {
    json: string;
}

const Json = (json: string) => {
    return {
        type: 'Json',
        json,
    };
};
Json.value = (json: JSONType) => json.json;

interface AppType extends MessageChain {
    content: string;
}

const App = (content: string) => {
    return {
        type: 'App',
        content,
    };
};
App.value = (app: AppType) => app.content;

interface QuoteType extends MessageChain {
    id: number;
    groupId: number;
    senderId: number;
    origin: Array<MessageChain>;
}

const Quote = (id: number) => {
    return {
        type: 'Quote',
        id,
    };
};
Quote.value = (quote: QuoteType) => {
    return {
        id: quote.id,
        groupId: quote.groupId,
        senderId: quote.senderId,
        origin: quote.origin,
    };
};

export {
    Source, SourceType,
    Plain, PlainType,
    At, AtType,
    AtAll,
    Face, FaceType,
    Image, ImageType,
    Xml, XMLType,
    Json, JSONType,
    App, AppType,
    Quote, QuoteType,
}
