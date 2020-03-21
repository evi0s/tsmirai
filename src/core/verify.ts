import axios from 'axios';
import { BaseResponse } from './typings';

interface VerifyResponse extends BaseResponse {}

async function verify(host: string, sessionKey: string, qq: number): Promise<VerifyResponse> {
    const data = await axios.post(`${host}/verify`,{ sessionKey, qq });
    return data.data;
}

export { verify }
