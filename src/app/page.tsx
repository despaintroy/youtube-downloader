"use client"

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  ToggleButtonGroup
} from "@mui/joy"
import {parseAsStringEnum, useQueryState} from "nuqs"
import {Download, InfoOutlined} from "@mui/icons-material"
import useVideoInfo from "@/hooks/useVideoInfo"
import useDownloadVideo from "@/hooks/useDownloadVideo"

enum Medium {
  Video = "video",
  Audio = "audio",
  VideoAudio = "video-audio",
}

export default function Home() {
  const [link, setLink] = useQueryState("link")
  const [medium, setMedium] = useQueryState<Medium>("medium", parseAsStringEnum(Object.values(Medium)).withDefault(Medium.VideoAudio))

  const {isValidLink, status: infoStatus, videoInfo} = useVideoInfo(link)
  const {startDownload, closeDownload, downloadURL, status: downloadStatus, selectedItag} = useDownloadVideo()

  const showError = !!link && !isValidLink

  const filteredFormats = videoInfo?.formats.filter(format => {
    if (format.container !== "mp4") return false

    switch (medium) {
      case Medium.Video:
        return format.hasVideo && !format.hasAudio
      case Medium.Audio:
        return !format.hasVideo && format.hasAudio
      case Medium.VideoAudio:
        return format.hasVideo && format.hasAudio
    }
  })

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

      {infoStatus === "error" && (
        <Alert color="danger">Error getting video info</Alert>
      )}


      {infoStatus === "loading" && <Stack spacing={1}>
        <Box sx={{textAlign: "center"}}><CircularProgress /></Box>
      </Stack>}

      {infoStatus === "success" && (
        <div>
          <ToggleButtonGroup
            value={medium}
            onChange={(e, newValue) => setMedium(newValue)}
          >
            <Button value={Medium.VideoAudio}>Video & Audio</Button>
            <Button value={Medium.Audio}>Audio Only</Button>
            <Button value={Medium.Video}>Video Only</Button>
          </ToggleButtonGroup>

          <List>
            {link && filteredFormats ? filteredFormats.map((format, index) => {
              let label = format.hasVideo && format.hasAudio ? "Video + Audio" : format.hasVideo ? "Video" : "Audio"
              if (format.qualityLabel) label += ` - ${format.qualityLabel}`
              label += ` (${(+format.contentLength / 1024 / 1024).toFixed(1)} MB)`

              return (
                <ListItem key={[format.itag, format.contentLength].join("-")}>
                  <ListItemButton onClick={() => startDownload(link, format.itag)}>
                    <ListItemDecorator>
                      {downloadStatus === "loading" && selectedItag === format.itag ? (
                        <CircularProgress size="sm" />
                      ) : (
                        <Download />
                      )}
                    </ListItemDecorator>
                    <ListItemContent>{label}</ListItemContent>
                  </ListItemButton>
                </ListItem>
              )
            }) : null}
          </List>
        </div>
      )}

      {downloadStatus === "loading" && (
        <p>Downloading...</p>
      )}

      {downloadStatus === "error" && (
        <p>Error downloading</p>
      )}

      {downloadStatus === "success" && !!downloadURL && (
        <a href={downloadURL} download="foo-bar.mp4">
          Save
        </a>
      )}
    </Container>
  )
}
