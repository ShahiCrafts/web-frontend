import React, { useState, useLayoutEffect, useRef, useMemo } from 'react'; // Added useMemo
import { useProvincialPriorityZones } from '../../../hooks/admin/useDashboardAnalyticsHook'; // Adjust path to your hook

// --- STATIC BASE DATA FOR PROVINCE GEOMETRY AND POPULATION ---
// We retain this as your backend only provides priorityScore and totalIssues,
// not the SVG 'd' path or text coordinates, or static population.
// We will merge backend data into this.
const baseProvinceData = [
    { id: 'p1', name: 'Koshi', initial: 'K', count: 4972021, d: "M724.8,242.9l-29.2,33.5l-23.7,13.2l-22.3-10l-12.8-22l-13-1.8l-15.5-23.7l-2.2-22.7l-15.6-23.7l1.7-16.7l16.1-13.3l17.8-24.2l12.8-2.2l20.4,17.9l36,13.7l22.5,23.3L724.8,242.9z", textX: 680, textY: 220 },
    { id: 'p2', name: 'Madhesh', initial: 'M', count: 6126288, d: "M628.9,289.4l-23.8-13.1l-29.1-33.5l-33.5,1.2l-46.7,2.2l-29.1,1.7l-42.3,1.8l-18.9,1.2l-10.7-30.8l-13.9,0.2l-13.5,29.9l-49.8-0.3l-20.9-2.2l-11.7,29.5l-22.3,1.7l20,13.3l23.5,1.7l13.5,10.6l54.1,2.8l13,9.3l45.4,1.7l30.8-1.7l21.3-11.1l32.2,0.6l23.1,12.7L628.9,289.4z", textX: 520, textY: 310 },
    { id: 'p3', name: 'Bagmati', initial: 'B', count: 6084042, d: "M644.4,151.2l-17.8,24.2l-16.1,13.3l-1.7,16.7l15.6,23.7l2.2,22.7l15.5,23.7l13,1.8l12.8,22l22.3,10l-33.5,1.2l-46.7,2.2l-29.1,1.7l-42.3,1.8l-18.9,1.2l-10.7-30.8l-13.9,0.2l-23.2-2.3l-14.4-18.9l-22-29.1l-10.9-25.3l-20.9-23.1l10-18.9l19.8-1.2l19.8-20.9l16.7-1.7l22.2,12.2l18.8,1.7l24-17.7l27.5-3.3l20.8,17.6L644.4,151.2z", textX: 550, textY: 215 },
    { id: 'p4', name: 'Gandaki', initial: 'G', count: 2479745, d: "M478.4,103.8l-20.9,23.1l-10.9,25.3l-22,29.1l-14.4,18.9l-23.2,2.3l-14.6-2.3l-24.4-22.2l-20-31.9l-22.2-14.4l-11.1-23.3l-1.7-22.2l18.8-11.1l17.8,1.7l23.3-15.5l18.8-1.7l22.2,12.2l16.7,1.7l19.8,20.9l19.8,1.2L478.4,103.8z", textX: 400, textY: 140 },
    { id: 'p5', name: 'Lumbini', initial: 'L', count: 5124225, d: "M439.8,258.9l-11.7-29.5l-20.9,2.2l-49.8-0.3l-13.5-29.9l-13.9-0.2l-14.6-2.3l-24.4,22.2l-14.4,30.8l-1.7,13.3l-14.4,9.3l-1.2,15.5l14.4,13.3l15.5,2.2l20,11.1l29.9,3.3l16.7,12.2l32-1.7l22.2-11.1l20-14.4l11.1-15.5l13.3-12.2L439.8,258.9z", textX: 370, textY: 280 },
    { id: 'p6', name: 'Karnali', initial: 'K', count: 1694889, d: "M328.7,46.2l-18.8,11.1l-1.7,22.2l-11.1,23.3l-22.2,14.4l-20,31.9l-14.4,30.8l-1.7,13.3l-14.4,9.3l-1.2,15.5l-13.1-6.7l-15.8-21.9l-27-21.9l-23.3-32.6l-18.3-2.4l-10.6-21.4l2.4-18.3l17.2-11.8l21.9,4.2l31.5-20.2l17.7-2.9l22.5,13.1l23.8-2.9l11.2,10.6L328.7,46.2z", textX: 250, textY: 150 },
    { id: 'p7', name: 'Sudurpashchim', initial: 'S', count: 2711270, d: "M290.4,233.9l-13.1-6.7l-15.8-21.9l-27-21.9l-13.3-1.2l-14.4,14.4l-10,13.3l-18.8,2.2l-8.9,13.3l-15.5,7.8l-2.2,14.4l10,13.3l13.3,4.4l11.1,11.1l22.2,12.2l12.2,1.7l23.3,1.7l15.5,2.2l14.4-13.3l1.2-15.5L290.4,233.9z", textX: 200, textY: 275 },
];

