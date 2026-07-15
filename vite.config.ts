import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig({
  environments: {
    rsc: {
      resolve: {
        noExternal: ["openai", "zod"],
      },
    },
    ssr: {
      resolve: {
        noExternal: ["openai", "zod"],
      },
    },
  },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
});
