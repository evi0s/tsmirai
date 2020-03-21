import axios from 'axios';
import { BaseResponse } from './typings';

interface ReleaseResponse extends BaseResponse {}

async function release(host: string, sessionKey: string, qq: number): Promise<ReleaseResponse> {
    const data = await axios.post(`${host}/release`,{ sessionKey, qq });
    return data.data;
}

export { release }
