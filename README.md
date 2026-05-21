# atsulog

A simple and lightweight personal blog engine powered by Next.js (App Router), managing articles as local Markdown files.

## 🚀 Features

- **Markdown-based**: All articles are stored in `data/articles/*.md`, making them easy to manage with Git.
- **Intuitive Editing UI**: Create, edit, and delete articles directly from your browser.
- **Fast Performance**: Leverages Next.js Server Components for lightning-fast page loads.
- **Modern Design**: Built with a clean and simple UI using Tailwind CSS v4.
- **Pagination**: Built-in support for paginated article lists.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Content Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Data Storage**: Local JSON & Markdown files

## 🏁 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your blog.

### 3. Build and Start

```bash
npm run build
npm run start
```

## 📝 Managing Articles

### Via Web UI
- Go to `/edit/create` to create a new article.
- Go to `/edit/[slug]` to edit an existing article.
- Changes are instantly reflected in the Markdown files within `data/articles/` and the `data/articles.json` metadata file.

### Via File System
- You can also manually add `.md` files to `data/articles/` and update the metadata in `data/articles.json`.

## ⚙️ Configuration

### Site Information
Update `app/lib/site-config.ts` to customize your blog's title, description, and localization settings.

```typescript
export const siteConfig = {
  title: "atsulog",
  description: "Atsulog is a personal blog.",
  htmlLang: "ja",
  // ...
} as const;
```

---

## 🔧 [TODO: User Action Required]

Please complete the following items to finalize your setup:

1. **[ ] Deployment & Security**:
   - If deploying to a public environment (e.g., Vercel), ensure you implement access control (like Basic Auth) for the `/edit` routes, as there is currently no built-in authentication.
2. **[ ] Author Profile**:
   - Update `app/lib/site-config.ts` or create a profile component to include your personal information.
3. **[ ] Assets**:
   - Replace `public/favicon.ico` with your own logo/icon.
4. **[ ] Domain Settings**:
   - Configure your custom domain in your deployment platform settings.
5. **[ ] Analytics**:
   - Add your Google Analytics or other tracking scripts in `app/layout.tsx` if needed.

---

## 📂 Directory Structure

- `app/`: Next.js App Router pages and components.
  - `articles/`: Article display routes.
  - `edit/`: Article creation and editing UI.
  - `components/`: Reusable UI components (Atoms/Organisms).
  - `lib/`: Business logic, types, and repository layer.
- `data/`: Article content (Markdown) and metadata (JSON).
- `public/`: Static assets.
