const UNAUTHORIZED = 'Unauthorized'
const UNKNOWN_ROUTE = 'Unknown Route'

const Error = ({ error, extra }) => {
  let extraEl = extra

  if (!extraEl) {
    if (error === UNAUTHORIZED) {
      extraEl = (
        <div>
          Login via the DApp store @
          <a href="https://store.mobius.network">
            https://store.mobius.network
          </a>{' '}
          to gain access to this Application.
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

export { Error as default, UNAUTHORIZED, UNKNOWN_ROUTE }