const getColor = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
        // Return a clear, visible default color for provinces with no data
        return 'lightgray'; // Or a specific CSS color like '#E0E0E0'
    }
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    const hue = 120 - (normalizedValue / 100) * 120;
    return `hsl(${hue}, 90%, 45%)`;
};

const getRange = (value) => {
    // Assuming score ranges for low, medium, high
    if (value >= 70) return 'high'; // Adjust thresholds as needed based on your scores
    if (value >= 40) return 'medium';
    return 'low';
};

const Legend = ({ onRangeHover }) => {
    const legendItems = [
        { range: 'high', color: getColor(85), label: 'High Priority' },
        { range: 'medium', color: getColor(50), label: 'Medium Priority' },
        { range: 'low', color: getColor(15), label: 'Low Priority' },
    ];
    return (
        <div className="flex justify-center items-center space-x-10 pt-2">
            {legendItems.map((item) => (
                <div key={item.range} className="flex items-center space-x-2 cursor-pointer" onMouseEnter={() => onRangeHover(item.range)} onMouseLeave={() => onRangeHover(null)} >
                    <div className="w-5 h-4 rounded border border-gray-300" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-gray-700" style={{ fontSize: '14px' }}> {item.label} </span>
                </div>
            ))}
        </div>
    );
};

// --- TOOLTIP COMPONENT ---
const Tooltip = ({ province, mousePosition }) => {
    const tooltipRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useLayoutEffect(() => {
        if (province && tooltipRef.current) {
            const { offsetWidth, offsetHeight } = tooltipRef.current;
            const { innerWidth, innerHeight } = window;

            let x = mousePosition.x + 15;
            let y = mousePosition.y + 15;

            if (x + offsetWidth > innerWidth) {
                x = mousePosition.x - offsetWidth - 15;
            }
            if (y + offsetHeight > innerHeight) {
                y = mousePosition.y - offsetHeight - 15;
            }

            setPosition({ x, y });
        }
    }, [province, mousePosition]);

    if (!province) return null;

    return (
        <div
            ref={tooltipRef}
            className="absolute z-30 bg-white p-3 rounded-lg shadow-lg transition-opacity duration-200"
            style={{
                left: position.x,
                top: position.y,
                pointerEvents: 'none',
                fontSize: '14px',
                opacity: position.x === 0 ? 0 : 1,
            }}
        >
            <h3 className="font-semibold text-gray-800" style={{ fontSize: '14px' }}>{province.name}</h3>
            <p className="text-gray-600 font-semibold" style={{ fontSize: '14px' }}>
                Priority Score: <span className="font-semibold">{province.priorityScore ? parseFloat(province.priorityScore).toFixed(2) : 'N/A'}</span>
            </p>
            <p className="text-gray-600 font-semibold" style={{ fontSize: '14px' }}>
                Total Issues: <span className="font-semibold">{province.totalIssues ?? 0}</span>
            </p>
            <p className="text-gray-600 font-semibold" style={{ fontSize: '14px' }}>
                Population: <span className="font-semibold">{province.count ? province.count.toLocaleString() : 'N/A'}</span>
            </p>
        </div>
    );
};

