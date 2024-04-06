import data from './music-channel-data.json';

type PlaylistItem = {
    title: string;
    artist: string;
    album: string;
    url: string;
    curator: string;
    artwork: string;
};

type ChannelData = {
    title: string;
    description: string;
    playlist: PlaylistItem[];
};

interface Data {
    [key: string]: ChannelData;
}

class MusicChannel {
    title: string;
    description: string;
    playlist: PlaylistItem[];
    curators: string[];

    constructor(id: string) {
        const channelData: ChannelData = (data as Data)[id];
        if (!channelData) {
            throw new Error(`No data found for id: ${id}`);
        }

        this.title = channelData.title;
        this.description = channelData.description;
        this.playlist = channelData.playlist;

        // Deduplicate curators
        const curatorsSet = new Set(channelData.playlist.map(item => item.curator));
        this.curators = Array.from(curatorsSet);
    }
}

export { MusicChannel };