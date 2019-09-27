import { Message } from '@progress/kendo-angular-conversational-ui';
export interface Member {
  _id?: string;
  socialid?: string;
  uname?: string;
  fname?: string;
  lname?: string;
  referer?: Member;
  gender?: string;
  email?: string;
  birthyear?: number;
  age?:number;
  origin?: string;
  originDisplay?: string;
  location?: string;
  locationDisplay?: string;
  postcode?: string;
  lat?: number;
  long?: number;
  membertype?: string;
  membertypeDisplay?: string;
  musictype?: Array<StaticData>;
  startyear?: number;
  bio?: string;
  favouriteparty?: string;
  partyfrequency?: string;
  favouritefestivals?: Array<StaticData>;
  partyfrequencyDisplay?: string;
  festivalfrequencyDisplay?: string;
  festivalfrequency?: string;
  favouriteartists?:  Array<StaticData>;
  facebookUrl?: string;
  soundcloudUrl?: string;
  websiteUrl?: string;
  psystatus?: string;
  reason?: string;
  avatar?: string;
  avatarext?: string;
  avatarUrl?: string;
  karmicKudos?: number;
}

export interface Video {
  title: string;
  description: string;
  value: string;
  tags?: Array<string>;
  createdBy: Member;
  createdAt?: Date;
  _id?: string;
}

export interface StaticData {
  name: string;
  type: string;
  origin?: string;
  facebookUrl?: string;
  location?: string;
  createdBy: Member;
  createdAt?: Date;
  _id?: string;
}

export interface Avatar {
  createdBy?: string;
  content: string;
  _id?: string;
}
export interface WallPost {
  title: string;
  tags?: Array<string>;
  content: string;
  createdBy: Member;
  _id?: string;
}

export interface Message {
  title: string;
  content: string;
  createdBy : Member;
  createdAt? : Date;
  receiver: Member;
}
