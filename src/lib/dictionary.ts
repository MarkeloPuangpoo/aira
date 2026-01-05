export const DICTIONARY = {
    en: {
        map: {
            pm25: "PM 2.5",
            flood: "Flood Risk",
            locateMe: "Where am I?",
            stationLabel: "THAILAND AIR VIBES",
            youAreHere: "You are here"
        },
        status: {
            good: "Fresh & Clean 🍃",
            moderate: "It's Okay 😐",
            sensitive: "Sensitive Groups 😷",
            unhealthy: "Bad Air Day 🚨",
            hazardous: "Toxic! Stay Home ☠️",
            loading: "Tuning signal... 📡"
        },
        weather: {
            temp: "Temp",
            humidity: "Humidity",
            wind: "Wind Flow",
            pressure: "Pressure",
            conditions: "Conditions",
            pollutants: "Nasties in Air"
        },
        insight: {
            aiAnalysis: "AI Insight 🤖",
            suggestion: "What to do?"
        },
        forecast: {
            title: "5-DAY FORECAST (PM 2.5)",
            today: "Today",
            avg: "Avg"
        }
    },
    th: {
        map: {
            pm25: "ค่าฝุ่นวันนี้",
            flood: "จุดเสี่ยงน้ำ",
            locateMe: "ฉันอยู่ตรงไหน?",
            stationLabel: "ส่องอากาศเมืองไทย",
            youAreHere: "ตัวอยู่ตรงนี้"
        },
        status: {
            good: "ดีต่อปอดเว่อร์ 🍃",
            moderate: "ก็พอไหวอยู่ 😐",
            sensitive: "กลุ่มเสี่ยงระวังนะ 😷",
            unhealthy: "ไม่ไหวบอกไหว 🚨",
            hazardous: "อันตราย! เข้าบ้านด่วน ☠️",
            loading: "กำลังจูนสัญญาณ... 📡"
        },
        weather: {
            temp: "อุณหภูมิ",
            humidity: "ความชื้น",
            wind: "แรงลม",
            pressure: "ความกดอากาศ",
            conditions: "สภาพรวมๆ",
            pollutants: "ตัวร้ายในอากาศ"
        },
        insight: {
            aiAnalysis: "AI อยากบอก 🤖",
            suggestion: "ทำตัวยังไงดี?"
        },
        forecast: {
            title: "แนวโน้มฝุ่น 5 วัน",
            avg: "เฉลี่ย",
            today: "วันนี้"
        }
    }
};

export type Language = 'en' | 'th';