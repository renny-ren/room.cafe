import { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng"

export interface IRoomArgs {
  name?:    string
  private?: boolean
}

export interface IRoomInfo {
  id?:               number
  uuid:              string
  name?:             string
  private?:          boolean
  state?:            string
  owner?:            number

  rtc_app_id?:       string
  rtc_channel?:      string
  rtc_token?:        string
  rtm_token?:        string

  whiteboard_id?:    string
  whiteboard_token?: string

  created_at?:       number
  updated_at?:       number
}

export interface IRTC {
  client: IAgoraRTCClient,
  localAudioTrack?: IMicrophoneAudioTrack,
  localVideoTrack?: ICameraVideoTrack
}

export interface IRTCArgs {
  rtc_app_id:  string
  rtc_channel: string
  rtc_token:   string
}
