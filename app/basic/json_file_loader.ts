import fs from "fs";

class JSONFileLoader {
  private _path: string;
	constructor() {
		this._path = __dirname + '/../';
	}
	loadJsonFile(filename: string) {
		let filePath = this._path + filename;
		let file = fs.readFileSync(filePath, 'utf-8');
		let obj = JSON.parse(file);
		return obj;
	}
	loadTemplateFile(filename: string) {
		let filePath = this._path + filename;
		let file = fs.readFileSync(filePath + '.xml');
		return file.toString();
	}
	loadAll(dir: string) {
		let path = this._path + dir;
		let files: {[file: string]: any} = {};
		let items: string[] = fs.readdirSync(path);
		items.forEach((file: string) => {
			let filePath = dir + '/' + file;
			files[file] = this.loadJsonFile(filePath);
		});
		return files;
	}
}

export default JSONFileLoader;