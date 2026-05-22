# atsulog

A simple and lightweight personal blog engine powered by Next.js (App Router), managing articles as local Markdown files.

## 🚀 Features

- **Markdown-based**: All articles are stored in `data/articles/*.md`, making them easy to manage with Git.
- **Intuitive Editing UI**: Create, edit, and delete articles directly from your browser.
- **Authentication**: Secure management area protected by session-based authentication (JWT).
- **Search & Filtering**: Easily find articles by keyword, category, or tag.
- **Fast Performance**: Leverages Next.js Server Components for lightning-fast page loads.
- **Modern Design**: Built with a clean and simple UI using Tailwind CSS v4.
- **Pagination**: Built-in support for paginated article lists.

## 🛠 Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [jose](https://github.com/panva/jose) (JWT)
- **Content Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Data Storage**: Local JSON & Markdown files

## 🏁 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=your-random-session-secret
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your blog.

### 4. Build and Start

```bash
npm run build
npm run start
```

## 📝 Managing Articles

### Via Web UI
1. Go to `/login` and enter your password.
2. After logging in, you will be redirected to the management dashboard (`/edit`).
3. Create new articles at `/edit/create` or edit existing ones from the list.
4. Changes are instantly reflected in the Markdown files within `data/articles/` and the `data/articles.json` metadata file.

### Via File System
- You can also manually add `.md` files to `data/articles/` and update the metadata in `data/articles.json`.

## ⚙️ Configuration

### Site Information
Update `app/lib/site-config.ts` to customize your blog's title, description, and localization settings.

```typescript
export const siteConfig = {
  title: "atsulog",
  cookie: "atsulog-cookie",
  description: "Atsulog is a personal blog.",
  htmlLang: "ja",
  locale: "ja-JP",
  timeZone: "Asia/Tokyo",
} as const;
```

---

## 🔧 [TODO: User Action Required]

Please complete the following items to finalize your setup:

1. **[ ] Author Profile**:
   - Update `app/lib/site-config.ts` or create a profile component to include your personal information.
2. **[ ] Assets**:
   - Replace `public/favicon.ico` with your own logo/icon.
3. **[ ] Domain Settings**:
   - Configure your custom domain in your deployment platform settings.
4. **[ ] Analytics**:
   - Add your Google Analytics or other tracking scripts in `app/layout.tsx` if needed.

---

## 📂 Directory Structure

- `app/`: Next.js App Router pages and components.
  - `articles/`: Public article display and search routes.
  - `edit/`: Protected article management UI.
  - `login/`: Authentication page.
  - `components/`: Reusable UI components (Atoms/Organisms).
  - `lib/`: Business logic, authentication, and repository layer.
- `data/`: Article content (Markdown) and metadata (JSON).
- `public/`: Static assets.
