
const load = typeof fetch === 'function'
    ? async (url: string) => fetch(url).then(
        r => r.ok ? r.json() : r.status === 404 ? {} : null
    ).catch(e => console.error(e))
    : async (url: string) => {
        try {
            return require(url);
        } catch (e) {
            return {};
        }
    };

export class UCD {
    private baseurl: string;
    public xmlns: string;
    public repertoire: { char: object };
    constructor(baseurl: string) {
        this.baseurl = baseurl;
        this.repertoire = { char: [] };
    }
    async init() {
        if (this.xmlns) return;
        const url = this.baseurl + '.json';
        const json = await load(url);
        Object.assign(this, json);
    }
    async charinfo(codepoint: number): Promise<object> {
        let cpname = codepoint.toString(16).toUpperCase();
        while (cpname.length < 4) { cpname = '0' + cpname; }
        let json = this.repertoire.char[cpname];
        if (json) return json;
        let path = cpname;
        while (path.length < 6) { path = '0' + path; }
        path = path.replace(/(..)(..)(..)/g, '$1/$2/$3');
        path = this.baseurl + '/repertoire/char/' + path + '.json';
        json = await load(path);
        if (json) this.repertoire.char[cpname] = json;
        return json;
    }
}
