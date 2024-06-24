"use server"

import ytdl from "ytdl-core"

const getVideoInfo = async (url: string) => {
  return await ytdl.getInfo(url)
}

export default getVideoInfo
