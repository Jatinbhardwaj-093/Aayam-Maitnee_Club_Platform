import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Download,
    Info,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemPulseBar {
    id: number;
    height: string;
    uptime: string;
    isSecondary?: boolean;
}

interface PerformanceDataPoint {
    x: number;
    y: number;
    time: string;
    latency: number;
}

interface EngagementBar {
    id: number;
    height: string;
    users: string;
    active?: boolean;
}

export default function PlatformAnalytics() {
    // Navigation & Page State
    const [selectedPeriod, setSelectedPeriod] = useState<"4 Weeks" | "Quarter" | "Year">("4 Weeks");
    const [visiblePlots, setVisiblePlots] = useState({
        footfall: true,
        engagement: true,
        baseline: true,
    });

    // Export report interactive state
    const [exportState, setExportState] = useState<"idle" | "exporting" | "done">("idle");

    const handleExport = () => {
        setExportState("exporting");
        setTimeout(() => {
            setExportState("done");
            setTimeout(() => setExportState("idle"), 2000);
        }, 1200);
    };

    // Hover Tooltip States
    interface ForecastTooltip {
        x: number;
        y: number;
        title: string;
        value: string;
        change: string;
    }
    const [tooltip, setTooltip] = useState<ForecastTooltip | null>(null);

    // System Uptime Raw Data
    const systemPulseBars: SystemPulseBar[] = [
        { id: 1, height: "h-full", uptime: "99.9%" },
        { id: 2, height: "h-[90%]", uptime: "99.8%" },
        { id: 3, height: "h-full", uptime: "99.9%" },
        { id: 4, height: "h-[85%]", uptime: "99.6%" },
        { id: 5, height: "h-[95%]", uptime: "99.8%" },
        { id: 6, height: "h-full", uptime: "99.8%", isSecondary: true },
    ];

    // API Latencies (Curve Coordinates)
    const apiPoints: PerformanceDataPoint[] = [
        { x: 0, y: 25, time: "Mon", latency: 130 },
        { x: 10, y: 15, time: "Tue", latency: 121 },
        { x: 20, y: 20, time: "Wed", latency: 125 },
        { x: 40, y: 10, time: "Thu", latency: 110 },
        { x: 60, y: 15, time: "Fri", latency: 118 },
        { x: 80, y: 5, time: "Sat", latency: 105 },
        { x: 100, y: 15, time: "Sun", latency: 124 },
    ];
    const [hoveredApiPoint, setHoveredApiPoint] = useState<PerformanceDataPoint | null>(null);

    // Engagement Bars
    const engagementBars: EngagementBar[] = [
        { id: 1, height: "h-[40%]", users: "3,810" },
        { id: 2, height: "h-[60%]", users: "3,950" },
        { id: 3, height: "h-[50%]", users: "3,900" },
        { id: 4, height: "h-[80%]", users: "4,120" },
        { id: 5, height: "h-[75%]", users: "4,080" },
        { id: 6, height: "h-full", users: "4,281", active: true },
        { id: 7, height: "h-[65%]", users: "3,980" },
    ];
    const [hoveredEngagementBar, setHoveredEngagementBar] = useState<EngagementBar | null>(null);

    // Forecast Plot Config
    const forecastPoints = {
        footfall: [
            { cx: 400, cy: 100, week: "Week 2 Focus", value: "11,240", change: "+12%" },
            { cx: 800, cy: 60, week: "Week 4 Estimate", value: "13,950", change: "+15%" },
        ],
        engagement: [
            { cx: 400, cy: 150, week: "Week 2 Focus", value: "78.4%", change: "+4%" },
            { cx: 850, cy: 90, week: "Week 4 Estimate", value: "85.2%", change: "+8%" },
        ],
    };

    return (
        <div className="space-y-8 font-sans text-[#466272] max-w-[1280px] mx-auto min-h-screen">
            {/* Top Banner section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#cac6b9]/30 pb-6">
                <div>
                    <h2 className="text-[40px] font-semibold font-serif text-[#1c1b19] leading-tight mb-2">Platform Analytics</h2>
                    <p className="text-[18px] text-[#49473d] max-w-2xl opacity-80 leading-relaxed font-normal">
                        Forecasting and system health for the Matinee Portal.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleExport}
                        className="border border-[#cac6b9] text-[#1c1b19] bg-transparent hover:bg-[#f7f3ee]/55 font-bold rounded-lg text-xs py-2.5 px-4 transition-colors"
                    >
                        {exportState === "idle" && <><Download className="w-3.5 h-3.5 mr-1" /> Export Report</>}
                        {exportState === "exporting" && "Generating CSV..."}
                        {exportState === "done" && "Report Downloaded"}
                    </Button>

                    <div className="px-3 py-1 bg-[#e2fdff] text-[#324b4d] rounded-full font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 self-start md:self-auto">
                        <span className="w-2 h-2 rounded-full bg-[#496365] animate-pulse"></span>
                        Live Data
                    </div>
                </div>
            </section>

            {/* Top Row: System Health Cards (3 Columns) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: System Health Card */}
                <div className="bg-[#fff9d2] rounded-xl p-6 border border-[#cac6b9]/45 flex flex-col justify-between min-h-[190px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-[#635f41]" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#49473d]/70 mb-1">System Health</h3>
                        <p className="text-[11px] text-[#466272]/80">Real-time availability pulse</p>
                    </div>
                    <div className="flex items-end gap-3 mt-6">
                        <span className="text-[34px] font-semibold text-[#1c1b19] font-serif leading-none">99.8%</span>
                        <span className="text-[#496365] text-xs font-semibold flex items-center pb-0.5">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +0.1%
                        </span>
                    </div>

                    {/* Minimalist pulse line visualization */}
                    <div className="w-full h-8 mt-4 flex items-end gap-1 opacity-80 z-10">
                        {systemPulseBars.map((bar) => (
                            <div
                                key={bar.id}
                                className={`w-1/6 ${bar.height} ${bar.isSecondary ? 'bg-[#466272]' : 'bg-[#8CC0EB]'} rounded-t-sm hover:opacity-100 cursor-pointer transition-opacity relative group`}
                            >
                                {/* Micro tooltip */}
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c1b19] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {bar.uptime}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 2: API Performance Card */}
                <div className="bg-white rounded-xl p-6 border border-[#cac6b9]/45 flex flex-col justify-between min-h-[190px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#49473d]/70 mb-1">API Performance</h3>
                        <p className="text-[11px] text-[#466272]/80">Average response latency</p>
                    </div>
                    <div className="flex items-end gap-3 mt-6">
                        <span className="text-[34px] font-semibold text-[#1c1b19] font-serif leading-none">
                            124<span className="text-lg ml-0.5 text-[#49473d]">ms</span>
                        </span>
                        <span className="text-[#ba1a1a] text-xs font-semibold flex items-center pb-0.5">
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -12ms
                        </span>
                    </div>

                    {/* SVG line chart and interactivity */}
                    <div className="w-full h-12 mt-4 relative">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                            <path
                                d="M0 25 Q 10 15, 20 20 T 40 10 T 60 15 T 80 5 T 100 15"
                                fill="none"
                                stroke="#b0ccce"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            ></path>
                            <path
                                d="M0 25 Q 10 15, 20 20 T 40 10 T 60 15 T 80 5 T 100 15 L 100 30 L 0 30 Z"
                                fill="url(#gradient-blue)"
                                opacity="0.2"
                            ></path>
                            <defs>
                                <linearGradient id="gradient-blue" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#b0ccce"></stop>
                                    <stop offset="100%" stopColor="transparent"></stop>
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Interactive Dots on curve */}
                        <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                            {apiPoints.map((pt, idx) => (
                                <div
                                    key={idx}
                                    className="w-3 h-3 hover:scale-150 rounded-full bg-white border border-[#496365] pointer-events-auto cursor-pointer relative"
                                    style={{
                                        left: `${pt.x}%`,
                                        top: `${(pt.y / 30) * 100}%`,
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                    onMouseEnter={() => setHoveredApiPoint(pt)}
                                    onMouseLeave={() => setHoveredApiPoint(null)}
                                />
                            ))}
                        </div>

                        {/* Micro tooltip */}
                        {hoveredApiPoint && (
                            <div
                                className="absolute bg-[#31302d] text-white text-[10px] p-1.5 rounded shadow z-40 whitespace-nowrap pointer-events-none -translate-x-1/2 -translate-y-[120%]"
                                style={{
                                    left: `${hoveredApiPoint.x}%`,
                                    top: `${(hoveredApiPoint.y / 30) * 100}%`
                                }}
                            >
                                {hoveredApiPoint.time}: {hoveredApiPoint.latency}ms
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 3: Weekly Active Users */}
                <div className="bg-white rounded-xl p-6 border border-[#cac6b9]/45 flex flex-col justify-between min-h-[190px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#49473d]/70 mb-1">Weekly Engagement</h3>
                        <p className="text-[11px] text-[#466272]/80">Active users this period</p>
                    </div>
                    <div className="flex items-end gap-3 mt-6">
                        <span className="text-[34px] font-semibold text-[#1c1b19] font-serif leading-none">4,281</span>
                        <span className="text-[#496365] text-xs font-semibold flex items-center pb-0.5">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +8.4%
                        </span>
                    </div>

                    {/* Bar Chart */}
                    <div className="w-full h-12 mt-4 flex items-end justify-between gap-1 relative">
                        {engagementBars.map((bar) => (
                            <div
                                key={bar.id}
                                className={`w-full ${bar.height} rounded-t-sm transition-colors cursor-pointer ${bar.active ? "bg-[#466272]" : "bg-[#F0EEEB] hover:bg-[#adcbdd]"
                                    }`}
                                onMouseEnter={() => setHoveredEngagementBar(bar)}
                                onMouseLeave={() => setHoveredEngagementBar(null)}
                            />
                        ))}

                        {/* Micro Tooltip */}
                        {hoveredEngagementBar && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#31302d] text-white text-[10px] p-1.5 rounded shadow z-40 whitespace-nowrap pointer-events-none">
                                {hoveredEngagementBar.active ? "Current Week" : `Prev Week ${hoveredEngagementBar.id}`} : {hoveredEngagementBar.users} users
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bottom Section: Audience Forecasting */}
            <section className="bg-white rounded-2xl border border-[#cac6b9]/45 shadow-[0_8px_32px_rgba(140,192,235,0.04)] overflow-hidden flex flex-col">
                <div className="p-6 md:p-8 border-b border-[#cac6b9]/25 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h3 className="text-[28px] font-semibold font-serif text-[#635f41] mb-1">Audience Forecasting &amp; Predictive Insights</h3>
                        <p className="text-xs text-[#49473d] max-w-2xl opacity-80 leading-normal">
                            Projected Venue Footfall and Engagement Metrics for the next 4 weeks. Model trained on historical attendance records, academic term schedules, and seasonal ticketing trends.
                        </p>
                    </div>
                    <div className="flex items-center gap-1 self-start md:self-auto bg-[#f7f3ee] p-1 rounded-lg border border-[#cac6b9]/20">
                        {(["4 Weeks", "Quarter", "Year"] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all ${selectedPeriod === period
                                    ? "bg-white text-[#635f41] shadow-sm"
                                    : "text-[#49473d]/70 hover:text-[#49473d]"
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sophisticated Chart Area */}
                <div className="p-6 md:p-8 flex flex-col gap-6 bg-[#FAF9F5] relative min-h-[400px]">

                    {/* Chart Legend & Toggles */}
                    <div className="flex flex-wrap items-center justify-between gap-4 z-10 relative">
                        <div className="flex gap-6">

                            {/* Projected Footfall Toggle */}
                            <button
                                onClick={() => setVisiblePlots(prev => ({ ...prev, footfall: !prev.footfall }))}
                                className={`flex items-center gap-2 cursor-pointer transition-opacity ${visiblePlots.footfall ? "opacity-100" : "opacity-40"}`}
                            >
                                <span className="w-3 h-3 rounded-full bg-[#466272]"></span>
                                <span className="font-bold text-xs text-[#49473d]">Projected Footfall</span>
                            </button>

                            {/* Engagement Rate Toggle */}
                            <button
                                onClick={() => setVisiblePlots(prev => ({ ...prev, engagement: !prev.engagement }))}
                                className={`flex items-center gap-2 cursor-pointer transition-opacity ${visiblePlots.engagement ? "opacity-100" : "opacity-40"}`}
                            >
                                <span className="w-3 h-3 rounded-full bg-[#8CC0EB]"></span>
                                <span className="font-bold text-xs text-[#49473d]">Engagement Rate</span>
                            </button>

                            {/* Historical Baseline Toggle */}
                            <button
                                onClick={() => setVisiblePlots(prev => ({ ...prev, baseline: !prev.baseline }))}
                                className={`flex items-center gap-2 cursor-pointer transition-opacity ${visiblePlots.baseline ? "opacity-100" : "opacity-40"}`}
                            >
                                <span className="w-3 h-3 rounded-full bg-[#cac6b9] border border-dashed border-[#7a776c]"></span>
                                <span className="font-bold text-xs text-[#49473d]">Historical Baseline</span>
                            </button>
                        </div>
                    </div>

                    {/* SVG Graph Canvas */}
                    <div className="flex-1 w-full relative mt-4 min-h-[260px]">

                        {/* Y-Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-[11px] text-[#49473d]/70 font-semibold">
                            <span>{selectedPeriod === "Year" ? "120k" : selectedPeriod === "Quarter" ? "45k" : "15k"}</span>
                            <span>{selectedPeriod === "Year" ? "80k" : selectedPeriod === "Quarter" ? "30k" : "10k"}</span>
                            <span>{selectedPeriod === "Year" ? "40k" : selectedPeriod === "Quarter" ? "15k" : "5k"}</span>
                            <span>0</span>
                        </div>

                        {/* Grid Boundaries */}
                        <div className="absolute inset-0 left-12 bottom-8 border-b border-l border-[#cac6b9]/40 z-0">
                            {/* Grid Horizontal helpers */}
                            <div className="absolute top-0 w-full h-px bg-[#cac6b9]/15"></div>
                            <div className="absolute top-1/3 w-full h-px bg-[#cac6b9]/15"></div>
                            <div className="absolute top-2/3 w-full h-px bg-[#cac6b9]/15"></div>

                            {/* Grid Vertical helpers */}
                            <div className="absolute left-1/4 h-full w-px bg-[#cac6b9]/15"></div>
                            <div className="absolute left-2/4 h-full w-px bg-[#cac6b9]/15"></div>
                            <div className="absolute left-3/4 h-full w-px bg-[#cac6b9]/15"></div>

                            {/* The Graph SVG */}
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                                {/* Defines Gradient */}
                                <defs>
                                    <linearGradient id="predictive-gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#466272"></stop>
                                        <stop offset="100%" stopColor="transparent"></stop>
                                    </linearGradient>
                                    <linearGradient id="forecast-zone" x1="0" x2="1" y1="0" y2="0">
                                        <stop offset="0%" stopColor="#fff9d2" stopOpacity="0.1"></stop>
                                        <stop offset="100%" stopColor="#fff9d2" stopOpacity="0.75"></stop>
                                    </linearGradient>
                                </defs>

                                {/* Forecast Zone Highlight (Only on 4 week / quarter projections) */}
                                {selectedPeriod !== "Year" && (
                                    <>
                                        <rect fill="url(#forecast-zone)" height="300" opacity="0.4" width="250" x="750" y="0"></rect>
                                        <line stroke="#8CC0EB" strokeDasharray="4,4" strokeWidth="1" x1="750" x2="750" y1="0" y2="300"></line>
                                    </>
                                )}

                                {/* 1. Historical Baseline Path */}
                                {visiblePlots.baseline && (
                                    <path
                                        d="M0,250 C100,240 200,180 300,190 C400,200 500,120 600,150 C700,180 800,90 900,110 C950,120 1000,100 1000,100"
                                        fill="none"
                                        stroke="#cac6b9"
                                        strokeDasharray="8,8"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                        className="transition-all duration-500"
                                    ></path>
                                )}

                                {/* 2. Engagement Rate Curve */}
                                {visiblePlots.engagement && (
                                    <path
                                        d="M0,200 C150,180 250,220 400,150 C550,80 700,180 850,90 C920,50 1000,70 1000,70"
                                        fill="none"
                                        stroke="#8CC0EB"
                                        strokeWidth="3"
                                        vectorEffect="non-scaling-stroke"
                                        className="transition-all duration-500"
                                    ></path>
                                )}

                                {/* 3. Projected Footfall Navy Path with Gradient fill */}
                                {visiblePlots.footfall && (
                                    <>
                                        <path
                                            d="M0,150 C150,120 250,80 400,100 C550,120 650,40 800,60 C900,70 1000,20 1000,20 L1000,300 L0,300 Z"
                                            fill="url(#predictive-gradient)"
                                            opacity="0.1"
                                            className="transition-all duration-500"
                                        ></path>
                                        <path
                                            d="M0,150 C150,120 250,80 400,100 C550,120 650,40 800,60 C900,70 1000,20 1000,20"
                                            fill="none"
                                            stroke="#466272"
                                            strokeWidth="4"
                                            vectorEffect="non-scaling-stroke"
                                            className="transition-all duration-500"
                                        ></path>
                                    </>
                                )}

                                {/* Interactive Points - Footfall */}
                                {visiblePlots.footfall && forecastPoints.footfall.map((pt, idx) => (
                                    <circle
                                        key={`ff-${idx}`}
                                        cx={pt.cx}
                                        cy={pt.cy}
                                        r="5"
                                        fill="#fdf9f4"
                                        stroke="#466272"
                                        strokeWidth="2.5"
                                        className="cursor-pointer hover:r-7 transition-all"
                                        onMouseEnter={() => setTooltip({
                                            x: pt.cx,
                                            y: pt.cy,
                                            title: pt.week,
                                            value: pt.value,
                                            change: pt.change
                                        })}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                ))}

                                {/* Interactive Points - Engagement */}
                                {visiblePlots.engagement && forecastPoints.engagement.map((pt, idx) => (
                                    <circle
                                        key={`en-${idx}`}
                                        cx={pt.cx}
                                        cy={pt.cy}
                                        r="4"
                                        fill="#fdf9f4"
                                        stroke="#8CC0EB"
                                        strokeWidth="2"
                                        className="cursor-pointer hover:r-6 transition-all"
                                        onMouseEnter={() => setTooltip({
                                            x: pt.cx,
                                            y: pt.cy,
                                            title: pt.week,
                                            value: pt.value,
                                            change: pt.change
                                        })}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                ))}
                            </svg>

                            {/* Dynamic reactive tooltip rendering */}
                            {tooltip && (
                                <div
                                    className="absolute bg-white border border-[#cac6b9] shadow-lg rounded-lg p-3 z-30 pointer-events-none transition-all duration-200"
                                    style={{
                                        left: `${(tooltip.x / 1000) * 100}%`,
                                        top: `${(tooltip.y / 300) * 100}%`,
                                        transform: 'translate(-50%, -115%)',
                                        marginTop: '-8px'
                                    }}
                                >
                                    <div className="font-bold text-[10px] uppercase text-[#49473d] mb-0.5">{tooltip.title}</div>
                                    <div className="font-serif font-semibold text-base text-[#466272] flex items-center gap-1.5">
                                        {tooltip.value}
                                        <span className="text-[10px] text-emerald-600 font-sans font-bold">{tooltip.change}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Axis Label X - dynamically updates depending on period selection */}
                        <div className="absolute left-12 right-0 bottom-0 h-6 flex justify-between items-end text-[11px] text-[#49473d]/70 font-semibold px-2 z-10">
                            {selectedPeriod === "4 Weeks" && (
                                <>
                                    <span>Week 1</span>
                                    <span>Week 2</span>
                                    <span>Week 3</span>
                                    <span className="text-[#466272] font-bold">Week 4 (Est)</span>
                                </>
                            )}
                            {selectedPeriod === "Quarter" && (
                                <>
                                    <span>Month 1</span>
                                    <span>Month 2</span>
                                    <span>Month 3 (Mid-season)</span>
                                    <span className="text-[#466272] font-bold">Month 4 (Est)</span>
                                </>
                            )}
                            {selectedPeriod === "Year" && (
                                <>
                                    <span>Q1 Winter</span>
                                    <span>Q2 Spring</span>
                                    <span>Q3 Summer</span>
                                    <span className="text-[#466272] font-bold">Q4 Fall (Forecast)</span>
                                </>
                            )}
                        </div>

                        {/* Confidence notice (Only on 4 week / quarter projections) */}
                        {selectedPeriod !== "Year" && (
                            <div className="absolute right-4 top-4 text-[10px] text-[#466272]/70 font-bold bg-[#fff9d2]/45 px-2 py-0.5 border border-[#cac6b9]/40 rounded">
                                High Confidence Projection
                            </div>
                        )}

                    </div>
                </div>

                {/* Insights Footer */}
                <div className="bg-[#fff9d2]/30 px-6 py-4 border-t border-[#cac6b9]/20 flex items-center gap-4">
                    <Info className="w-5 h-5 text-[#466272]/90 flex-shrink-0" />
                    <p className="text-xs text-[#49473d] leading-normal font-medium">
                        <strong>Insight:</strong> The upcoming "Midsummer Night's Dream" premier aligns with university midterm breaks, projecting a 15% spike in student engagement compared to the historical baseline.
                    </p>
                </div>
            </section>
        </div>
    );
}
