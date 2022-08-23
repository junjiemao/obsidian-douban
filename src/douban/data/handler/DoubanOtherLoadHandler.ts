import { Editor, Notice } from "obsidian";

import { CheerioAPI } from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import { DoubanPluginSettings } from "src/douban/Douban";
import DoubanSubject from "../model/DoubanSubject";
import { i18nHelper } from "src/lang/helper";
import { log } from "src/utils/Logutil";

/**
 * 默认的处理器
 */
export default class DoubanOtherLoadHandler extends DoubanAbstractLoadHandler<DoubanSubject> {
    parseText(extract: DoubanSubject, settings:DoubanPluginSettings): string {
       log.warn(i18nHelper.getMessage('current version not support type'));
       return "";
    }
    support(extract: DoubanSubject): boolean {
        return false;
    }
    parseSubjectFromHtml(data: CheerioAPI): DoubanSubject {
       return undefined;
    }





}