# Abhisarga 26 - Upside Down

A dark, cinematic website for Abhisarga 26, featuring immersive animations, parallax scrolling, and a Stranger Things-inspired "Upside Down" aesthetic.

![Abhisarga 26](https://img.shields.io/badge/Abhisarga-26-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🎬 **Immersive Intro Video** - Timestamp-based playback with localStorage persistence and skip logic
- 🌀 **Layered Parallax & Smooth Scrolling** - Powered by Framer Motion transforms and Lenis
- 🎨 **Dark Cinematic Theme** - Deep blacks, crimson accents, muted purples with glitch effects
- 🔦 **Glitch Typography & Neon UI** - Cinzel Decorative, VT323 fonts with custom gradients
- ✨ **Smooth Animations** - Framer Motion scroll-based reveals and micro-interactions
- 🧭 **Single-Page Portal** - Hero, About, Events, Schedule, Sponsors, Team, Gallery, Footer sections
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ♿ **Accessible** - Reduced-motion support and proper ARIA labels
- 🎮 **Interactive Elements** - 3D contact cards, Oneko cat follower, cinematic globe

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.x or higher** (20.19+ recommended for Vite compatibility)
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/gautam-ch/Abhisarga26.git
   cd Abhisarga26
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
# or
npm run preview
```

The production artifacts live in `dist/` and can be served by any static host (Vercel, Netlify, GitHub Pages, etc.).

## 🎬 Adding Your Own Intro Video

The intro video is a key feature that plays on the first visit. Here's how to customize it:

### Step 1: Add Your Video File

1. Place your video file in the `public/video/` directory
2. Supported formats: `.mp4`, `.webm`, `.mov`
3. Recommended: Use MP4 format for best browser compatibility
4. Example: `public/video/abhisarga-intro.mp4`

### Step 2: Update the Video Path

Open `components/IntroVideo.jsx` and update the video source:

```jsx
// Find this line (around line 65)
<source src="/video/intro.mp4" type="video/mp4" />

// Change to your video filename
<source src="/video/abhisarga-intro.mp4" type="video/mp4" />
```

### Step 3: Adjust Video Duration (Optional)

If your video is longer or shorter than the default, update the duration constant:

```jsx
// Find this constant (around line 10)
const VIDEO_DURATION = 30000; // 30 seconds in milliseconds

// Change to match your video length
const VIDEO_DURATION = 45000; // 45 seconds example
```

### Step 4: Test the Intro Video

1. Clear your browser's localStorage (to reset the "viewed" state)
   - Open DevTools (F12)
   - Go to Application > Local Storage
   - Delete the `abhisarga_intro_timestamp` key
2. Refresh the page - your video should play
3. The intro will only show once per 2-minute window

## 📝 Updating Content

All copy and data live in `lib/content.js`. Every section reads from that data file, so tweaking content only requires editing JavaScript arrays/objects.

### Key Data Files:

- `heroStats`, `upsideQuotes` - Hero section statistics and quotes
- `eventCategories`, `scheduleTimeline` - Events and schedule data
- `sponsorTiers` - Sponsor information
- `teamCategories` - Team member data
- `galleryImages` - Gallery photos

## 🎨 Theme & Design

- **Typography**: Cinzel Decorative (titles), Space Grotesk (body), VT323 (glitch text)
- **Palette**: Deep blacks, crimson accents, muted violets, static overlays, portal gradients
- **Motion**: Framer Motion parallax transforms, scroll-linked hero layers, Lenis easing, staggered reveals

## 🏗️ Project Structure

```
abhisarga-upside-down/
├── app/
│   ├── ClientShell.jsx      # Client-side shell component
│   ├── ErrorBoundary.jsx    # Error boundary wrapper
│   ├── globals.css          # Global styles and theme
│   ├── layout.jsx           # Root layout with fonts
│   ├── page.jsx             # Main page component
│   └── contact/
│       └── page.jsx         # Contact page
├── components/
│   ├── CinematicGlobe.jsx   # 3D globe component
│   ├── Contact.jsx          # Contact form
│   ├── ContactCard.jsx      # 3D contact cards
│   ├── ContactCards3D.css   # Contact cards styles
│   ├── ContactCardsSection.jsx # Contact cards section
│   ├── ContactNew.jsx       # New contact component
│   ├── GuildMap.jsx         # Guild map component
│   ├── IntroVideo.jsx       # Intro video with logic
│   ├── Navigation.jsx       # Navigation bar
│   ├── Oneko.jsx            # Oneko cat follower
│   ├── PortalHeader.jsx     # Portal header
│   ├── PortalPulse.jsx      # Portal pulse effect
│   ├── RiftMap.jsx          # Rift map component
│   ├── SmoothScroll.jsx     # Smooth scrolling wrapper
│   └── sections/
│       ├── About.jsx        # About section
│       ├── ContactNew.jsx   # Contact section
│       ├── Events.jsx       # Events section
│       ├── Footer.jsx       # Footer section
│       ├── Gallery.jsx      # Gallery with lightbox
│       ├── Hero.jsx         # Hero section
│       ├── Schedule.jsx     # Schedule timeline
│       ├── Sponsors.jsx     # Sponsors section
│       └── Team.jsx         # Team section
├── lib/
│   └── content.js           # All site content and data
├── public/
│   ├── characters/
│   │   └── oneko/
│   │       └── oneko.js     # Oneko cat script
│   ├── textures/            # 3D textures
│   └── video/               # Intro video files
└── README.md                # This file
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy
4. Add custom domain in Vercel dashboard

### Other Platforms

The project can be deployed to any platform supporting Next.js:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean App Platform**

## 🧪 Troubleshooting

### Intro Video Issues
- **Not playing**: Check that video file exists in `public/video/` and format is MP4/WebM
- **Audio blocked**: Browsers block autoplay audio; video falls back to muted and unmutes on interaction
- **Reset viewed state**: Clear `abhisarga_intro_timestamp` from localStorage

### Performance Issues
- **Laggy scroll**: Temporarily disable Lenis in `SmoothScroll.jsx` for debugging
- **Heavy animations**: Check for reduced-motion preferences

### Asset Loading
- **Images not showing**: Ensure files are in `public/` and paths start with `/`
- **Video not loading**: Verify file format and path in `IntroVideo.jsx`

### Build Issues
- **Node version warning**: Upgrade to Node.js 20.19+ to silence Vite warnings
- **Dependencies**: Run `npm install` to ensure all packages are installed

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

**MIT License** - Remix freely for your fest!

Built with ❤️ using Next.js, Tailwind CSS, Framer Motion, Three.js, and Lenis.

Theme inspiration: Stranger Things "Upside Down" aesthetic.

## 📞 Support

For issues or questions, contact the Abhisarga tech team or create an issue on GitHub.

---
