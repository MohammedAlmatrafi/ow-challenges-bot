import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [
    index("routes/index.tsx"),
    route("captain", "routes/captain.tsx"),
    route("players", "routes/players.tsx"),
    route("start-challenge", "routes/start-challenge.tsx"),
    route("post-challenge", "routes/post-challenge.tsx"),
  ]),
] satisfies RouteConfig;
