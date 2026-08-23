<div align="center">

# ✦ gitglance

**Beautiful, self-hostable GitHub stats cards for your README.**
Many themes, several visual styles, and no rate-limit headaches.

![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![SVG](https://img.shields.io/badge/output-SVG-ff69b4)

<br/>

<img src="examples/vercel.svg" width="640" alt="gitglance vercel style" />

</div>

## Why gitglance

Most README stats cards depend on one shared public service that constantly hits GitHub's rate limit and gets paused (you have probably seen the broken image on someone's profile). gitglance is built to be **self-hosted in one click**: deploy your own instance, give it your own GitHub token, and your cards never break because of someone else's traffic.

- 🎨 **Multiple visual styles**: `default`, `vercel`, `terminal`, `glass`, `minimal`
- 🌈 **12+ color themes**: dark, vercel, tokyonight, dracula, catppuccin, nord, gruvbox, rosepine, and more
- 🧩 **Three card types**: overview stats, top languages, and a combined card
- 🛠️ **Fully customizable** via URL params (colors, radius, width, title, borders)
- ⚡ **Fast SVG** output with sensible caching
- 🔒 **Your token, your limits**: self-host and never get rate limited again

## Styles

| `vercel` | `terminal` |
|:--------:|:----------:|
| <img src="examples/vercel.svg" width="420"/> | <img src="examples/terminal-gruvbox.svg" width="420"/> |
| **`default`** | **`glass`** |
| <img src="examples/default-tokyonight.svg" width="420"/> | <img src="examples/glass-dracula.svg" width="420"/> |

## Card types

| Stats | Languages |
|:-----:|:---------:|
| <img src="examples/stats-catppuccin.svg" width="360"/> | <img src="examples/langs-nord.svg" width="360"/> |

## Quick start

gitglance is meant to run as **your own** instance so it uses your rate limit.

1. Deploy this repo to Vercel (it is preconfigured, `vercel.json` included). Use the "New Project" flow and import this repository.
2. Optional but recommended: add an environment variable `GITHUB_TOKEN` (a classic token with `public_repo` scope) so you get 5000 requests/hour instead of 60.
3. Use your deployment URL in any README:

```md
![My GitHub stats](https://YOUR-APP.vercel.app/api/combined?username=YOUR_USER&style=vercel&theme=vercel)
```

## API

Base: `https://YOUR-APP.vercel.app`

| Endpoint | Card |
|----------|------|
| `/api/stats` | Overview numbers (stars, repos, followers, following) |
| `/api/langs` | Most used languages |
| `/api/combined` | Stats and languages side by side |
| `/api?type=stats\|langs\|combined` | Same, via the `type` param |

### Parameters

All parameters are optional except `username`.

| Param | Description | Example |
|-------|-------------|---------|
| `username` | GitHub username (required) | `username=torvalds` |
| `style` | `default`, `vercel`, `terminal`, `glass`, `minimal` | `style=vercel` |
| `theme` | Color theme (see list below) | `theme=dracula` |
| `langs_count` | Number of languages to show (1 to 10) | `langs_count=6` |
| `title` | Custom card title | `title=My%20Stats` |
| `hide_title` | Hide the title | `hide_title=true` |
| `hide_border` | Hide the outer border | `hide_border=true` |
| `border_radius` | Corner radius in px | `border_radius=20` |
| `width` | Card width in px | `width=500` |
| `title_color` | Override title color (hex, no #) | `title_color=ff79c6` |
| `text_color` | Override text color | `text_color=ffffff` |
| `bg_color` | Override background color | `bg_color=0d1117` |
| `border_color` | Override border color | `border_color=30363d` |

### Themes

`dark`, `light`, `vercel`, `tokyonight`, `dracula`, `nord`, `gruvbox`, `catppuccin`, `synthwave`, `rosepine`, `onedark`, `monochrome`

## Run locally

```bash
npm install
GITHUB_TOKEN=your_token npm start
# open http://localhost:3000/preview to see every style and theme
```

The `/preview` route renders a gallery of all styles and themes for quick visual checks.

## How it works

gitglance fetches public data from the GitHub REST API and renders a self-contained SVG (no headless browser). Cards are cached for six hours. Because you run your own instance with your own token, availability is in your hands, not a shared public service.

## Contributing

New themes and styles are very welcome. A theme is a small palette in `lib/themes.js`; a style is a set of visual tokens in `lib/render.js`. Open a PR with a screenshot.

## License

[MIT](LICENSE) © Rafael Oliveira

<div align="center">
<br/>
If gitglance is useful to you, a ⭐ helps other people find it.
</div>
