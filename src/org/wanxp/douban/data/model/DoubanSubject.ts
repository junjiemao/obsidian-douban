import {UserStateSubject} from "./UserStateSubject";

export default class DoubanSubject {
	id: string;
	title: string;
	type: string;
	score: number;
	image: string;
	imageUrl: string;
	url: string;
	desc: string;
	publisher: string;
	datePublished: Date;
	genre: string[];
	userState?: UserStateSubject;
}

const ParameterMap: Map<string, string> = new Map([
	['id', ''],
]);

export const DoubanParameter = {
	ID: '{{id}}',
	TITLE: '{{title}}',
	TYPE: '{{type}}',
	SCORE: '{{score}}',
	IMAGE: '{{image}}',
	IMAGE_URL: '{{imageData.url}}',
	URL: '{{url}}',
	DESC: '{{desc}}',
	PUBLISHER: '{{publisher}}',
	DATE_PUBLISHED: '{{datePublished}}',
	TIME_PUBLISHED: '{{timePublished}}',
	YEAR_PUBLISHED: '{{yearPublished}}',
	GENRE: '{{genre}}',
	CURRENT_DATE: '{{currentDate}}',
	CURRENT_TIME: '{{currentTime}}',
}
