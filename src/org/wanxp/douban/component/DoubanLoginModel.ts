import { Notice } from 'obsidian';
import { log } from 'src/org/wanxp/utils/Logutil';
import {i18nHelper} from "../../lang/helper";
import {DoubanSettingTab} from "../setting/DoubanSettingTab";
import SettingsManager from "../setting/SettingsManager";
import {constructDoubanTokenSettingsUI} from "../setting/BasicSettingsHelper";

// Credits go to zhaohongxuan's Weread Plugin : https://github.com/zhaohongxuan/obsidian-weread-plugin


export default class DoubanLoginModel {
	private modal: any;
	private containerEl: HTMLElement;
	private settingsManager: SettingsManager;
	constructor(containerEl: HTMLElement, settingsManager: SettingsManager) {
		this.containerEl = containerEl;
		this.settingsManager = settingsManager;

		const { remote } = require('electron');
		const { BrowserWindow: RemoteBrowserWindow } = remote;
		this.modal = new RemoteBrowserWindow({
			parent: remote.getCurrentWindow(),
			width: 960,
			height: 540,
			show: false
		});

		this.modal.once('ready-to-show', () => {
			this.modal.setTitle(i18nHelper.getMessage('100101'));
			this.modal.show();
		});
		this.modal.on('closed', () => {
			constructDoubanTokenSettingsUI(this.containerEl, this.settingsManager);
		});

		const session = this.modal.webContents.session;
		const filter = {
			urls: ['https://www.douban.com/','https://accounts.douban.com/','https://accounts.douban.com/passport/login']
		};
		session.webRequest.onSendHeaders(filter, async (details:any) => {
			const cookies = details.requestHeaders['Cookie'];
			const cookieArr = this.parseCookies(cookies);
			// const wr_name = cookieArr.find((cookie) => cookie.name == 'wr_name').value;
			if (cookieArr) {
				let user = await settingsManager.plugin.userComponent.loginCookie(cookieArr);
				if (user && user.login) {
					this.onClose();
				}
			} else {
				this.onReload();
			}
		});
	}

	private parseCookies(cookies: any) {
		return cookies;
	}

	async doLogin() {
		try {
			await this.modal.loadURL('https://accounts.douban.com/passport/login');
		} catch (error) {
			log.error(i18nHelper.getMessage('100101'), error)
		}
	}

	onClose() {
		this.modal.close();
	}

	onReload() {
		this.modal.reload();
	}
}