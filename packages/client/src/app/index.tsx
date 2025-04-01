import { Authenticator } from "@aws-amplify/ui-react"
import { Amplify } from "aws-amplify"
import ReactDOM from "react-dom/client"
import { config } from "./config.js"
import { App } from "./game/App.jsx"

declare global {
  interface Window {
    NEXT_PUBLIC_IS_DEVELOPMENT: boolean
    SERVER_URL: string
  }
}

if (window.NEXT_PUBLIC_IS_DEVELOPMENT) {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload(),
  )
}

const amplifyConfig = {
  ...(true || config.userPoolId != null
    ? {
        Auth: {
          region: config.awsRegion,
          userPoolId: config.userPoolId,
          userPoolWebClientId: config.userPoolClientId,
        },
      }
    : {}),
}
Amplify.configure(amplifyConfig)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Authenticator.Provider>
    <App />
  </Authenticator.Provider>,
)
