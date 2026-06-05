import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,
  integrations: [
    Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    Sentry.browserTracingIntegration(),
  ],
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error exception captured',
    /Network request failed/,
    /Load failed/,
    /AbortError/,
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeSend(event: any) {
    if (process.env.NODE_ENV === 'development') return null
    if (event.request?.cookies) delete event.request.cookies
    if (event.request?.headers) {
      delete event.request.headers['cookie']
      delete event.request.headers['authorization']
    }
    return event
  },
})
