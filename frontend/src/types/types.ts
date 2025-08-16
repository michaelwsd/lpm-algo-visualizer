export interface PatternMatchRequest {
    text: string;
    pattern: string; 
}

export interface Step {
    l: number;
    r: number;
    k: number;
    k1?: number;
    z_array: number[];
    comparison?: [number, number];
    match?: boolean;
}

export interface PatternMatchResponse {
    res: number[];
    steps: Step[];
}

export interface Preprocess {
    amap: string[];
    rk: number[][];
    gs: number[];
    mp: number[];
}

export interface BMStep {
    pos: number;
    pointer: number;
    type: string | null;
    match?: boolean;
    comparison?: [number, number];
    shift_len?: number;
    bc: number;
    gs: number;
    skip?: number;
    res?: number[];

}

export interface Payload {
    preprocess: Preprocess;
    steps: BMStep[];
}
