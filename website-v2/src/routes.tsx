import React, { Suspense } from "react"
import { __RouterContext as RouterContext } from "react-router"
import { RouteConfig } from "react-router-config"

import Landing from "./landing/index"

/**
 * Component Waiting wrapper
 * @param Component React lazy component
 */
export function WaitingComponent(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return () => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  )
}

/**
 * useRouter hook
 * const { history } = useRouter()
 * history.push("/")
 * https://github.com/ReactTraining/react-router/issues/6430#issuecomment-510266079
 */
export function useRouter() {
  return React.useContext(RouterContext)
}

const routes: RouteConfig[] = [
  { path: "/", component: Landing, exact: true } // 首页
]

export default routes
