export interface Member {
    _id ?: number;
    socialid ?: string;
    uname?: string;
    fname?: string;
    lname?: string;
    gender ?: string;
    email?: string;
    birthyear ?: number;
    origin ?: string;
    location ?:string;
    postcode ?: string;
    lat ?: number;
    long ?: number;
    membertype ?: string;
    musictype ?: string;
    startyear ?: number;
    bio ?: string;
    favouriteparty ?: string;
    partyfrequency ?: number;
    favouritefestival ?: string;
    festivalfrequency ?: number;
    facebookurl ?: string;
    soundcloudurl ?: string;
    websiteurl ?: string;
    psystatus ?: string;
    reason ?: string;
}

export interface Video {
    title : string;
    value : string;
}