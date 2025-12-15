

## ✨ Highlights## Features



- 🎞️ **Immersive intro video** with timestamp-based skip logic and localStorage cooldowns- 🎬 **Intro Video System** - Timestamp-based playback with localStorage persistence

- 🌀 **Layered parallax & smooth scrolling** powered by Framer Motion transforms + Lenis- 🎨 **Dark Cinematic Theme** - Deep blacks, dark reds, muted purples with glitch effects

- 🔦 **Glitch typography + neon UI** using Cinzel Decorative, VT323, and custom gradients- ✨ **Smooth Animations** - Framer Motion scroll-based reveals and micro-interactions

- 🧭 **Single-page portal** with hero, about, events, schedule, sponsors, team, gallery, footer- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop

- 📱 **Responsive + accessible** layout, mobile drawer nav, focus-friendly buttons- ♿ **Accessible** - Reduced-motion support and proper ARIA labels


## 🚀 Getting Started

## Local Setup

### Prerequisites

### Prerequisites

- Node.js **20.19+** (Vite's React plugin warns below this; 20.16 still works with a warning)

- npm 10+- Node.js 18.x or higher

- npm, yarn, or pnpm

### Install & run

### Installation

```bash

npm install1. **Clone or download the project**

npm run dev

# visit http://localhost:51732. **Install dependencies**

```   \`\`\`bash

   npm install

### Production build   # or

   yarn install

```bash   # or

npm run build   pnpm install

npm run preview   \`\`\`

```

3. **Run the development server**

The production artifacts live in `dist/` and can be served by any static host (Vercel, Netlify, GitHub Pages, etc.).   \`\`\`bash

   npm run dev

## 🎬 Customizing the Intro Video   # or

   yarn dev

1. Drop your file inside `public/video/` (e.g. `public/video/abhisarga-intro.mp4`).   # or

2. Update the `<source>` path inside `src/components/IntroVideo.jsx` if you change the filename.   pnpm dev

3. Adjust `VIDEO_DURATION` (ms) when your clip is longer/shorter so the fallback timeout matches playback.   \`\`\`

4. Clear `localStorage` key `abhisarga_intro_timestamp` to replay the intro while testing.

4. **Open in browser**

## 📝 Updating Content   

   Navigate to [http://localhost:3000](http://localhost:3000)

All copy + data live in `src/data/content.js`:

## Adding Your Own Intro Video

- `heroStats`, `upsideQuotes`

- `eventCategories`, `scheduleTimeline`The intro video is a key feature that plays on the first visit. Here's how to add your own video:

- `sponsorTiers`, `teamCategories`, `galleryImages`

### Step 1: Add Your Video File

Media assets belong in `public/` (e.g. `public/gallery`, `public/video`). Every section reads from that data file, so tweaking content only requires editing JavaScript arrays.

1. Place your video file in the `public/videos/` directory

```2. Supported formats: `.mp4`, `.webm`, `.mov`

src/3. Recommended: Use MP4 format for best browser compatibility

├── App.jsx4. Example: `public/videos/abhisarga-intro.mp4`

├── components/

│   ├── IntroVideo.jsx### Step 2: Update the Video Path

│   ├── Navigation.jsx

│   ├── PortalPulse.jsxOpen `components/intro-video.tsx` and update the video source:

│   └── SmoothScroll.jsx

├── data/content.js\`\`\`tsx

├── sections/// Find this line (around line 65)

│   ├── About.jsx<source src="/videos/intro.mp4" type="video/mp4" />

│   ├── Events.jsx

│   ├── Footer.jsx// Change to your video filename

│   ├── Gallery.jsx<source src="/videos/abhisarga-intro.mp4" type="video/mp4" />

│   ├── Hero.jsx\`\`\`

│   ├── Schedule.jsx

│   ├── Sponsors.jsx### Step 3: Adjust Video Duration (Optional)

│   └── Team.jsx

└── styles/global.cssIf your video is longer or shorter than 30 seconds, update the duration:

```

\`\`\`tsx

## 🎨 Theme Notes// Find this constant (around line 10)

const VIDEO_DURATION = 30000; // 30 seconds in milliseconds

- Typography: **Cinzel Decorative** (titles), **Space Grotesk** (body), **VT323** (glitch text)

- Palette: deep blacks, crimson accents, muted violets, static overlays, portal gradients// Change to match your video length

- Motion: Framer Motion parallax transforms, scroll-linked hero layers, Lenis easing, staggered revealsconst VIDEO_DURATION = 45000; // 45 seconds example

\`\`\`

## 🧪 Tips & Troubleshooting

### Step 4: Test the Intro Video

- **Node warning**: Vite’s React plugin prefers Node ≥20.19. Upgrade Node to silence the warning.

- **Intro muted autoplay**: Some browsers block audio. We auto fallback to muted playback and unmute on the first interaction.1. Clear your browser's localStorage (to reset the "viewed" state)

- **Laggy scroll**: Temporarily return children directly in `SmoothScroll.jsx` to disable Lenis while debugging.   - Open DevTools (F12)

- **Images not showing**: Ensure they live in `public/` and reference them with absolute paths (`/gallery/...`).   - Go to Application > Local Storage

   - Delete the `abhisarga_intro_viewed` key

## 📄 License & Credits2. Refresh the page - your video should play

3. The intro will only show once per 2-minute window

- MIT License – remix freely for your fest.

- Theme inspiration: Stranger Things “Upside Down”.## Customization Guide

- Built with React, Tailwind CSS, Framer Motion, and Lenis.

### Update Event Data

Edit event information in `components/events.tsx`:

\`\`\`tsx
const eventCategories = [
  {
    title: "Technical Events",
    events: [
      {
        title: "Your Event Name",
        description: "Event description",
        date: "Mar 15, 2025",
        // ... other fields
      }
    ]
  }
]
\`\`\`

### Update Schedule

Modify the timeline in `components/schedule.tsx`:

\`\`\`tsx
const scheduleData = [
  {
    day: "Day 1",
    date: "March 15, 2025",
    events: [
      { time: "10:00 AM", title: "Opening Ceremony", venue: "Main Stage" }
    ]
  }
]
\`\`\`

### Update Team Members

Edit team data in `components/team.tsx`:

\`\`\`tsx
const teamMembers = [
  {
    name: "Team Member Name",
    role: "Position",
    image: "/team/member.jpg",
    // ... social links
  }
]
\`\`\`

### Add Sponsor Logos

1. Place sponsor logos in `public/sponsors/`
2. Update `components/sponsors.tsx`:

\`\`\`tsx
const sponsors = {
  platinum: ["/sponsors/platinum-sponsor-1.png"],
  gold: ["/sponsors/gold-sponsor-1.png"],
  // ... other tiers
}
\`\`\`

### Update Gallery Images

Add images in `components/gallery.tsx`:

\`\`\`tsx
const galleryImages = [
  { src: "/gallery/image1.jpg", alt: "Description" },
  // ... more images
]
\`\`\`

## Project Structure

\`\`\`
abhisarga-website/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and theme
├── components/
│   ├── intro-video.tsx     # Intro video with logic
│   ├── navbar.tsx          # Navigation bar
│   ├── hero.tsx            # Hero section
│   ├── about.tsx           # About section
│   ├── events.tsx          # Events section
│   ├── schedule.tsx        # Schedule timeline
│   ├── sponsors.tsx        # Sponsors section
│   ├── team.tsx            # Team section
│   ├── gallery.tsx         # Gallery with lightbox
│   └── footer.tsx          # Footer section
├── public/
│   ├── videos/             # Place intro video here
│   ├── sponsors/           # Sponsor logos
│   ├── team/               # Team member photos
│   └── gallery/            # Gallery images
└── README.md               # This file
\`\`\`

## Environment Variables (Optional)

If you want to add analytics or other integrations, create a `.env.local` file:

\`\`\`env
# Example environment variables
NEXT_PUBLIC_SITE_URL=https://abhisarga-iiits.in
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
\`\`\`

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy
4. Add custom domain in Vercel dashboard

### Other Platforms

The project can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Troubleshooting

### Intro Video Not Playing

- Check that video file exists in `public/videos/`
- Verify video format is MP4 or WebM
- Clear localStorage and refresh page
- Check browser console for errors

### Animations Not Working

- Ensure `framer-motion` is installed
- Check that JavaScript is enabled
- Try clearing browser cache

### Images Not Loading

- Verify image paths are correct (relative to `public/` folder)
- Check image file extensions match imports
- Ensure images are optimized and not too large

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use for your fest!

## Credits

Built with Next.js, Tailwind CSS, and Framer Motion.
Theme inspired by Stranger Things "UPSIDE DOWN" aesthetic.

## Support

For issues or questions, contact the Abhisarga tech team.
