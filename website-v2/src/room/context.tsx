import React from "react"
import { observable, action } from "mobx"
import AgoraRTC, {
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  UID,
  ILocalTrack,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from "agora-rtc-sdk-ng"

import { RoomAPI } from "api/room"
import { IRoomInfo } from "models"

export class RoomStore {
  @observable
  uuid?: string

  @observable
  info?: IRoomInfo

  @observable
  rtcClient?: IAgoraRTCClient

  @observable
  rtcUID?: UID

  @observable
  localTracks = observable.array<ILocalTrack>([])

  @observable
  remoteVideoTracks = observable.map<UID, IRemoteVideoTrack>()

  @observable
  remoteAudioTracks = observable.map<UID, IRemoteAudioTrack>()

  @action
  async init(uuid?: string) {
    if (uuid !== undefined) {
      this.uuid = uuid
      this.info = await RoomAPI.Info(uuid)

      this.initRTC(this.info)
    }
  }

  @action
  async initRTC(info: IRoomInfo) {
    const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

    const [uid, localAudioTrack, localVideoTrack] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
      client.join(info.rtc_app_id || "", info.rtc_channel || "", null), // join the channel
      AgoraRTC.createMicrophoneAudioTrack(),                            // create local tracks, using microphone
      AgoraRTC.createCameraVideoTrack()                                 // create local tracks, using camera
    ])

    this.rtcClient = client
    this.rtcUID = uid
    this.localTracks.replace([localAudioTrack, localVideoTrack])
  }

  @action
  async subscribeRemoteTracks() {

    // 远端用户发布
    this.rtcClient?.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {

      await this.rtcClient?.subscribe(user) // 开始订阅远端用户

      if (["all", "video"].includes(mediaType) && user.videoTrack) { // 获取远端视频轨道对象
        this.remoteVideoTracks.set(user.uid, user.videoTrack)
      }

      if (["all", "audio"].includes(mediaType) && user.audioTrack) { // 获取远端音视频轨道对象
        this.remoteAudioTracks.set(user.uid, user.audioTrack)
      }
    })

    // 远端用户取消发布/远端用户离开了频道
    this.rtcClient?.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {
      switch (mediaType) {
        case "audio":
          this.remoteAudioTracks.delete(user.uid)
          break
        case "video":
          this.remoteVideoTracks.delete(user.uid)
          break
        default:
          this.remoteAudioTracks.delete(user.uid)
          this.remoteVideoTracks.delete(user.uid)
          break
      }
    })
  }

  @action
  async leave() {
    this.localTracks.forEach((track) => {
      track.stop()
      track.close()
    })

    this.localTracks.clear()
    await this.rtcClient?.leave()
  }
}

export const roomContext = React.createContext({
  roomStore: new RoomStore()
})

export const useRoomStore = () => React.useContext(roomContext)
