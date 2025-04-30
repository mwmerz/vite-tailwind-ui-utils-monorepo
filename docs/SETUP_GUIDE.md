# 🛠️ Monorepo Setup Guide (2025-Ready Stack)

This guide walks through creating a modern monorepo using the **latest stack** — all configured **from scratch**:

- pnpm
- Turbo
- TypeScript
- Vite
- TailwindCSS 4
- React 19
- tsup (for utils)
- vite-plugin-dts (for ui types)

---

## ✅ Final File Structure

```
.
├── apps/
│   └── web/         # Main Vite + React app
├── packages/
│   ├── ui/          # Component library (React + Tailwind)
│   └── utils/       # Shared utility functions (tsup)
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

---

## Step 0: Prerequisites

Install the right tooling:

```bash
npm install -g pnpm
pnpm add -g turbo
```

---

## Step 1: Initialize the Repo

```bash
mkdir my-monorepo && cd my-monorepo
pnpm init
pnpm add -Dw turbo
```

Add this `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Create `turbo.json`:

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "dependsOn": ["^build"]
    }
  }
}
```

Add build/dev scripts to `package.json`:

```json
"scripts": {
  "dev": "turbo run dev",
  "build": "turbo run build"
}
```

---

## Step 2: Create the Web App

```bash
pnpm create vite apps/web --template react-ts
cd apps/web
pnpm install
pnpm install tailwindcss @tailwindcss/vite -D
```

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
```

In `src/index.css`:

```css
@import "tailwindcss";
```

Add Tailwind config:

```bash
npx tailwindcss init
```

Make `tailwind.config.js`:

```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

Confirm Vite dev server works:

```bash
pnpm dev
```

---

## Step 3: Create `@my/ui` Package (Component Library)

```bash
mkdir -p packages/ui/src
cd packages/ui
pnpm init
pnpm install -D vite react react-dom tailwindcss @vitejs/plugin-react @tailwindcss/vite vite-plugin-dts typescript
```

Add your `vite.config.js`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      entryRoot: 'src',
      outputDir: 'dist',
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ui',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
});
```

Your `src/index.ts`:

```ts
export * from './Button';
import './index.css';
```

Add a simple `Button.tsx`:

```tsx
export function Button({ children }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

And a `src/index.css`:

```css
@import "tailwindcss";
```

Build:

```bash
pnpm build --filter=@my/ui
```

---

## Step 4: Create `@my/utils` Package

```bash
mkdir -p packages/utils/src/utils
pnpm init -w
pnpm install -D tsup typescript
```

In `src/utils/formatters.ts`:

```ts
export function capitalize(input: string): string {
  if (!input) return "";
  return input[0].toUpperCase() + input.slice(1);
}
```

In `src/index.ts`:

```ts
export * from './utils';
```

Create `tsup.config.ts`:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  outDir: 'dist',
  clean: true
});
```

Build:

```bash
pnpm build --filter=@my/utils
```

---

## Step 5: Use Packages in Web

In `apps/web/package.json`, add:

```json
"dependencies": {
  "@my/ui": "workspace:^",
  "@my/utils": "workspace:^"
}
```

In `App.tsx`:

```tsx
import { Button } from '@my/ui';
import { capitalize } from '@my/utils';

export default function App() {
  return (
    <main className="p-10 space-y-4">
      <Button>Click Me</Button>
      <p>{capitalize('hello')}</p>
    </main>
  );
}
```

Make sure the dev server is watching changes:

```bash
pnpm dev
```

---

## ✅ Done!

You now have:

- Shared UI and utils packages
- Strict typed exports
- CSS and Vite builds working across the monorepo
- Turbo coordinating all build/dev tasks

---

## 🧪 Next Steps

In future guides, we’ll add:

- Storybook
- Testing (Vitest)
- Docusaurus
- Docker support
- Supabase/local db integration
- Auth with OAuth/XION

Stay tuned!
