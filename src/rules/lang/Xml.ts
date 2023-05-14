import * as fs from "fs";
import * as path from "path";
import * as lodash from "lodash";
import * as vscode from "vscode";
import xmlFormat from "xml-formatter";
import Contents from "../../core/Contents";

class Xml {

  // 0. resource ---------------------------------------------------------------------------------->
  constructor() {this.main();}
  private activePath = path.basename(__filename);
  private filePath = vscode.window.activeTextEditor?.document.uri.fsPath;

  // 1. data -------------------------------------------------------------------------------------->
  public data() {
    if (this.filePath) {
      const data = new Contents().data();

      const rulesOne
      = /(?<=[^!-~]|[;]|[(){}<>])(\/\/|\/\*|^\*|\*\/|<!--|<%--)(.*)(?<=[\s\S]*)/gm;

      const rulesTwo
      = /(?<!([<]|["'].*))(\s*)(===|==|=|!===|!==|!=|&&|<=|>=|=>|\+\+|\+-|\+=|-=|\+|-|[*])(\s*)(?!(.*[\/>]|[>]))/gm;

      // 3. replace
      const result = lodash.chain(data)
      .replace(rulesOne, (match, p1, p2, p3) => {
        return ``;
      })
      .replace(rulesTwo, (match, p1, p2, p3, p4, p5) => {
        return ` ${p3} `;
      })
      .value();

      fs.writeFileSync(this.filePath, result);
      return result;
    }
    else {
      return new Error("파일 경로를 찾을 수 없습니다.");
    }
  }

  // 2. main -------------------------------------------------------------------------------------->
  public main() {

    const data = this.data();
    if (data instanceof Error) {
      return data;
    }
    else {
      const formattedCode = xmlFormat(data, {
        indentation: "  ",
        collapseContent: false,
        lineSeparator: "\n",
        whiteSpaceAtEndOfSelfclosingTag: false,
        filter: (node) => node.type !== "Comment",
        throwOnFailure: false,
      });
      if(this.filePath) {
        fs.writeFileSync(this.filePath, formattedCode);
      }
      return formattedCode;
    }
  }

  // 3. output ------------------------------------------------------------------------------------>
  public output() {
    return console.log("_____________________\n" + this.activePath + "  실행");
  }
}

export default Xml;