import * as fs from "fs";
import * as path from "path";
import * as lodash from "lodash";
import {Extra} from "../../interface/Extra";
import ReadContents from "../common/ReadContents";

class Line implements Extra {

  // 0. resource ---------------------------------------------------------------------------------->
  constructor() {this.main();}
  private filePath = process.argv[2];
  private fileName = path.basename(__filename);
  private fileExt = path.extname(this.filePath);
  private copyPath = this.filePath.slice(0, -this.fileExt.length) + "-2" + this.fileExt;

  // 1. data -------------------------------------------------------------------------------------->
  public data(): string | Error {
    try {
      return new ReadContents().main();
    }
    catch (err) {
      return new Error(`파일내용을 읽을 수 없습니다. \n`);
    }
  }

  // 2. main -------------------------------------------------------------------------------------->
  public main(): string | Error {

    // 0. data
    const data = this.data();
    if (data instanceof Error) {return data;}

    // general tags
    const rulesOne1
    = /(?<=\n+)(^.\s*)(public|private|function)((([\s\S](?!;|class))*?))(\s*)(?<=\{)/gm;
    // XML tags
    const rulesOne2
    = /(?<=\n|^)(\s*)(<(?!\/|(\?xml)|(!DOC)|[^>]*--)[^>]*>)/gm;
    const rulesTwo
    = /(\s*?)(public|private|function)(\s*)([\s\S]*?)(\s*)(\()(\s*)([\s\S]*?)(\s*)(\))(\s*)(([\s\S]*?))(\s*?)(\{)/gm;
    const rulesThree
    = /(\s*?)(ception)(\{)/gm;
    const rulesFour
    = /(\n+)(^.)(\s*)(\})(\s*)(\n)(\s*)(\/\/)/gm;
    const rulesFive
    = /(^.\s*?)(@)(.*)(\n+)(\s*)(\/\/.*?>)(\n+)(\s+)(public|private|function)((([\s\S](?!;|class))*?))(\s*)(?<=\{)/gm;
    const rulesSix
    = /(^\s*?)(import)([\s\S]*?)((;)|(\n+)?)(\s?)(\/\/)([\s\S]*?)(\n+?)(?=import)/gm;
    const rulesSeven
    = /(^\s*?)(import)([\s\S]*?)(;)(\s*)(\n*)(^\s*?)(@)(\s*)(\S*)/gm;
    const rulesEight
    = /(>)(\n*)(?:\})(?:\n*)(function)/gm;

    const result = lodash.chain(data)
    .replace(rulesOne1, (match, p1, p2, p3, p4, p5, p6) => {
      const spaceSize = 100 - (lodash.size(p1) + lodash.size(`// `) + lodash.size(`>`));
      const insetLine = `// ` + `-`.repeat(spaceSize) + `>`;
      return `\n${p1}${insetLine}\n${p1}${p2}${p3}${p6}`;
    })
    .replace(rulesOne2, (match, p1, p2) => {
      const spaceSize = 100 - (lodash.size(p1) + lodash.size(`<!-- `) + lodash.size(` -->`));
      const insetLine = `<!-- ` + `=`.repeat(spaceSize) + ` -->`;
      return `\n${p1}${insetLine}\n${p1}${p2}`;
    })
    .replace(rulesTwo, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15) => {
      return `${p1}${p2} ${p4} ${p6}${p8}${p10} ${p12} ${p15}`;
    })
    .replace(rulesThree, (match, p1, p2, p3) => {
      return `${p2} ${p3}`;
    })
    .replace(rulesFour, (match, p1, p2, p3, p4, p5, p6, p7, p8) => {
      return `${p1}${p2}${p3}${p4}\n\n${p7}${p8}`;
    })
    .replace(rulesFive, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12) => {
      return `${p5}${p6}\n${p5}${p2}${p3}\n${p8}${p9}${p10}`;
    })
    .replace(rulesSix, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9) => {
      return `${p1}${p2}${p3}${p4}\n`;
    })
    .replace(rulesSeven, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10) => {
      return `${p1}${p2}${p3}${p4}\n\n${p8}${p10}`;
    })
    .replace(rulesEight, (match, p1, p2, p3, p4) => {
      return `${p1}\n${p3}`;
    })
    .value();

    fs.writeFileSync(this.filePath, result, "utf8");
    return result;
  }


  // 3. output ------------------------------------------------------------------------------------>
  public output() {
    try {
      return console.log("_____________________\n" + this.fileName + "  실행");
    }
    catch(err) {
      return console.log(new Error());
    }
  }
}

export default Line;
