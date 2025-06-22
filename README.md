# Eatly - Food Delivery Next.js App

A modern, responsive food delivery website built with Next.js, TypeScript, Tailwind CSS, and internationalization support.

## Features

- 🍽️ **Modern Food Delivery UI** - Beautiful and responsive design
- 🌍 **Internationalization** - Support for English and Khmer languages
- 📱 **Mobile Responsive** - Optimized for all device sizes
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized components
- 🎨 **Tailwind CSS** - Modern styling with custom design system
- 🔧 **TypeScript** - Type-safe development experience

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
├── app/
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout (redirect only)
│   ├── page.tsx                 # Root page (redirects to /en)
│   └── [locale]/                # Locale-based routing
│       ├── layout.tsx           # Locale-specific layout
│       └── page.tsx             # Main page component
├── components/
│   ├── Header.tsx               # Navigation header
│   ├── Hero.tsx                 # Hero section with CTA
│   ├── MenuSection.tsx          # Food menu grid
│   ├── FoodCard.tsx             # Individual food item card
│   ├── TestimonialCard.tsx      # Customer testimonial
│   ├── DeliveryCard.tsx         # Delivery info card
│   ├── LanguageSwitcher.tsx     # Language selection dropdown
│   └── Footer.tsx               # Footer section
├── messages/
│   ├── en.json                  # English translations
│   └── kh.json                  # Khmer translations
├── middleware.ts                # i18n routing middleware
├── i18n.ts                      # Internationalization config
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eatly-food-delivery
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Internationalization

The app uses locale-based routing with automatic redirection:

- **Root URL**: `/` → automatically redirects to `/en`
- **English**: `/en`
- **Khmer**: `/kh`

### Language Switching

Use the language switcher in the header to change between English and Khmer. The app will automatically route to the correct language path while preserving the current page.

### URL Structure

All pages are now grouped under the locale:
- `/en` - English version
- `/kh` - Khmer version
- `/en/about` - English about page (if added)
- `/kh/about` - Khmer about page (if added)

### Adding New Languages

1. Create a new translation file in `messages/[locale].json`
2. Add the locale to the `locales` array in `i18n.ts` and `middleware.ts`
3. Update the matcher pattern in `middleware.ts`
4. Add the language to the `languages` array in `LanguageSwitcher.tsx`

## Customization

### Styling

- Custom styles are in `app/globals.css`
- Tailwind configuration in `tailwind.config.js`
- Brand colors and custom classes are defined in the CSS

### Components

- All components are in the `components/` directory
- Each component is self-contained with its own styling
- Components use the `useTranslations` hook for i18n

### Food Items

- Food items are defined in `components/MenuSection.tsx`
- Each item has an image, name, category, and price
- Translations for food items are in the `foodItems` section of each language file

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 