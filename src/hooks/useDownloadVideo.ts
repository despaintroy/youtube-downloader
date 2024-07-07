import {useCallback, useRef, useState} from "react"
import axios from "axios"

type Status = "idle" | "loading" | "error" | "success"

type UseDownloadVideoReturn = {
  startDownload(link: string, itag: number): void
  closeDownload(): void
  status: Status
  downloadURL: string | null
  selectedItag: number | null
}

export default function useDownloadVideo(): UseDownloadVideoReturn {
  const [status, setStatus] = useState<Status>("idle")
  const [downloadURL, setDownloadURL] = useState<string | null>(null)
  const [selectedItag, setSelectedItag] = useState<number | null>(null)

  const requestId = useRef(crypto.randomUUID())

  const startDownload = useCallback((link: string, itag: number) => {
    setStatus("loading")
    setSelectedItag(itag)
    setDownloadURL(null)
    const thisRequestId = crypto.randomUUID()
    requestId.current = thisRequestId

    const requestURL = `/api/download?link=${link}&itag=${itag}`
    axios.get(requestURL, {responseType: "blob"})
      .then((response) => {
        if (requestId.current !== thisRequestId) return
        const blob = new Blob([response.data], {type: "video/mp4"})
        const url = URL.createObjectURL(blob)
        setDownloadURL(url)
        setStatus("success")
      })
      .catch(() => {
        if (requestId.current !== thisRequestId) return
        setStatus("error")
      })
  }, [])

  const closeDownload = useCallback(() => {
    setDownloadURL(null)
    setStatus("idle")
    setSelectedItag(null)
  }, [])

  return {status, startDownload, downloadURL, closeDownload, selectedItag}
}
