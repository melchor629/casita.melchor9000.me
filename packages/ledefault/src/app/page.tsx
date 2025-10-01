import { useBlocker, useNavigate, type Metadata } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { useCallback, useEffect, useState } from 'preact/hooks'

export const metadata: Metadata = {
  title: 'pi',
}

export default function HomePage() {
  const [animated, setAnimated] = useState(false)
  const navigate = useNavigate()
  const blocker = useBlocker(true)

  const fadeout = useCallback(() =>
    Promise.all(
      Array.from(document.querySelectorAll('#uhm'))
        .map((el) => {
          const animation = el.animate([
            { opacity: 1 },
            { opacity: 0 },
          ], {
            duration: 1000,
            easing: 'linear',
          })
          setAnimated(false)
          return animation.finished
        }),
    ), [])

  useEffect(() => {
    console.log("You've found a raspberry pi hosting things.")
    console.log('The owner of it is @melchor629 (aka melchor9000).')
    console.log('This page is served using an fastify+vite+preact.')
    console.log('træfik helps us to publish different containers to the outside.')
    console.log('%cTwitter: https://twitter.com/melchor629', 'color: blue')
    console.log('%cGitHub:  https://github.com/melchor629', 'color: grey')
    console.log('%cWeb:     https://melchor9000.me', 'color: orange')
  }, [])

  useEffect(() => {
    const abtctrl = new AbortController()
    window.addEventListener('keyup', (event) => {
      if (event.key === 'h') {
        navigate('/w/')
      } else if (event.key === 'j') {
        navigate('/j/')
      }
      abtctrl.abort()
    }, { passive: true, signal: abtctrl.signal })
    return () => { if (!abtctrl.signal.aborted) abtctrl.abort() }
  }, [navigate])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      fadeout().catch(() => {}).finally(() => blocker.proceed())
    }
  }, [blocker, fadeout])

  return (
    <div
      id="uhm"
      className={clsx(
        'h-full flex flex-wrap justify-center items-center',
        'pointer-events-none select-none',
        'font-mono text-xs leading-4',
        animated ? 'opacity-100' : 'opacity-0',
        'animate-fade-in animation-easing-linear animation-delay-1s animation-duration-2s',
      )}
      onAnimationEnd={useCallback(() => setAnimated((v) => !v), [])}
    >
      <div>
        <pre onTouchEnd={useCallback(() => navigate('/w/'), [navigate])}>
          <span class="text-green-500">
            {`   .~~.   .~~.
  '. \\ ' ' / .'`}
          </span>
          <span class="text-red-500">
            {`
   .~ .~~~..~.
  : .~.'~'.~. :
 ~ (   ) (   ) ~
( : '~'.~.'~' : )
 ~ .~ (   ) ~. ~
  (  : '~' :  ) `}
          </span>
          <span class="text-inherit" id="pi">Raspberry Pi</span>
          <span class="text-red-500">
            {`
   '~ .~~~. ~'
       '~'`}
          </span>
        </pre>
      </div>
      <div>
        <pre>
          <span class="text-blue-500">
            {`
                    ##        .
              ## ## ##       ==
          ## ## ## ##      ===
      /""""""""""""""""\\___/ ===
  ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~
      \\______ o          __/
        \\    \\        __/
          \\____\\______/`}
          </span>
        </pre>
      </div>
    </div>
  )
}
