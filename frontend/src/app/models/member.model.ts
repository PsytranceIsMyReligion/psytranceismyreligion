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
    facebookUrl ?: string;
    soundcloudUrl ?: string;
    websiteUrl ?: string;
    psystatus ?: string;
    reason ?: string;
    avatarUrl ?: string;
}

export interface Video {
    title : string;
    description : string;
    value : string;   
    createdBy : Member; 
}