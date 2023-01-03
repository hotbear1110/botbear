declare global {
    export namespace SQL {
        export enum SuggestionStatus {
            Unfinished = 0,
            Finished = 1,
            Duplicate = 2,
            Trashed = 3,
            Unhandled = 4
        }
        
        export interface Aliases {
            Aliases: string[];
        }
        export interface Ask {
            ID: number;
            User?: string;
            Channel?: string;
            Prompt?: string;
            Response?: string;
            Timestamp: number; // UNIX_TIMESTAMP
        }
        export interface Cdr {
            ID: number;
            User?: string;
            Status?: string;
            Channel?: string;
            RemindTime?: number;
            Mode: number;
        }
        export interface Commands {
            Name?: string;
            Command?: string;
            Perm?: number;
            Category?: string;
            Cooldown?: string;
        }
        export interface Cookies {
            ID: number;
            User?: string;
            Status?: string;
            Channel?: string;
            RemindTime?: number;
            Mode: number | 0;
        }
        export interface Dalle {
            ID: number;
            User?: string;
            Channel?: string;
            Prompt?: string;
            Image?: string;
            Timestamp: number; // UNIX_TIMESTAMP
        }
        export interface Latency {
            ID: number;
            Latency?: number; // Double
            Time: Date;
        }
        export interface MyPing {
            username?: string;
            game_pings?: string;
        }
        export interface MyPoints {
            username?: string;
            points?: number; 
        }
        export interface NukeList {
            ID?: string;
            User?: string;
        }
        export interface Spotify {
            username?: string;
            uid?: number;
            state: string | '0';
            access_token: string | '';
            refresh_token: string | '';
            expires_in?: string;
            opt_in: string | 'false';
        }
        export interface Streamers {
            username?: string;
            uid?: number;
            islive?: number;
            liveemote?: string;
            titleemote?: string;
            gameemote?: string;
            offlineemote?: string;
            live_ping?: string;
            offline_ping: string;
            banphraseapi: string;
            banphraseapi2?: string;
            title?: string;
            title_ping?: string;
            game?: string;
            game_ping?: string;
            game_time?: number;
            emote_list?: string;
            emote_removed?: string;
            disabled_commands?: string;
            trivia_cooldowns: number | 30000;
            offlineonly: number | 0;
            seventv_sub: number | 0;
            title_time?: number;
            command_default: number | 0;
        }
        export interface Suggestions {
            ID: number;
            User?: string;
            Suggestion?: string;
            Status: SuggestionStatus | SuggestionStatus.Unfinished;
            Description?: string;
        }
        export interface Users {
            ID: string;
            username?: string;
            uid?: number;
            permission: number | 100;
            date_spotted: number; // UNIX_TIMESTAMP
        }
        export interface Yabbe_bans {
            Command?: string;
            User?: string;
        }
        export interface Yabbe_pet {
            ID: number;
            User?: string;
            Pet?: string;
            Pet_name?: string;
            Image?: string;
        }
    }
}

export {};
