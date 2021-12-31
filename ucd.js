var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const load = typeof fetch === 'function'
    ? (url) => __awaiter(void 0, void 0, void 0, function* () {
        return fetch(url).then(r => r.ok ? r.json() : r.status === 404 ? {} : null).catch(e => console.error(e));
    })
    : (url) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return require(url);
        }
        catch (e) {
            return {};
        }
    });
export class UCD {
    constructor(baseurl) {
        this.baseurl = baseurl;
        this.repertoire = { char: [] };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.xmlns)
                return;
            const url = this.baseurl + '.json';
            const json = yield load(url);
            Object.assign(this, json);
        });
    }
    charinfo(codepoint) {
        return __awaiter(this, void 0, void 0, function* () {
            let cpname = codepoint.toString(16).toUpperCase();
            while (cpname.length < 4) {
                cpname = '0' + cpname;
            }
            let json = this.repertoire.char[cpname];
            if (json)
                return json;
            let path = cpname;
            while (path.length < 6) {
                path = '0' + path;
            }
            path = path.replace(/(..)(..)(..)/g, '$1/$2/$3');
            path = this.baseurl + '/repertoire/char/' + path + '.json';
            json = yield load(path);
            if (json)
                this.repertoire.char[cpname] = json;
            return json;
        });
    }
}
