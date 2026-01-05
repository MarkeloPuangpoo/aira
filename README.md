# AIRA Monitor 🇹🇭

**ระบบติดตามสถานการณ์ฝุ่นและน้ำเพื่อประชาชน | Air Quality & Flood Monitoring for Thailand**

![AIRA Monitor Banner](/public/og-image.png)

> "ลมหายใจของคุณ... ให้เราดูแล"

AIRA Monitor is a **"God-tier"** responsive web application designed to provide real-time monitoring of PM 2.5 air quality and flood situations across Thailand. Built with modern web technologies, it delivers a premium, smooth, and accessible user experience on every device.

## ✨ Key Features

-   **Real-time PM 2.5 Monitoring**: Visualizes air quality indices (AQI) from stations across Thailand using the [WAQI API](https://waqi.info/).
-   **Flood Situation Layer**: Interleaves flood data from GISTDA to help users stay safe during rainy seasons.
-   **AI-Powered Insights**: Provides smart health recommendations and "vibes" based on current weather and pollution levels.
-   **Interactive Map**: Powered by MapLibre GL for smooth zooming, panning, and station selection.
-   **Responsive Design**: A fully fluid, mobile-first interface that looks stunning on everything from an iPhone SE to a 4K desktop.
-   **Bilingual Support**: Seamlessly toggles between Thai (TH) and English (EN).

## 🛠 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (utilizing `oklch` colors and CSS variables)
-   **Map Engine**: [MapLibre GL JS](https://maplibre.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Fonts**: Geist Sans & Geist Mono

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ or Bun
-   npm or yarn or pnpm or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/aira-monitor.git
    cd aira-monitor
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    bun install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    NEXT_PUBLIC_AQI_TOKEN=your_waqi_api_token
    NEXT_PUBLIC_GISTDA_KEY=your_gistda_api_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Global Responsiveness

AIRA Monitor is designed with a "Mobile-First" philosophy:
-   **Mobile**: Bottom-sheet style panels, thumb-friendly navigation.
-   **Desktop**: Floating glass-morphism panels and expansive map views.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Designed for Thai People by <strong>AIRA Team</strong>
</p>
