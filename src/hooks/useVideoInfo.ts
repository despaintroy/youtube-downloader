import {useEffect, useMemo, useState} from "react"
import {validateURL, videoInfo} from "ytdl-core"
import getVideoInfo from "@/app/actions/getVideoInfo"

type Status = "idle" | "loading" | "error" | "success"

type UseVideoInfoReturn = {
  isValidLink: boolean
  status: Status
  videoInfo: videoInfo | undefined
}

export function useVideoInfo(link: string | null): UseVideoInfoReturn {
  const isValidLink = !!link && validateURL(link)

  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle")
  const [videoInfo, setVideoInfo] = useState<videoInfo | undefined>(undefined)

  useEffect(() => {
    setVideoInfo(undefined)

    if (!isValidLink) {
      setStatus("idle")
      return
    }

    setStatus("loading")

    getVideoInfo(link)
      .then((info) => {
        setStatus("success")
        setVideoInfo(info)
      })
      .catch(() => setStatus("error"))
  }, [isValidLink, link])


  return useMemo(() => ({
    isValidLink,
    status,
    videoInfo
  }), [isValidLink, status, videoInfo])
}
