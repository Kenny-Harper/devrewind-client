# DevRewind Client

React/TypeScript frontend for DevRewind, which turns your GitHub activity into a shareable developer story card.

**Live:** https://devrewind.netlify.app

<img width="420" alt="DevRewind card" src="https://github.com/user-attachments/assets/b78023f4-4036-4328-a089-d3352308f3ac" />

## Features

- Sign in with GitHub and get your own shareable card at `/wrapped/:username`
- Contribution stats: total contributions, commits and best streak
- Language breakdown across your repositories
- Pinned projects with README screenshots, GitHub links and live demo links
- Layout adapts to 1–6 pinned projects
- Share to X and LinkedIn, or copy the link

## How projects are displayed

DevRewind shows your **pinned repositories** on GitHub (up to 6) as project cards. Pin your best work at github.com/your-username to control what appears.

- **Image:** the first image in the repo's README, otherwise a screenshot of the live URL
- **Live link:** the URL under a `## Live Demo` heading in the README, otherwise the repo's Website field

## Tech stack

React 19, TypeScript, Vite, React Router, Axios. Deployed on Netlify.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with GitHub login |
| `/dashboard` | Generates stats, then redirects to the card |
| `/wrapped/:username` | Public shareable card |

## Run locally

```bash
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```

You also need the API running locally.

## Related

- [devrewind-api](https://github.com/Kenny-Harper/devrewind-api): Node/Express backend![Uploading Screenshot 2026-11-20 at 17.14.37.png…]()
