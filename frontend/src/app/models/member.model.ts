export interface Member {
    _id ?: number;
    socialid ?: String;
    fname: String;
    lname: String;
    gender ?: String;
    email: String;
    birthyear ?: number;
    origin ?: String;
    postcode ?: String;
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
    psystatus ?: String;
    reason ?: String;
}
