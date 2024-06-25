"use client"

import {
  Alert,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup, Skeleton,
  Stack
} from "@mui/joy"
import {parseAsInteger, useQueryState} from "nuqs"
import {InfoOutlined} from "@mui/icons-material"
import {useVideoInfo} from "@/hooks/useVideoInfo"

export default function Home() {
  const [link, setLink] = useQueryState("link")
  const [itag, setItag] = useQueryState("itag", parseAsInteger)

  const {isValidLink, status, videoInfo} = useVideoInfo(link)

  // const download = async () => {
  //   if (state.status !== "infoReady" || !link) return
  //
  //   const format = state.info.formats.find((format) => format.itag === state.itag)
  //   if (!format) return
  //
  //   const requestURL = `/api/download?link=${link}&itag=${state.itag}`
  //   const response = await axios.get(requestURL, {responseType: "blob"})
  //   const blob = new Blob([response.data], {type: "video/mp4"})
  //   dispatch({type: "downloadSuccess", blob})
  // }

  const showError = !!link && !isValidLink

  return (
    <Container maxWidth="md" sx={{my: 5}} component={Stack} spacing={3}>
      <FormControl error={showError}>
        <FormLabel>YouTube Link</FormLabel>
        <Input size="lg" fullWidth type="url" placeholder="YouTube Link" value={link ?? ""}
               onChange={(event) => setLink(event.target.value)} />
        {showError && (<FormHelperText>
          <InfoOutlined />
          Invalid YouTube link
        </FormHelperText>)}
      </FormControl>

      {status === "error" && (
        <Alert color="danger">Error getting video info</Alert>
      )}

      {(status === "success" || status === "loading") && (
        <div>
          <FormControl>
            <FormLabel>Format</FormLabel>
            <RadioGroup
              value={itag}
              onChange={(event) => setItag(+event.target.value)}
            >
              {(status === "loading") && (
                <Stack maxWidth={200}>
                  {Array.from({length: 8}).map((_, index) => (
                    <Skeleton key={index} variant="text" />
                  ))}
                </Stack>
              )}

              {videoInfo?.formats.filter(format => format.container === "mp4").map((format) => {
                let label = format.hasVideo && format.hasAudio ? "Video + Audio" : format.hasVideo ? "Video" : "Audio"
                if (format.qualityLabel) label += ` - ${format.qualityLabel}`
                label += ` (${(+format.contentLength / 1024 / 1024).toFixed(1)} MB)`

                return (
                  <Radio
                    key={format.itag}
                    value={format.itag}
                    label={label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>

          {/*<button onClick={download} disabled={state.status === "downloadLoading"}>*/}
          {/*  Download*/}
          {/*</button>*/}
        </div>
      )}


      {/*{state.status === "downloadLoading" && (*/}
      {/*  <p>Loading...</p>*/}
      {/*)}*/}

      {/*{state.status === "downloadError" && (*/}
      {/*  <p>Error downloading</p>*/}
      {/*)}*/}

      {/*{state.status === "downloadReady" && (*/}
      {/*  <a href={URL.createObjectURL(state.blob)} download="foo-bar.mp4">*/}
      {/*    Download*/}
      {/*  </a>*/}
      {/*)}*/}
    </Container>
  )
}
