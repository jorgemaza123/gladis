import { nitro } from 'nitro/vite';
import vinext from 'vinext';
import rsc from '@vitejs/plugin-rsc';
import { defineConfig } from 'vite';
// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';
export default defineConfig(() => ({
  server: isCodexSeatbeltSandbox
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
  plugins: [
    vinext({ rsc: false }),
    rsc({
      entries: {
        rsc: 'virtual:vinext-rsc-entry',
        ssr: 'virtual:vinext-app-ssr-entry',
        client: 'virtual:vinext-app-browser-entry',
      },
      // Vinext/Nitro handle requests. The generic RSC handler expects a local
      // environment.runner, which is absent in Nitro's development environment.
      serverHandler: false,
    }),
    nitro(),
  ],
}));
