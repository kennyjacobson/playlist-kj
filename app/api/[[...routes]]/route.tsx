/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { Box, Text, vars, Columns, Column, Image, Divider, VStack, HStack, Icon } from './ui'
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
        <Box paddingTop="12">
          <Image

            src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-fancy.png"
            height="224"
          />

        </Box>

      </Box>
    ),
    intents: [
      <Button value="playlist" action='/playlist'>Playlist 🎵 </Button>,
      <Button value="listen" action="/listen">Listen 👂</Button>,
      <Button value="credits" action='/credits'>Credits 💡</Button>,
    ],
  })
})


app.frame('/playlist', (c) => {
  const { status, deriveState } = c
  // const answer = getRandomAnswer()
  const colorNum = Math.floor(Math.random() * 3)
  const playlistItemsPerPage = 3
  const state = deriveState(previousState => {
    previousState.playlistPage++
  })
  const playlistStart = (state.playlistPage - 1) * playlistItemsPerPage
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
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red100' : colorNum === 1 ? 'blue100' : 'purple100'}
          >
            <Text color="text300" size="24" font="madimi">
              Playlist
            </Text>

            <Image
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-right.png"
              height="192"
            />
          </Box>
        </Column>
        <Column width='3/4'>
          <Box
            grow
            alignHorizontal="left"
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red300' : colorNum === 1 ? 'blue300' : 'purple300'}
            textAlign='center'
            paddingTop="4"
            paddingLeft="16"
            fontFamily="madimi"
            fontSize="20"
          >
            <VStack gap="8">
            {
              playlist.map((item, index) => (
                <>
               
                  
                 <HStack gap="8" grow >
                    <Box>
                      <Image src={item.artwork} height="64" />
                    </Box>
                    <Box>
                      <Text size="16" font="madimi" color="text100">
                        {item.title}
                      </Text>
                      <Text size="16" font="madimi" color="text300">
                       by {item.artist}
                      </Text>
                    </Box>
                  </HStack>
                  

                </>

              ))
            }
            </VStack>

            
          </Box>
          <Box
            backgroundColor={colorNum === 0 ? 'red400' : colorNum === 1 ? 'blue400' : 'purple400'}
            alignHorizontal='center'
            padding="2"
          >
            <Text size="16" font="madimi" color="text300">
              Page {state.playlistPage}
            </Text>
          </Box>
        </Column>
      </Columns>
    ),
    intents: [
      <Button.Reset>Home 🏠</Button.Reset>,
      playlistHasNext && <Button value="home">Next Page ➡️</Button>,
    ],
  })
})


app.frame('/credits', (c) => {
  const { deriveState } = c
  const colorNum = Math.floor(Math.random() * 3)
  const creditItemsPerPage = 7
  const state = deriveState(previousState => {
    previousState.creditsPage++
  })
  const creditsStart = (state.creditsPage - 1) * creditItemsPerPage
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
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red100' : colorNum === 1 ? 'blue100' : 'purple100'}
          >
            <Text color="text300" size="24" font="madimi">
              Credits
            </Text>

            <Image
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-right.png"
              height="192"
            />
          </Box>
        </Column>
        <Column width='3/4'>
          <Box
            grow
            alignHorizontal="left"
            alignVertical='top'
            backgroundColor={colorNum === 0 ? 'red300' : colorNum === 1 ? 'blue300' : 'purple300'}
            textAlign='center'
            paddingTop="16"
            paddingLeft="32"
            fontFamily="madimi"
            fontSize="20"
          >
            <Box>
              <Text size="20" font="madimi" color="text300">
                Frame created by: @kennyjacobson
              </Text>
            </Box>

            <Box
              paddingTop="16"
              paddingBottom="8"
            >
              <Text size="20" font="madimi" color="text100">
                Curators:
              </Text>
            </Box>
            <VStack gap="8">
            {
              credits.map((item, index) => (
                <>
               
                  
                 <Box>
                      <Text size="16" font="madimi" color="text100">
                        {item}
                      </Text>
                 </Box>
                  

                </>

              ))
            }
            </VStack>

            
          </Box>
          <Box
            backgroundColor={colorNum === 0 ? 'red400' : colorNum === 1 ? 'blue400' : 'purple400'}
            alignHorizontal='center'
            padding="2"
          >
            <Text size="16" font="madimi" color="text300">
              Page {state.creditsPage}
            </Text>
          </Box>
        </Column>
      </Columns>

    ),
    intents: [
      <Button.Reset>Home 🏠</Button.Reset>,
      creditsHasNext && <Button value="home">Next Page ➡️</Button>,
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
            alignVertical='center'
            backgroundColor={colorNum === 0 ? 'red100' : colorNum === 1 ? 'blue100' : 'purple100'}
          >
            <Text color="text300" size="24" font="madimi">
              Song
            </Text>

            <Image
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-right.png"
              height="192"
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
            padding="8"
            fontFamily="madimi"
            fontSize="20"
          >
            
            <HStack gap="16">
            <Box>
              <Image src={currentSong.artwork} height="192" />
            </Box>
            <VStack gap="8">
              <Text size="24" font="madimi" color="text300">
                {currentSong.title}
              </Text>
              
              <HStack gap="8">
                <Icon name="users-round" color="text100"/> 
                <Text size="16" font="madimi" color="text100">
                {currentSong.artist}
                </Text>
              </HStack>

              <HStack gap="8">
                <Icon name="lightbulb" color="text100"/> 
                <Text size="16" font="madimi" color="text100">
                  {currentSong.curator}
                </Text>
              </HStack>

              <HStack gap="8" maxWidth="256">
                <Icon name="disc-3" color="text100"/> 
                <Text size="16" font="madimi" color="text100">
                  {currentSong.album}
                </Text>
              </HStack>
              

              
            </VStack>
            </HStack>
          </Box>
        </Column>
      </Columns>
    ),
    intents: [
      <Button.Reset>Home 🏠</Button.Reset>,
      // <Button.Link href={state.songUrl}>Play Song</Button.Link>,
      <Button.Redirect location={state.songUrl}>Play ▶️</Button.Redirect>,
      <Button value="random">Shuffle 🔀</Button>,
      <Button value="next">Next ➡️</Button>,
    ],
  })
})



devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
