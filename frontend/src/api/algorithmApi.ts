import axios from 'axios';
import type { PatternMatchRequest, PatternMatchResponse, Payload} from '../types/types';

const BASE_URL = "https://lpm-algo-visual-backend.vercel.app"

export const run_z_algorithm = async (text: string, pattern: string): Promise<PatternMatchResponse> => {
    const payload: PatternMatchRequest = {text, pattern};
    const response = await axios.post<PatternMatchResponse>(
        BASE_URL + "/run/z-algo",
        payload
    )

    return response.data;
}

export const run_boyer_moore = async (text: string, pattern: string): Promise<Payload> => {
    const payload: PatternMatchRequest = {text, pattern};
    const response = await axios.post<Payload>(
        BASE_URL + "/run/boyer-moore",
        payload
    )

    return response.data;
}