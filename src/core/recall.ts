import axios from 'axios';
import { BaseResponse } from './typings';

interface RecallResponse extends BaseResponse {}

async function recall(host: string, sessionKey: string, target: number): Promise<RecallResponse> {
    try {
        const data = await axios.post(`${host}/recall`,{ sessionKey, target });
        return data.data;
    } catch (e) {
        console.error('Error @ recall', e.message);
    }
}

export { recall }
