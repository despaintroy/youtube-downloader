import ytdl from "ytdl-core"
import {NextResponse} from "next/server"

export async function GET(request: Request, response: Response) {
  const {searchParams} = new URL(request.url)
  const url = searchParams.get("link")
  const itag = searchParams.get("itag")
  const responseHeaders = new Headers(response.headers)

  if (!url) {
    return NextResponse.json({data: "No URL"})
  }

  if (!itag) {
    return NextResponse.json({data: "No itag"})
  }

  const randomName = Math.random().toString(36).substring(2, 15)

  responseHeaders.set(
    "Content-Disposition",
    `attachment; filename="${randomName}.mp4"`
  )

  responseHeaders.set(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  )

  const data = ytdl(url, {filter: (format) => format.itag === +itag})

  return new Response(data as any, {
    headers: responseHeaders
  })
}
