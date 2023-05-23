"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const vscode_1 = __importDefault(require("vscode"));
const Contents_1 = __importDefault(require("./Contents"));
class Tags {
    // 0. resource ---------------------------------------------------------------------------------->
    constructor() { this.main(); }
    activePath = path_1.default.basename(__filename);
    filePath = vscode_1.default.window.activeTextEditor?.document.uri.fsPath;
    // 1. data -------------------------------------------------------------------------------------->
    data() {
        return new Contents_1.default().main().toString();
    }
    // 2. main -------------------------------------------------------------------------------------->
    main() {
        let data = this.data();
        if (this.filePath) {
            const rules1 = /(<)(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(\s*)(.*?)(\/>)(\s*)/gm;
            const rules2 = /(<)(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(\s*)(.*?)(?!\/)(>)(\s*)/gm;
            const result = lodash_1.default.chain(data)
                .replace(rules1, (match, p1, p2, p3, p4, p5, p6) => {
                return `${p1}${p2}${p3}${p4}>${p6}`;
            })
                .replace(rules2, (match, p1, p2, p3, p4, p5, p6) => {
                return `${p1}${p2}${p3}${p4}/>${p6}`;
            })
                .value();
            fs_1.default.writeFileSync(this.filePath, result, "utf8");
            return result;
        }
    }
    // 3. output ------------------------------------------------------------------------------------>
    output() {
        return console.log("_____________________\n" + this.activePath + "  실행");
    }
}
exports.default = Tags;
//# sourceMappingURL=Tags.js.map