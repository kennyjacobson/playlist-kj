/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { Box,  Text,  vars, Columns, Column,   Image } from './ui'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const randomAnswers = [
  'It is certain',
  'Hazy, try again',
  'Don’t count on it',
  'It is decidedly so',
  'Ask again later',
  'My reply is no',
  'Without a doubt',
  'Better not tell you now',
  'My sources say no',
  'Yes definitely',
  'Cannot predict now',
  'Outlook not so good',
  'You may rely on it',
  'Concentrate and ask again',
  'Very doubtful',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
]



const getRandomAnswer = () => {
  return randomAnswers[Math.floor(Math.random() * randomAnswers.length)]
}



const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  ui: { vars },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, inputText } = c
  const colorNum = Math.floor(Math.random() * 3) 
  return c.res({
    action: '/part-2',
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
        
              Ask me any yes or no question.
           
            <Image 
              src="https://nfts-dataw.s3.amazonaws.com/magic-8-ball/froggie-face-left.png" 
              height="256"
              />  
          </Box>
    ),
    intents: [
      <Button value="next">Click for answer</Button>,
    ],
  })
})

app.frame('/part-2', (c) => {
  const { status } = c
  const answer = getRandomAnswer()
  const colorNum = Math.floor(Math.random() * 3) 
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
           
              {answer}
            
          </Box>
        </Column>
      </Columns>
    ),
    intents: [
      <Button value="retry">Try again</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
