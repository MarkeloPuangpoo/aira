import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export type RiskLevel = "moderate" | "high" | "critical";

interface RiskAlertBannerProps {
    level: RiskLevel;
    message: string;
}

export function RiskAlertBanner({ level, message }: RiskAlertBannerProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const styles = {
        moderate: "bg-yellow-500 text-yellow-950 border-yellow-400",
        high: "bg-orange-500 text-white border-orange-400",
        critical: "bg-red-600 text-white border-red-500 animate-pulse",
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-[100] px-4 py-3 flex items-center justify-center gap-3 border-b shadow-lg backdrop-blur-md ${styles[level]}`}>
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-bold text-sm md:text-base tracking-wide uppercase">{message}</span>
            <button
                onClick={() => setVisible(false)}
                className="ml-auto p-1 hover:bg-white/20 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
