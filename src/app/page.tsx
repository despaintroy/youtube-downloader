"use client"

import styles from "./page.module.css"
import {FormEventHandler, useReducer} from "react"
import getVideoInfo from "@/app/actions/getVideoInfo"
import axios from "axios"
import {videoInfo, validateURL} from "ytdl-core"

export default function Home() {
  const [state, dispatch] = useReducer(reducer, {status: "idle", url: ""})

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const url = formData.get("url")

    if (typeof url !== "string" || !url) {
      dispatch({type: "infoError", error: "URL is required"})
      return
    }

    if (!validateURL(url)) {
      dispatch({type: "infoError", error: "Invalid YouTube link"})
      return
    }

    dispatch({type: "urlSubmit"})

    getVideoInfo(url)
      .then((info) => dispatch({type: "infoSuccess", info}))
      .catch((error) => dispatch({type: "infoError", error: error.message}))
  }

  const download = async () => {
    if (state.status !== "infoReady") return

    const format = state.info.formats.find((format) => format.itag === state.itag)
    if (!format) return

    const requestURL = `/api/download?link=${state.url}&itag=${state.itag}`
    const response = await axios.get(requestURL, {responseType: "blob"})
    const blob = new Blob([response.data], {type: "video/mp4"})
    dispatch({type: "downloadSuccess", blob})
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="url" type="url" placeholder="YouTube URL" value={state.url}
               onChange={(event) => dispatch({type: "urlChange", url: event.target.value})}
        />
        {state.status === "infoError" && (
          <p>Error: {state.error}</p>
        )}
        <button type="submit" disabled={state.status === "infoLoading"}>
          Submit
        </button>
      </form>

      {state.status === "infoLoading" && (
        <p>Loading...</p>
      )}

      {"info" in state && (
        <div>
          {/*  radio select format */}
          {state.info.formats.filter(format => format.container === "mp4").map((format) => {
            const media = format.hasVideo && format.hasAudio ? "video + audio" : format.hasVideo ? "video" : "audio"

            return (
              <div key={format.itag}>
                <input
                  type="radio"
                  name="format"
                  value={format.itag}
                  id={format.itag.toString()}
                  checked={state.itag === format.itag}
                  onChange={() => dispatch({type: "formatChange", itag: format.itag})}
                />
                <label htmlFor={format.itag.toString()}>
                  {format.qualityLabel ?? "other"} ({media}) - {(+format.contentLength / 1024 / 1024).toFixed(1)} MB
                </label>
              </div>
            )
          })}

          <button onClick={download} disabled={state.status === "downloadLoading"}>
            Download
          </button>
        </div>
      )}


      {state.status === "downloadLoading" && (
        <p>Loading...</p>
      )}

      {state.status === "downloadError" && (
        <p>Error downloading</p>
      )}

      {state.status === "downloadReady" && (
        <a href={URL.createObjectURL(state.blob)} download="foo-bar.mp4">
          Download
        </a>
      )}
    </div>
  )
}

type State =
  | {status: "idle", url: string}
  | {status: "infoLoading", url: string}
  | {status: "infoError", url: string, error: string}
  | {status: "infoReady", url: string, info: videoInfo, itag: number | null}
  | {status: "downloadLoading", url: string, info: videoInfo, itag: number | null}
  | {status: "downloadError", url: string, info: videoInfo, itag: number | null}
  | {status: "downloadReady", url: string, info: videoInfo, itag: number | null, blob: Blob}

type Action =
  | {type: "urlChange", url: string}
  | {type: "urlSubmit"}
  | {type: "infoError", error: string}
  | {type: "infoSuccess", info: videoInfo}
  | {type: "formatChange", itag: number}
  | {type: "downloadSubmit"}
  | {type: "downloadError"}
  | {type: "downloadSuccess", blob: Blob}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "urlChange":
      return {status: "idle", url: action.url}
    case "urlSubmit":
      return {status: "infoLoading", url: state.url}
    case "infoError":
      return {status: "infoError", url: state.url, error: action.error}
    case "infoSuccess":
      return {status: "infoReady", url: state.url, info: action.info, itag: null}
    case "formatChange":
      if (state.status !== "infoReady") return state
      return {status: "infoReady", url: state.url, info: state.info, itag: action.itag}
    case "downloadSubmit":
      if (state.status !== "infoReady") return state
      return {status: "downloadLoading", url: state.url, info: state.info, itag: state.itag}
    case "downloadError":
      if (!("info" in state)) return state
      return {status: "downloadError", url: state.url, info: state.info, itag: state.itag}
    case "downloadSuccess":
      if (!("info" in state)) return state
      return {status: "downloadReady", url: state.url, info: state.info, itag: state.itag, blob: action.blob}
    default:
      return state
  }
}
