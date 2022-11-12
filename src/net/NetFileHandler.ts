import { requestUrl, RequestUrlParam} from "obsidian";
import {log} from "../utils/Logutil";
import {i18nHelper} from "../lang/helper";
import FileHandler from "../file/FileHandler";
import {FileUtil} from "../utils/FileUtil";

export default class NetFileHandler {
	private fileHandler: FileHandler;

	constructor(fileHandler: FileHandler) {
		this.fileHandler = fileHandler;
	}

	async downloadFile(url: string, folder:string, filename: string): Promise<{ success: boolean, error:string, filepath: string }> {
		const requestUrlParam: RequestUrlParam = {
			url: url,
			method: "GET",
			throw: true,
			headers: {}
		};
		const filePath:string = FileUtil.join(folder, filename);
		return requestUrl(requestUrlParam)
			.then((response) => {
				this.fileHandler.creatAttachmentWithData(filePath, response.arrayBuffer);
			}).then(() => {
				return {success: true, error: '', filepath: filePath};
			})
			.catch(e => log
				.error(
					i18nHelper.getMessage('130101')
						.replace('{0}',  e.toString())
					, e));
		;
	}
}

