import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanMusicSubject from '../model/DoubanMusicSubject';
import DoubanPlugin from "../../../main";
import DoubanSubject from '../model/DoubanSubject';
import HandleContext from "../model/HandleContext";
import {SupportType, TemplateKey} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";

export default class DoubanMusicLoadHandler extends DoubanAbstractLoadHandler<DoubanMusicSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.MUSIC;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return `https://img1.doubanio.com/view/subject/m/public/${fileName}`;
	}

	parseText(beforeContent: string, extract: DoubanMusicSubject, context: HandleContext): string {
		const {settings} = context;
		return beforeContent
			.replaceAll("{{actor}}", this.handleArray(extract.actor, context ))
			.replaceAll("{{barcode}}", extract.barcode ? extract.barcode : "")
			.replaceAll("{{medium}}", extract.medium ? extract.medium : "")
			.replaceAll("{{albumType}}", extract.albumType ? extract.albumType : "")
			.replaceAll("{{records}}", extract.records ? extract.records + "" : "")
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("音乐") || extract.type.contains("Music") || extract.type.contains("music"));
	}

	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		let rate = html('input#n_rating').val();
		let tagsStr = html('span#rating').next().next().text().trim();
		let tags = tagsStr ? tagsStr.replace('标签:', '').trim().split(' ') : null;
		let stateWord = html('div#interest_sect_level > div.a_stars > span.mr10').text().trim();
		let collectionDateStr = html('div#interest_sect_level > div.a_stars > span.mr10').next().text().trim();
		let userState1 = DoubanAbstractLoadHandler.getUserState(stateWord);
		let component = html('span#rating').next().next().next().next().text().trim();

		const userState: UserStateSubject = {
			tags: tags,
			rate: rate?Number(rate):null,
			state: userState1,
			collectionDate: collectionDateStr?moment(collectionDateStr, 'YYYY-MM-DD').toDate():null,
			comment: component
		}
		return {data: html, userState: userState};
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanMusicSubject {
		let title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
		let desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
		let url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
		let image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
		let score = html(html("#interest_sectl > div > div.rating_self.clearfix > strong[property= 'v:average']").get(0)).text();
		let detailDom = html(html("#info").get(0));
		let publish = detailDom.find("span.pl");

		let valueMap = new Map<string, string>();

		publish.map((index, info) => {
			let key = html(info).text().trim();
			let value = '';
			if (key.indexOf('表演者') >= 0) {
				// value = html(info.next.next).text().trim();
				let vas: string[] = key.split("\n                                    \n                                    ");
				value = vas && vas.length > 1 ? vas[1] : "";
				key = vas && vas.length > 0 ? vas[0] : "";
			} else {
				value = html(info.next).text().trim();
			}
			valueMap.set(MusicKeyValueMap.get(key), value);
		})

		let idPattern = /(\d){5,10}/g;
		let id = idPattern.exec(url);

		const result: DoubanMusicSubject = {
			image: image,
			imageUrl: image,
			datePublished: valueMap.has('datePublished') ? new Date(valueMap.get('datePublished')) : undefined,
			publisher: valueMap.has('publisher') ? valueMap.get('publisher') : "",
			score: Number(score),
			records: valueMap.has('records') ? Number(valueMap.get('records')) : null,
			id: id ? id[0] : "",
			type: this.getSupportType(),
			title: title,
			desc: desc,
			url: url,
			actor: [valueMap.has('actor') ? valueMap.get('actor') : null],
			genre: valueMap.has('genre') ? [valueMap.get('genre')] : [""],
			albumType: valueMap.has('albumType') ? valueMap.get('albumType') : "",
			medium: valueMap.has('medium') ? valueMap.get('medium') : "",
			barcode: valueMap.has('barcode') ? valueMap.get('barcode') : ""
		};
		return result;
	}


}


const MusicKeyValueMap: Map<string, string> = new Map(
	[['表演者:', 'actor'],
		['流派:', 'genre'],
		['发行时间:', 'datePublished'],
		['专辑类型:', 'albumType'],
		['介质:', 'medium'],
		['出版者:', 'publisher'],
		['唱片数:', 'records'],
		['条形码:', 'barcode']]
);
