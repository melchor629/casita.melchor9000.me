import { SsrResponse, type Logger, type SsrRequest } from '@melchor629/nice-ssr'

const username = process.env.ANTENA3_USERNAME!
const password = process.env.ANTENA3_PASSWORD!
const clientToken = process.env.ANTENA3_CLIENT_TOKEN!
const apiUrl = process.env.ANTENA3_API_URL!

export async function POST(request: SsrRequest) {
  const { log } = request.nice
  if (!username || !password || !clientToken || !apiUrl) {
    log.error('Username, password or client token not configured')
    return SsrResponse.new().status('internal-server-error').empty()
  }

  const token = Buffer.from(await crypto.subtle.digest(
    'SHA-512',
    Buffer.from(`#${username}·${password}%`, 'utf8'),
  )).toString('base64')
  if (request.headers.get('Authorization') !== `Token ${token}`) {
    return SsrResponse.new().status('unauthorized').empty()
  }

  const body = await request.json() as { yesterday?: boolean }
  const checkDate = new Date()
  if (body.yesterday) {
    checkDate.setDate(checkDate.getDate() - 1)
    const day = checkDate.getDay()
    if (day === 0) checkDate.setDate(checkDate.getDate() - 2) // Sunday → Friday
    if (day === 6) checkDate.setDate(checkDate.getDate() - 1) // Saturday → Friday
  }

  try {
    const dateFormatted = formatDate(checkDate)
    log.info({ username, checkDate }, `Checking in with user '${username}' for ${dateFormatted}`)

    log.debug({ username, checkDate }, 'Log in into app')
    const [sessionId, authorization] = await loginRequest(username, password)
    await waitRandomSeconds(log)

    log.debug({ username, checkDate }, 'Getting user ID')
    const userId = await getUserIdRequest(sessionId, authorization, username, clientToken)
    if (!userId) {
      return SsrResponse.new().status('bad-request').text('UserID not found')
    }

    log.debug({ userId, username, checkDate }, 'Doing check-in')
    await checkInRequest(userId, sessionId, authorization, clientToken, dateFormatted)
    return SsrResponse.new().empty()
  } catch (err) {
    log.error({ err, username, checkDate }, 'Could not log in or clock in')
    return SsrResponse.new().status('internal-server-error').empty()
  }
}

function waitRandomSeconds(log: Logger): Promise<void> {
  const waitMs = Math.floor(30 + Math.random() * 60 * 1000)
  log.debug(`Waiting ${waitMs / 1000} seconds...`)
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, waitMs)
  return promise
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] + 'T00:00:00'
}

async function checkOkResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Call failed: (${response.status}) ${text}`)
  }
}

async function loginRequest(username: string, password: string): Promise<[string, string]> {
  const url = `${apiUrl}/authenticate`

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      user: username,
      password,
      locale: 'esp',
      client: '',
      casetype: '',
      caseGUID: '79883',
      idPlan: '1',
    }),
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Content-Type': 'application/json',
    },
  })

  await checkOkResponse(response)
  const { authorization, session } = await response.json() as { session: string, authorization: string }
  return [session, authorization]
}

async function getUserIdRequest(
  sessionId: string,
  authorization: string,
  username: string,
  clientToken: string,
): Promise<string | undefined> {
  const url = `${apiUrl}/apiISAPI/rest/load`

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1" ?>
  <NewSmartParams>
    <boldclass>40</boldclass>
    <idobject>1</idobject>
    <from>2022-01-09T00:00:00</from>
    <to>2022-01-17T00:00:00</to>
    <workersperpage>50</workersperpage>
    <pagenum>1</pagenum>
    <update>false</update>
    <byneed>false</byneed>
    <typeclockcontrol>255</typeclockcontrol>
    <groupedgantt>false</groupedgantt>
    <addhierarchy>false</addhierarchy>
    <groupinfo>-</groupinfo>
    <viewname>${username}</viewname>
    <resourcesort>Obj1.ContractWorker.Worker.FullName < Obj2.ContractWorker.Worker.FullName
    </resourcesort>
    <hidetasksnotinview>false</hidetasksnotinview>
    <withAreasNeeds>false</withAreasNeeds>
    <allopen>false</allopen>
    <crossdomain>http://172.16.0.9/servers/B79883/ISAPIBoldWP.dll</crossdomain>
    <timetoken></timetoken>
    <clienttoken>${clientToken}</clienttoken>
    <session>${sessionId}</session>
    <json>true</json>
  </NewSmartParams>`

  const response = await fetch(url, {
    method: 'POST',
    body: xmlBody,
    headers: {
      authorization,
      caseSession: sessionId,
      'Content-Type': 'text/plain',
      'User-Agent': 'Mozilla/5.0',
    },
  })
  await checkOkResponse(response)
  const data = await response.json() as {
    TWPPlan?: {
      WorkerPlanOrder?: Record<string, unknown>[]
    }
  }
  const workerPlanOrder = data?.TWPPlan?.WorkerPlanOrder ?? []
  const idEntry = workerPlanOrder.find((entry) => typeof entry.IDS === 'string')
  return idEntry?.IDS as string | undefined
}

async function checkInRequest(
  userId: string,
  sessionId: string,
  authorization: string,
  clientToken: string,
  checkDate: string,
): Promise<void> {
  const url = `${apiUrl}/apiISAPI/rest/action/insertDefaultClockMark`

  const xmlBody = `<?xml version="1.0" encoding="ISO-8859-1" ?>
  <NewSmartParams>
    <idcase>1</idcase>
    <objectlist>${userId}</objectlist>
    <datelist>${checkDate}</datelist>
    <type>0</type>
    <crossdomain>http://172.16.0.9/servers/B79883/ISAPIBoldWP.dll</crossdomain>
    <timetoken></timetoken>
    <clienttoken>${clientToken}</clienttoken>
    <noclon>true</noclon>
    <session>${sessionId}</session>
  </NewSmartParams>`

  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), 10_000)
  await checkOkResponse(await fetch(url, {
    method: 'POST',
    signal: abortController.signal,
    body: xmlBody,
    headers: {
      authorization,
      caseSession: sessionId,
      'Content-Type': 'text/plain',
      'User-Agent': 'Mozilla/5.0',
    },
  }))
}
