import { useEffect, useState } from "react";
import { X, Thermometer, Droplets, Wind, Gauge, CloudFog, Sparkles, Bot } from "lucide-react";
import { DICTIONARY, Language } from "@/lib/dictionary";

type StationFeed = {
    // ... (StationFeed type remains unchanged)
    aqi: number;
    idx: number;
    city: {
        name: string;
        url: string;
    };
    dominentpol: string;
    iaqi: {
        co?: { v: number };
        h?: { v: number }; // humidity
        no2?: { v: number };
        o3?: { v: number };
        p?: { v: number }; // pressure
        pm10?: { v: number };
        pm25?: { v: number };
        so2?: { v: number };
        t?: { v: number }; // temp
        w?: { v: number }; // wind
        wg?: { v: number }; // wind gust
    };
    forecast?: {
        daily?: {
            pm25?: Array<{
                avg: number;
                day: string;
                max: number;
                min: number;
            }>;
        };
    };
    time: {
        s: string;
        tz: string;
        v: number;
    };
};

type AiraSidePanelProps = {
    isOpen: boolean;
    onClose: () => void;
    stationUid: number | null;
    stationName: string;
    lang: Language;
};

export function AiraSidePanel({ isOpen, onClose, stationUid, stationName, lang }: AiraSidePanelProps) {
    const [data, setData] = useState<StationFeed | null>(null);
    const [loading, setLoading] = useState(false);
    const t = DICTIONARY[lang];

    useEffect(() => {
        if (!isOpen || !stationUid) return;

        const fetchStationData = async () => {
            setLoading(true);
            try {
                const token = process.env.NEXT_PUBLIC_AQI_TOKEN;
                const res = await fetch(`https://api.waqi.info/feed/@${stationUid}/?token=${token}`);
                const json = await res.json();
                if (json.status === "ok") {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch station feed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStationData();
    }, [isOpen, stationUid]);

    if (!isOpen) return null;

    const getAQIColor = (aqi: number) => {
        if (aqi <= 50) return "bg-emerald-500 text-white";
        if (aqi <= 100) return "bg-yellow-400 text-yellow-900";
        if (aqi <= 150) return "bg-orange-500 text-white";
        if (aqi <= 200) return "bg-rose-500 text-white";
        return "bg-purple-600 text-white";
    };

    const getAQILabel = (aqi: number) => {
        if (aqi <= 50) return t.status.good;
        if (aqi <= 100) return t.status.moderate;
        if (aqi <= 150) return t.status.sensitive;
        if (aqi <= 200) return t.status.unhealthy;
        return t.status.hazardous;
    };

    // AI Insight Logic (Mock)
    const generateInsight = (data: StationFeed, currentLang: Language) => {
        const aqi = data.aqi;
        const wind = data.iaqi.w?.v || 0;

        let title = currentLang === 'en' ? "Chill Vibes" : "สถานการณ์ชิลๆ";
        let desc = currentLang === 'en'
            ? "Air is pretty steady. Nothing to worry about."
            : "อากาศนิ่งๆ ไม่มีอะไรน่าห่วง ใช้ชีวิตได้ตามสบาย";
        let recommendation = currentLang === 'en'
            ? "Go out and enjoy!"
            : "ออกไปหาไรทำข้างนอกได้เลย!";
        let color = "from-blue-500 to-cyan-500";

        if (aqi > 150) {
            title = currentLang === 'en' ? "Toxic Alert! ☠️" : "สัญญาณอันตราย! สีแดงเดือด 🔥";
            color = "from-red-600 to-rose-600";
            desc = currentLang === 'en'
                ? "Air is stagnant. Pollution is trapped. It's nasty out there."
                : "อากาศปิดสนิท ฝุ่นขังรวมกันหนาแน่น ข้างนอกคือท็อกซิกสุดๆ";
            recommendation = currentLang === 'en'
                ? "Mask up or stay inside. Seriously."
                : "ใส่ N95 ด่วน! หรือถ้าไม่จำเป็นอย่าออกไปสูดดม";
        } else if (aqi > 100) {
            title = currentLang === 'en' ? "Getting Hazy 😷" : "เริ่มตุๆ แล้วนะจมูก 😷";
            color = "from-orange-400 to-amber-500";
            desc = currentLang === 'en'
                ? "Dust is piling up. Sensitive folks might feel it."
                : "ฝุ่นเริ่มมาสะสมตัว ใครแพ้ง่ายอาจจะมีฟุดฟิดบ้าง";
            recommendation = currentLang === 'en'
                ? "Take it easy outdoors."
                : "ลดกิจกรรมกลางแจ้งลงหน่อยก็ดีนะ";
        } else if (aqi <= 50) {
            title = currentLang === 'en' ? "Super Fresh ✨" : "คลีนเว่อร์! หายใจให้สุดปอด ✨";
            color = "from-emerald-400 to-green-500";
            desc = currentLang === 'en'
                ? "Clean air! Looks like good wind dispersion."
                : "อากาศใสปิ๊ง! ลมพัดดี ฝุ่นกระเจิงหมดแล้ว";
            recommendation = currentLang === 'en'
                ? "Perfect for a run!"
                : "เวลานี้แหละ! ไปวิ่งหรือเดินเล่นด่วนๆ";
        }

        return { title, desc, recommendation, color };
    };

    const insight = data ? generateInsight(data, lang) : null;

    return (
        <div className="absolute left-0 right-0 bottom-0 md:left-auto md:top-4 md:right-4 md:bottom-4 h-[85vh] md:h-auto md:w-[380px] bg-white/90 backdrop-blur-xl rounded-t-[2rem] md:rounded-[2rem] shadow-2xl z-20 overflow-hidden border border-white/50 animate-in slide-in-from-bottom-full md:slide-in-from-right-10 duration-500 flex flex-col transition-all ease-out">
            {/* Header */}
            <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight line-clamp-2">{stationName}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Updated: {data?.time?.s ? new Date(data.time.s).toLocaleString() : t.status.loading}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm">{t.status.loading}</p>
                    </div>
                ) : data && insight ? (
                    <>
                        {/* AI Insight Card */}
                        <div className={`p-5 rounded-2xl bg-gradient-to-br ${insight.color} text-white shadow-lg relative overflow-hidden group`}>
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Sparkles className="w-12 h-12" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-white/20 p-1 rounded-md backdrop-blur-sm">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-90">{t.insight.aiAnalysis}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                                <p className="text-sm opacity-90 leading-relaxed mb-3">
                                    {insight.desc}
                                </p>
                                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                                    <p className="text-xs font-medium">💡 {t.insight.suggestion}: {insight.recommendation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main AQI Card */}
                        <div className={`rounded-3xl p-6 text-center shadow-lg ${getAQIColor(data.aqi)}`}>
                            <p className="text-sm font-medium opacity-90 uppercase tracking-widest mb-1">Air Quality Index</p>
                            <h1 className="text-7xl font-bold tracking-tighter">{data.aqi}</h1>
                            <p className="text-lg font-semibold mt-2">{getAQILabel(data.aqi)}</p>
                        </div>

                        {/* Weather Grid */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{t.weather.conditions}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <WeatherCard
                                    icon={<Thermometer className="w-5 h-5 text-orange-500" />}
                                    label={t.weather.temp}
                                    value={`${data.iaqi.t?.v ?? "--"}°C`}
                                />
                                <WeatherCard
                                    icon={<Droplets className="w-5 h-5 text-blue-500" />}
                                    label={t.weather.humidity}
                                    value={`${data.iaqi.h?.v ?? "--"}%`}
                                />
                                <WeatherCard
                                    icon={<Wind className="w-5 h-5 text-teal-500" />}
                                    label={t.weather.wind}
                                    value={`${data.iaqi.w?.v ?? "--"} m/s`}
                                />
                                <WeatherCard
                                    icon={<Gauge className="w-5 h-5 text-slate-500" />}
                                    label={t.weather.pressure}
                                    value={`${data.iaqi.p?.v ?? "--"} hPa`}
                                />
                            </div>
                        </div>

                        {/* Pollutants Grid */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{t.weather.pollutants}</h3>
                            <div className="space-y-2">
                                <PollutantRow label="PM 2.5" value={data.iaqi.pm25?.v} unit="µg/m³" />
                                <PollutantRow label="PM 10" value={data.iaqi.pm10?.v} unit="µg/m³" />
                                <PollutantRow label="Ozone (O3)" value={data.iaqi.o3?.v} unit="ppb" />
                                <PollutantRow label="Nitrogen Dioxide (NO2)" value={data.iaqi.no2?.v} unit="ppb" />
                                <PollutantRow label="Sulfur Dioxide (SO2)" value={data.iaqi.so2?.v} unit="ppb" />
                            </div>
                        </div>

                        {/* Forecast Chart */}
                        <ForecastChart data={data.forecast?.daily?.pm25 ?? []} labels={t.forecast} />

                    </>
                ) : (
                    <div className="text-center py-10 text-slate-400">
                        <CloudFog className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No detailed data available for this station.</p>
                    </div>
                )}
            </div>

            {/* Footer Attribution */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
                <p className="text-[10px] text-center text-slate-400">
                    Source: World Air Quality Index Project (waqi.info)
                </p>
            </div>
        </div>
    );
}

function WeatherCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    // ... (Component remains same)
    return (
        <div className="bg-white/60 p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-1">
            <div className="bg-slate-50 p-2 rounded-full mb-1">{icon}</div>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className="text-slate-700 font-bold">{value}</p>
        </div>
    );
}

function PollutantRow({ label, value, unit }: { label: string, value?: number, unit: string }) {
    // ... (Component remains same)
    if (value === undefined) return null;
    return (
        <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-slate-100">
            <span className="text-sm text-slate-600 font-medium">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-800">{value}</span>
                <span className="text-[10px] text-slate-400">{unit}</span>
            </div>
        </div>
    );
}

// ... (ส่วนบนของไฟล์เหมือนเดิม)

// ✅ แก้ไข function ForecastChart ท้ายไฟล์
function ForecastChart({ data, labels }: { data: any[], labels: any }) {
    if (!data || data.length === 0) return null;

    // ตัดเอาแค่ 5 วันข้างหน้า
    const next5Days = data.slice(0, 5);
    // หาค่าสูงสุดเพื่อคำนวณความสูง (ป้องกันการหารด้วย 0)
    const maxVal = Math.max(...next5Days.map(d => d.max)) || 100;

    return (
        // ปรับพื้นหลัง Container ให้เข้มขึ้นนิดนึง เพื่อให้กราฟเด่นขึ้น
        <div className="mt-6 bg-slate-100/80 p-5 rounded-2xl border border-slate-200/60 backdrop-blur-sm">

            {/* Header ของกราฟ */}
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-slate-200 p-1 rounded text-xs">📅</span>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">{labels.title}</h4>
            </div>

            <div className="flex justify-between items-end h-28 gap-2">
                {next5Days.map((day, i) => {
                    // คำนวณความสูง (ให้มีขั้นต่ำ 15% จะได้ไม่กุดหายไปเลยเวลาน้อยๆ)
                    const heightPercent = Math.max(15, (day.avg / maxVal) * 100);
                    const date = new Date(day.day).toLocaleDateString('en-US', { weekday: 'short' });

                    // ✅ เปลี่ยนการเลือกสีเป็น Gradient ไล่เฉดแนวตั้ง (ดูแพงขึ้น)
                    let barColor = "bg-gradient-to-t from-teal-500 to-emerald-400 shadow-emerald-200/50"; // Good (เขียวอมฟ้า)
                    if (day.avg > 50) barColor = "bg-gradient-to-t from-yellow-500 to-amber-400 shadow-amber-200/50"; // Moderate (เหลืองทอง)
                    if (day.avg > 100) barColor = "bg-gradient-to-t from-orange-600 to-orange-400 shadow-orange-200/50"; // Sensitive (ส้มเข้ม)
                    if (day.avg > 150) barColor = "bg-gradient-to-t from-red-600 to-rose-500 shadow-rose-200/50"; // Unhealthy (แดงกุหลาบ)
                    if (day.avg > 200) barColor = "bg-gradient-to-t from-purple-700 to-fuchsia-600 shadow-fuchsia-200/50"; // Hazardous (ม่วงเข้ม - เพิ่มเผื่อไว้)

                    return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative z-0 hover:z-10">
                            {/* Tooltip ค่าตัวเลข (ลอยขึ้นมาเมื่อเอาเมาส์ชี้) */}
                            <div className="absolute -top-9 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-lg font-bold pointer-events-none">
                                {labels.avg}: {day.avg}
                            </div>

                            {/* ตัวแท่งกราฟ */}
                            <div
                                className={`w-full rounded-t-xl transition-all duration-500 ease-out ${barColor} shadow-md relative overflow-hidden group-hover:scale-[1.02] origin-bottom`}
                                style={{ height: `${heightPercent}%` }}
                            >
                                {/* เพิ่มลูกเล่นแสงสะท้อนเล็กน้อยที่มุมบน */}
                                <div className="absolute top-0 inset-x-0 h-[2px] bg-white/30"></div>
                            </div>

                            {/* วันที่ */}
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                {i === 0 ? labels.today : date}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}