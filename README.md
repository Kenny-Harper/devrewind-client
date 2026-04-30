# DevRewind Client

React/TypeScript frontend for DevRewind — turns GitHub activity into a shareable developer story card.

## Tech Stack
- React 19 + TypeScript
- Vite
- React Router
- Axios

## Routes
- / — landing page
- /dashboard — generates stats, redirects to card
- /wrapped/:username — public shareable card

## Setup
- npm install
- Set VITE_API_URL in .env
- npm run dev

## Live
https://devrewind.netlify.app

## Related
- [devrewind-api](https://github.com/Kenny-Harper/devrewind-api)

## How Projects Are Displayed
DevRewind displays your **pinned repositories** on GitHub (up to 6) as project cards.
Pin your best work at github.com/your-username to control what appears on your DevRewind card.
