import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true // Permite usar describe e it sem importar em cada ficheiro
  }
})
