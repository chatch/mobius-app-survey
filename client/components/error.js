const UNAUTHORIZED = 'Unauthorized'
const UNKNOWN_ROUTE = 'Unknown Route'
const SESSION_TIMEOUT = 'Session Timeout'

const Error = ({ error, extra }) => {
  let extraEl = extra

  if (!extraEl) {
    if (error === UNAUTHORIZED || error === SESSION_TIMEOUT) {
      const storeUrl = `https://store.${
        window.location.host.startsWith('testnet') ? 'beta.' : ''
      }mobius.network`
      extraEl = (
        <div>
          Login via the DApp store @ <a href={storeUrl}>{storeUrl}</a> to gain
          access to this Application.
        </div>
      )
    }
  }

  return (
    <div style={{ margin: 20 }}>
      <h1>Error</h1>
      <h3>{error}</h3>
      <div>{extraEl}</div>
    </div>
  )
}

export { Error as default, SESSION_TIMEOUT, UNAUTHORIZED, UNKNOWN_ROUTE }
