export interface Member {
    _id ?: number;
    socialid ?: string;
    uname?: string;
    fname?: string;
    lname?: string;
    referer? : Member;
    gender ?: string;
    email?: string;
    birthyear ?: number;
    origin ?: string;
    originDisplay ?: string;
    location ?:string;
    locationDisplay ? : string;
    postcode ?: string;
    lat ?: number;
    long ?: number;
    membertype ?: string;
    musictype ?: string;
    startyear ?: number;
    bio ?: string;
    favouriteparty ?: string;
    partyfrequency ?: string;
    favouritefestival ?: string;
    partyfrequencyDisplay ?: string;
    festivalfrequencyDisplay ?: string;
    festivalfrequency ?: string;
    favouriteartists ?: string;
    facebookUrl ?: string;
    soundcloudUrl ?: string;
    websiteUrl ?: string;
    psystatus ?: string;
    reason ?: string;
    avatarUrl ?: string;
    karmicKudos ?: number;
}

export interface Video {
    title: string;
    description: string;
    value: string;
    createdBy: Member;
    _id ?: string;
}

export interface Artist {
  name: string;
  origin: string;
  facebookUrl: string;
  createdBy: Member;
  _id ?: string;
}
