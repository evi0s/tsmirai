import axios from 'axios';
import { BaseResponse } from './typings';

interface AuthResponse extends BaseResponse {
    session: string;
}

async function init(host: string, authKey: string): Promise<AuthResponse> {
    const data = await axios.post(`${host}/auth`,{ authKey });
    return data.data;
}

export { init }
