"use client";

import { useEffect, useState } from "react";
import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";
import { AiraSidePanel } from "@/components/AiraSidePanel";
import { DICTIONARY, Language } from "@/lib/dictionary";
import { RiskAlertBanner } from "@/components/RiskAlertBanner";
import "maplibre-gl/dist/maplibre-gl.css";
import { Wind, Droplets, MapPin, Navigation } from "lucide-react";

type AQIStation = {
    uid: number;
    lat: number;
    lon: number;
    aqi: string;
    station: {
        name: string;
        time: string;
    };
};

export function AiraMap() {
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [stations, setStations] = useState<AQIStation[]>([]);
    const [loading, setLoading] = useState(true);

    // Language State
    const [lang, setLang] = useState<Language>('th');
    const t = DICTIONARY[lang];

    // Layers State
    const [showAQI, setShowAQI] = useState(true);
    const [showFlood, setShowFlood] = useState(false);

    // Feature: Locate Me
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

    // Feature: Dashboard Side Panel
    const [selectedStation, setSelectedStation] = useState<AQIStation | null>(null);

    const fetchAQIData = async () => {
        const token = process.env.NEXT_PUBLIC_AQI_TOKEN;
        const bounds = "5.61,97.34,20.46,105.63";
        const url = `https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${token}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.status === "ok") setStations(data.data);
        } catch (error) {
            console.error("Failed to fetch AQI:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAQIData();
    }, []);

    // Setup Flood Layer
    useEffect(() => {
        if (!mapInstance) return;

        const setupLayer = () => {
            if (mapInstance.getSource('gistda-flood')) return;

            const gistdaKey = process.env.NEXT_PUBLIC_GISTDA_KEY;
            if (!gistdaKey) {
                console.warn("GISTDA Flood Layer: Missing API Key");
                return;
            }

            mapInstance.addSource('gistda-flood', {
                'type': 'raster',
                'tiles': [
                    `/gistda-proxy/wmts?key=${gistdaKey}&layer=flood_daily&style=default&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}`
                ],
                'tileSize': 256,
                'attribution': 'GISTDA'
            });

            mapInstance.addLayer({
                'id': 'flood-layer',
                'type': 'raster',
                'source': 'gistda-flood',
                'paint': { 'raster-opacity': 0.6 },
                'layout': { 'visibility': 'none' }
            });
        };

        if (mapInstance.loaded()) {
            setupLayer();
        } else {
            mapInstance.on('load', setupLayer);
        }

        return () => {
            mapInstance.off('load', setupLayer);
        };
    }, [mapInstance]);

    // Layer Toggling
    const toggleFlood = () => {
        const nextState = !showFlood;
        setShowFlood(nextState);

        if (mapInstance && mapInstance.getLayer('flood-layer')) {
            mapInstance.setLayoutProperty(
                'flood-layer',
                'visibility',
                nextState ? 'visible' : 'none'
            );
        }
    };

    // Close Panel on Map Click
    useEffect(() => {
        if (!mapInstance) return;
        const handleMapClick = () => setSelectedStation(null);
        mapInstance.on('click', handleMapClick);
        return () => { mapInstance.off('click', handleMapClick); };
    }, [mapInstance]);

    // Locate Me
    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert("Browser ของคุณไม่รองรับการระบุตำแหน่ง");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                mapInstance?.flyTo({
                    center: [longitude, latitude],
                    zoom: 12,
                    speed: 1.2,
                    essential: true
                });
            },
            () => {
                alert("ไม่สามารถระบุตำแหน่งได้");
            }
        );
    };

    const getAQIStatus = (aqi: number) => {
        if (aqi <= 50) return { color: "bg-emerald-400", text: "text-emerald-900", label: t.status.good };
        if (aqi <= 100) return { color: "bg-yellow-300", text: "text-yellow-900", label: t.status.moderate };
        if (aqi <= 150) return { color: "bg-orange-400", text: "text-orange-900", label: t.status.sensitive };
        if (aqi <= 200) return { color: "bg-rose-500", text: "text-white", label: t.status.unhealthy };
        return { color: "bg-purple-500", text: "text-white", label: t.status.hazardous };
    };

    // Risk Logic: Find Max AQI
    const maxAQI = stations.reduce((max, station) => {
        const val = parseInt(station.aqi);
        return isNaN(val) ? max : Math.max(max, val);
    }, 0);

    // Determine Risk Banner
    let riskBanner = null;
    if (maxAQI > 200) {
        riskBanner = (
            <RiskAlertBanner
                level="critical"
                message={lang === 'th' ? "วิกฤต! หลายพื้นที่ค่าฝุ่นพุ่งสูงระดับอันตราย งดกิจกรรมกลางแจ้งทันที" : "CRITICAL WARNING: Hazardous air quality detected in multiple areas!"}
            />
        );
    } else if (maxAQI > 150) {
        riskBanner = (
            <RiskAlertBanner
                level="high"
                message={lang === 'th' ? "เตือนภัย: อากาศเริ่มแย่ในหลายพื้นที่ ดูแลตัวเองด้วยนะ" : "WARNING: Unhealthy air quality levels detected."}
            />
        );
    }

    return (
        <div className="relative w-full h-full bg-slate-50 overflow-hidden">

            {/* Risk Banner */}
            {riskBanner}

            {/* Header / Controls */}
            <div className="absolute top-4 left-4 right-4 md:right-auto md:w-auto z-10 flex flex-col gap-3 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-lg border border-white/50 w-full md:w-[320px] pointer-events-auto transition-all">

                    {/* Title Row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 p-2.5 rounded-2xl shadow-blue-500/20 shadow-lg">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">AIRA Monitor</h1>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{t.map.stationLabel}</p>
                            </div>
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLang(prev => prev === 'th' ? 'en' : 'th')}
                            className="bg-slate-50 hover:bg-slate-100 active:scale-95 p-2 rounded-xl transition-all flex items-center justify-center gap-1 w-10 h-10 border border-slate-200 shadow-sm"
                        >
                            <span className="text-xs font-bold text-slate-600">{lang.toUpperCase()}</span>
                        </button>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide touch-pan-x">
                        <button
                            onClick={() => setShowAQI(!showAQI)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all whitespace-nowrap active:scale-95 ${showAQI
                                ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20 shadow-md"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                }`}
                        >
                            <Wind className="w-3.5 h-3.5" /> {t.map.pm25}
                        </button>

                        <button
                            onClick={toggleFlood}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all whitespace-nowrap active:scale-95 ${showFlood
                                ? "bg-blue-500 text-white border-blue-600 shadow-blue-500/20 shadow-md"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                }`}
                        >
                            <Droplets className="w-3.5 h-3.5" /> {t.map.flood}
                        </button>

                        <button
                            onClick={handleLocateMe}
                            className="px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all whitespace-nowrap active:scale-95 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm ml-auto"
                        >
                            <Navigation className="w-3.5 h-3.5" /> {t.map.locateMe}
                        </button>
                    </div>
                </div>
            </div>

            {/* Side Panel */}
            <AiraSidePanel
                isOpen={!!selectedStation}
                onClose={() => setSelectedStation(null)}
                stationUid={selectedStation?.uid ?? null}
                stationName={selectedStation?.station.name ?? ""}
                lang={lang}
            />

            {/* Map */}
            <Map
                ref={setMapInstance}
                center={[100.523186, 13.736717]}
                zoom={5}
            >
                <MapControls />

                {/* User Location */}
                {userLocation && (
                    <MapMarker longitude={userLocation.lon} latitude={userLocation.lat} anchor="bottom">
                        <MarkerContent>
                            <div className="flex flex-col items-center">
                                <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
                                <div className="bg-white px-2 py-1 rounded-md shadow-md mt-1 text-[10px] font-bold text-blue-600 border border-blue-100">
                                    {t.map.youAreHere}
                                </div>
                            </div>
                        </MarkerContent>
                    </MapMarker>
                )}

                {/* AQI Markers */}
                {showAQI && stations.map((station, idx) => {
                    const aqiVal = parseInt(station.aqi);
                    if (isNaN(aqiVal)) return null;
                    const status = getAQIStatus(aqiVal);

                    return (
                        <MapMarker
                            key={idx}
                            longitude={station.lon}
                            latitude={station.lat}
                            anchor="bottom"
                            onClick={(e) => {
                                e.stopPropagation();
                                mapInstance?.flyTo({
                                    center: [station.lon, station.lat],
                                    zoom: 10,
                                    speed: 1.5,
                                    essential: true
                                });
                                setSelectedStation(station);
                            }}
                        >
                            <MarkerContent>
                                <div className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110 hover:z-50">
                                    <div className={`
                            ${status.color} ${status.text} 
                            px-3 py-1 rounded-full shadow-md font-bold text-sm border-2 border-white
                            flex items-center gap-1 min-w-[40px] justify-center
                        `}>
                                        {station.aqi}
                                    </div>
                                    <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white -mt-[1px] opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[180px] hidden group-hover:block z-[100]">
                                        <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-2">
                                            <p className="text-xs text-slate-400 font-semibold uppercase mb-1">{status.label}</p>
                                            <h3 className="text-slate-800 font-bold text-sm truncate">{station.station.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </MarkerContent>
                        </MapMarker>
                    );
                })}
            </Map>

            {/* Loading */}
            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">{t.status.loading}</p>
                </div>
            )}
        </div>
    );
}