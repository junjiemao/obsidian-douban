import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanNoteSubject from '../model/DoubanNoteSubject';
import DoubanPlugin from "../../../main";
import DoubanSubject from '../model/DoubanSubject';
import html2markdown from '@notable/html2markdown';
import HandleContext from "../model/HandleContext";
import {SupportType, TemplateKey} from "../../../constant/Constsant";
import {UserStateSubject} from "../model/UserStateSubject";
import {moment} from "obsidian";

export default class DoubanNoteLoadHandler extends DoubanAbstractLoadHandler<DoubanNoteSubject> {

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return SupportType.NOTE;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return ``;
	}

	parseText(beforeContent: string, extract: DoubanNoteSubject, context: HandleContext): string {
		return beforeContent
			.replaceAll("{{authorUrl}}", extract.authorUrl ? extract.authorUrl : "")
			.replaceAll("{{content}}", extract.content ? extract.content : "")
			.replaceAll("{{author}}", extract.author ? extract.author : "")
			;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("日记") || extract.type.contains("Note") || extract.type.contains("Article"));
	}

	analysisUser(html: CheerioAPI, context: HandleContext): {data:CheerioAPI ,  userState: UserStateSubject} {
		return {data: html, userState: null};
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanNoteSubject {
		let title = html(html("head > meta[property= 'og:title']").get(0)).attr("content");
		let desc = html(html("head > meta[property= 'og:description']").get(0)).attr("content");
		let url = html(html("head > meta[property= 'og:url']").get(0)).attr("content");
		let image = html(html("head > meta[property= 'og:image']").get(0)).attr("content");
		let type = html(html("head > meta[property= 'og:type']").get(0)).attr("content");
		let authorA = html(html("a.note-author").get(0));
		let timePublished = html(html(".pub-date").get(0)).text();
		let content = html(html(".note").get(1));
		let idPattern = /(\d){5,10}/g;
		let id = idPattern.exec(url);

		const result: DoubanNoteSubject = {
			image: image,
			imageUrl: image,
			datePublished: timePublished ? new Date(timePublished) : undefined,
			content: content ? html2markdown(content.toString()) : "",
			id: id ? id[0] : "",
			type: this.getSupportType(),
			title: title,
			desc: desc,
			url: url,
			author: authorA ? authorA.text() : null,
			authorUrl: authorA ? authorA.attr("href") : null,
			score: 0,
			publisher: '',
			genre: []
		};
		return result;
	}


}
