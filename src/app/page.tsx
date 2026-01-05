"use client";

import { useState } from "react";
import { AiraMap } from "@/components/AiraMap";
import { Wind, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-50 relative selection:bg-blue-200">

      {/* 1. Map Container (Full Screen) */}
      <div className={`transition-all duration-[1500ms] ease-in-out w-full h-full absolute inset-0 
        ${started ? 'scale-100 filter-none opacity-100' : 'scale-110 blur-md brightness-90 opacity-40'}
      `}>
        <AiraMap />
      </div>

      {/* 2. Welcome Overlay */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
        ${started ? 'opacity-0 pointer-events-none translate-y-[-40px] scale-95' : 'opacity-100'}`}
      >
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

        {/* Card Content */}
        <div className="relative bg-white/70 backdrop-blur-3xl p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white/60 max-w-lg w-full mx-4 flex flex-col items-center text-center group hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500">

          {/* Logo Icon */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative bg-gradient-to-tr from-white to-slate-50 w-20 h-20 md:w-24 md:h-24 rounded-3xl shadow-xl flex items-center justify-center border border-white/50 transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
              <Wind className="w-8 h-8 md:w-10 md:h-10 text-blue-600 drop-shadow-sm" />
              <div className="absolute -top-2 -right-2 bg-emerald-400 text-white p-1.5 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-2 md:mb-3 tracking-tight bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent">
            AIRA Monitor
          </h1>

          <p className="text-slate-500 text-sm sm:text-base md:text-lg mb-6 md:mb-10 leading-relaxed font-medium px-2 md:px-0">
            ลมหายใจของคุณ... ให้เราดูแล <br />
            <span className="text-slate-400 text-xs sm:text-sm md:text-base">เช็กฝุ่นและน้ำท่วมได้ในคลิกเดียว 🇹🇭</span>
          </p>

          <button
            onClick={() => setStarted(true)}
            className="group/btn relative overflow-hidden bg-slate-900 text-white pl-8 pr-7 py-3.5 md:py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-blue-600 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
          >
            <span className="relative z-10 text-sm md:text-base">เริ่มต้นใช้งาน</span>
            <div className="relative z-10 bg-white/20 p-1 rounded-full group-hover/btn:bg-white/30 transition-colors">
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </div>
          </button>

        </div>

        <p className="absolute bottom-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
          Designed for Thai People by AIRA
        </p>
      </div>

    </main>
  );
}