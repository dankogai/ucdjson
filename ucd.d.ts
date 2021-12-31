export declare class UCD {
    private baseurl;
    xmlns: string;
    repertoire: {
        char: object;
    };
    constructor(baseurl: string);
    init(): Promise<void>;
    charinfo(codepoint: number): Promise<object>;
}