// --- MAIN COMPONENT: HeatMapCard ---
export default function HeatMapCard() {
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [highlightedRange, setHighlightedRange] = useState(null);

    // Fetch dynamic priority data using the hook
    const { data: priorityZonesData, isLoading, isError, error } = useProvincialPriorityZones();

    // Memoize the merged data for efficient rendering
    const mergedProvinceData = useMemo(() => {
        if (!priorityZonesData) return baseProvinceData.map(p => ({ ...p, priorityScore: null, totalIssues: null })); // Return base with null scores if no data

        const dataMap = new Map();
        priorityZonesData.forEach(p => {
            dataMap.set(p.province, p);
        });

        return baseProvinceData.map(baseP => {
            const dynamicP = dataMap.get(baseP.name); // Match by province name
            return {
                ...baseP, // Keep original SVG path, ID, initial, population
                // Override with dynamic data if available, otherwise null/0
                priorityScore: dynamicP?.priorityScore ? parseFloat(dynamicP.priorityScore) : null,
                totalIssues: dynamicP?.totalIssues ?? 0,
                // Add value for getColor/getRange, mapping priorityScore to it.
                // Assuming priorityScore from backend is the 'value' we want to color by.
                value: dynamicP?.priorityScore ? parseFloat(dynamicP.priorityScore) : null
            };
        });
    }, [priorityZonesData]); // Recalculate if priorityZonesData changes

    const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="w-auto max-w-max bg-white p-4 rounded-2xl shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="bg-gray-200 rounded-xl p-4 mb-3" style={{ height: '300px' }}></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    // Render error state
    if (isError) {
        return (
            <div className="w-auto max-w-max bg-white p-4 rounded-2xl shadow-md text-red-600">
                <h2 className="text-base font-semibold mb-2">Error Loading Map Data</h2>
                <p className="text-sm">Failed to load provincial priority zones: {error?.message || 'Unknown error'}</p>
                <p className="text-xs text-gray-500 mt-2">Please try refreshing the page or checking backend logs.</p>
            </div>
        );
    }


    return (
        <>
            <div className="w-auto max-w-max bg-white p-4 rounded-2xl shadow-md" onMouseMove={handleMouseMove}>
                <h2 className="text-left text-gray-900 mb-1 font-semibold text-base">
                    Provincial Priority Zones
                </h2>
                <p className="text-left text-sm text-gray-500 mb-4 font-medium">
                    Hover over the map or legend to interact.
                </p>

                <div className="bg-gray-100 rounded-xl p-4 mb-3 overflow-hidden">
                    {/* Use mergedProvinceData instead of static provinceData */}
                    <svg viewBox="100 0 700 400" className="w-full max-w-lg mx-auto">
                        {mergedProvinceData.map((province) => {
                            const isHovered = hoveredProvince?.id === province.id;
                            const provinceRange = getRange(province.value); // Use province.value (priorityScore)
                            const isDimmed = highlightedRange && highlightedRange !== provinceRange && !isHovered;
                            const provinceColor = getColor(province.value); // Use province.value (priorityScore)

                            return (
                                <g
                                    key={province.id}
                                    onMouseEnter={() => setHoveredProvince(province)}
                                    onMouseLeave={() => setHoveredProvince(null)}
                                    style={{
                                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                                        opacity: isDimmed ? 0.2 : 1,
                                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                        transformOrigin: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <path
                                        d={province.d}
                                        fill={provinceColor}
                                        stroke="white"
                                        strokeWidth="2"
                                        style={{
                                            filter: isHovered ? `drop-shadow(0 0 8px ${provinceColor})` : 'none',
                                        }}
                                    />
                                    <text x={province.textX} y={province.textY} fontSize="16" fontWeight="600" fill="white" textAnchor="middle" alignmentBaseline="middle" style={{ pointerEvents: 'none' }} >
                                        {province.initial}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <Legend onRangeHover={setHighlightedRange} />
            </div>

            {/* The Tooltip is now passed the entire hoveredProvince object, which contains all relevant data */}
            <Tooltip province={hoveredProvince} mousePosition={mousePosition} />
        </>
    );
}