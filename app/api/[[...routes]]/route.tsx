/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { Box, Text, vars, Columns, Column, Image } from './ui'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { MusicChannel } from './music-channel'
// import { title } from 'process'




type State = {
  playlistPage: number,
  creditsPage: number,
  songUrl: string,
  title: string,
  curators: string[],
  playlist: {
    title: string,
    artist: string,
    album: string,
    url: string,
    curator: string,
    artwork: string,
  }[],
  description: string,
}


const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/api',
  ui: { vars },
  initialState: {
    playlistPage: 0,
    creditsPage: 0,
    songUrl: "",
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

let channel = new MusicChannel('rock-v1')





app.frame('/home/:id?', (c) => {
  const { deriveState } = c
  const { id } = c.req.param()
  if (id) {
    channel = new MusicChannel(id)
  }

  const state = deriveState(previousState => {
    previousState.playlistPage = 0
    previousState.creditsPage = 0
    previousState.songUrl = ""
  })
  const colorNum = Math.floor(Math.random() * 3)

  
  return c.res({
    image: (

      <Box
        grow
        alignHorizontal="center"
        backgroundColor={colorNum === 0 ? 'red300' : colorNum === 1 ? 'blue300' : 'purple300'}
        padding="16"
        color="text300"
        fontFamily="madimi"
        fontSize="32"
      >

        <Text size="32" font="madimi" color="text300">
          {channel.title}
        </Text>
        <Text size="16" font="madimi" color="text300">
          {channel.description}
        </Text>

        <Image
          src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-left.png"
          height="256"
        />
      </Box>
    ),
    intents: [
      <Button value="playlist" action='/playlist'>View</Button>,
      <Button value="listen" action="/listen">Listen</Button>,
      <Button value="credits" action='/credits'>Credits</Button>,
    ],
  })
})


app.frame('/playlist', (c) => {
  const { status, deriveState } = c
  // const answer = getRandomAnswer()
  const colorNum = Math.floor(Math.random() * 3)
  const playlistItemsPerPage = 1
  const state = deriveState(previousState => {
    previousState.playlistPage++
  })
  const playlistStart = (state.playlistPage-1) * playlistItemsPerPage
  const playlistEnd = playlistStart + playlistItemsPerPage
  const playlist = channel.playlist.slice(playlistStart, playlistEnd)
  const playlistHasNext = playlistEnd < channel.playlist.length
  return c.res({
    image: (
      <Columns gap="1" alignVertical='center' grow>
        <Column width='1/4'>
          <Box
            grow
            alignHorizontal="center"
            backgroundColor={colorNum === 0 ? 'red100' : colorNum === 1 ? 'blue100' : 'purple100'}
            padding="16"
            fontFamily={'madimi'}
            fontSize="14"
            color={'text300'}
          >
            {/* <Text color="text300" size="14" fontFamily="madimi"> */}
            Froggie says...

            <Image
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-right.png"
              height="256"
            />
          </Box>
        </Column>
        <Column width='3/4'>
          <Box
            grow
            alignHorizontal="center"
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red300' : colorNum === 1 ? 'blue300' : 'purple300'}
            textAlign='center'
            padding="32"
            fontFamily="madimi"
            fontSize="20"
          >
            {
              playlist.map((item, index) => (
                <>
                  <Box >
                    '{item.title}' by {item.artist}
                  </Box>
                  
                </>

              ))
            }

            <Text size="20" font="madimi" color="text300">
              Page {state.playlistPage}
            </Text>
          </Box>
        </Column>
      </Columns>
    ),
    intents: [
      <Button.Reset>Home</Button.Reset>,
      playlistHasNext && <Button value="home">Next {state.playlistPage.toString()}</Button>,
    ],
  })
})


app.frame('/credits', (c) => {
  const { deriveState } = c
  const colorNum = Math.floor(Math.random() * 3)
  const creditItemsPerPage = 2
  const state = deriveState(previousState => {
    previousState.creditsPage++
  })
  const creditsStart = (state.creditsPage-1) * creditItemsPerPage
  const creditsEnd = creditsStart + creditItemsPerPage
  const credits = channel.curators.slice(creditsStart, creditsEnd)
  const creditsHasNext = creditsEnd < channel.curators.length
  return c.res({
    image: (
      <Columns gap="1" alignVertical='center' grow>
        <Column width='1/4'>
          <Box
            grow
            alignHorizontal="center"
            backgroundColor={colorNum === 0 ? 'red100' : colorNum === 1 ? 'blue100' : 'purple100'}
            padding="16"
            fontFamily={'madimi'}
            fontSize="14"
            color={'text300'}
          >
            {/* <Text color="text300" size="14" fontFamily="madimi"> */}
            Froggie says...

            <Image
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-right.png"
              height="256"
            />
          </Box>
        </Column>
        <Column width='3/4'>
          <Box
            grow
            alignHorizontal="center"
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red300' : colorNum === 1 ? 'blue300' : 'purple300'}
            textAlign='center'
            padding="32"
            fontFamily="madimi"
            fontSize="64"
          >
            {
              credits.map((item, index) => (
                <>
                  <Box >
                    {item}
                  </Box>
                  
                </>

              ))
            }
            <Text size="20" font="madimi" color="text300">
            Page {state.creditsPage}
            </Text>
          </Box>
        </Column>
      </Columns>
    ),
    intents: [
      <Button.Reset>Home</Button.Reset>,
      creditsHasNext && <Button value="home">Next {state.creditsPage.toString()}</Button>,
    ],
  })
})

let currentSongIndex = 0
app.frame('/listen', (c) => {
  const { status, buttonValue, deriveState } = c
  // const answer = getRandomAnswer()
  const colorNum = Math.floor(Math.random() * 3)
  if (buttonValue === 'random') {
    currentSongIndex = Math.floor(Math.random() * channel.playlist.length)
  }
  if (buttonValue === 'next') {
    currentSongIndex++
    if (currentSongIndex >= channel.playlist.length) {
      currentSongIndex = 0
    }
  }
  const currentSong = channel.playlist[currentSongIndex]
  const state = deriveState(previousState => {
    previousState.songUrl = currentSong.url
  })
  


  return c.res({
    image: (
      <Columns gap="1" alignVertical='center' grow>
        <Column width='1/4'>
          <Box
            grow
            alignHorizontal="center"
            backgroundColor={colorNum === 0 ? 'red100' : colorNum === 1 ? 'blue100' : 'purple100'}
            padding="16"
            fontFamily={'madimi'}
            fontSize="14"
            color={'text300'}
          >
            {/* <Text color="text300" size="14" fontFamily="madimi"> */}
            Froggie says...

            <Image
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-right.png"
              height="256"
            />
          </Box>
        </Column>
        <Column width='3/4'>
          <Box
            grow
            alignHorizontal="center"
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red300' : colorNum === 1 ? 'blue300' : 'purple300'}
            textAlign='center'
            padding="32"
            fontFamily="madimi"
            fontSize="20"
          >
            {currentSong.title} by {currentSong.artist}
            <Box>
              <Image src={currentSong.artwork} height="256" />
              </Box>
          </Box>
        </Column>
      </Columns>
    ),
    intents: [
      <Button.Reset>Home</Button.Reset>,
      // <Button.Link href={state.songUrl}>Play Song</Button.Link>,
      <Button.Redirect location={state.songUrl}>Play Song</Button.Redirect>,
      <Button value="random">Shuffle</Button>,
      <Button value="next">Next</Button>,
    ],
  })
})



devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
