import React, { useState } from 'react';

const provinceData = [
    { id: 'p1', name: 'Koshi', initial: 'K', value: 85, count: 4972021, d: "M724.8,242.9l-29.2,33.5l-23.7,13.2l-22.3-10l-12.8-22l-13-1.8l-15.5-23.7l-2.2-22.7l-15.6-23.7l1.7-16.7l16.1-13.3l17.8-24.2l12.8-2.2l20.4,17.9l36,13.7l22.5,23.3L724.8,242.9z", textX: 680, textY: 220 },
    { id: 'p2', name: 'Madhesh', initial: 'M', value: 45, count: 6126288, d: "M628.9,289.4l-23.8-13.1l-29.1-33.5l-33.5,1.2l-46.7,2.2l-29.1,1.7l-42.3,1.8l-18.9,1.2l-10.7-30.8l-13.9,0.2l-13.5,29.9l-49.8-0.3l-20.9-2.2l-11.7,29.5l-22.3,1.7l20,13.3l23.5,1.7l13.5,10.6l54.1,2.8l13,9.3l45.4,1.7l30.8-1.7l21.3-11.1l32.2,0.6l23.1,12.7L628.9,289.4z", textX: 520, textY: 310 },
    { id: 'p3', name: 'Bagmati', initial: 'B', value: 95, count: 6084042, d: "M644.4,151.2l-17.8,24.2l-16.1,13.3l-1.7,16.7l15.6,23.7l2.2,22.7l15.5,23.7l13,1.8l12.8,22l22.3,10l-33.5,1.2l-46.7,2.2l-29.1,1.7l-42.3,1.8l-18.9,1.2l-10.7-30.8l-13.9,0.2l-23.2-2.3l-14.4-18.9l-22-29.1l-10.9-25.3l-20.9-23.1l10-18.9l19.8-1.2l19.8-20.9l16.7-1.7l22.2,12.2l18.8,1.7l24-17.7l27.5-3.3l20.8,17.6L644.4,151.2z", textX: 550, textY: 215 },
    { id: 'p4', name: 'Gandaki', initial: 'G', value: 70, count: 2479745, d: "M478.4,103.8l-20.9,23.1l-10.9,25.3l-22,29.1l-14.4,18.9l-23.2,2.3l-14.6-2.3l-24.4-22.2l-20-31.9l-22.2-14.4l-11.1-23.3l-1.7-22.2l18.8-11.1l17.8,1.7l23.3-15.5l18.8-1.7l22.2,12.2l16.7,1.7l19.8,20.9l19.8,1.2L478.4,103.8z", textX: 400, textY: 140 },
    { id: 'p5', name: 'Lumbini', initial: 'L', value: 60, count: 5124225, d: "M439.8,258.9l-11.7-29.5l-20.9,2.2l-49.8-0.3l-13.5-29.9l-13.9-0.2l-14.6-2.3l-24.4,22.2l-14.4,30.8l-1.7,13.3l-14.4,9.3l-1.2,15.5l14.4,13.3l15.5,2.2l20,11.1l29.9,3.3l16.7,12.2l32-1.7l22.2-11.1l20-14.4l11.1-15.5l13.3-12.2L439.8,258.9z", textX: 370, textY: 280 },
    { id: 'p6', name: 'Karnali', initial: 'K', value: 30, count: 1694889, d: "M328.7,46.2l-18.8,11.1l-1.7,22.2l-11.1,23.3l-22.2,14.4l-20,31.9l-14.4,30.8l-1.7,13.3l-14.4,9.3l-1.2,15.5l-13.1-6.7l-15.8-21.9l-27-21.9l-23.3-32.6l-18.3-2.4l-10.6-21.4l2.4-18.3l17.2-11.8l21.9,4.2l31.5-20.2l17.7-2.9l22.5,13.1l23.8-2.9l11.2,10.6L328.7,46.2z", textX: 250, textY: 150 },
    { id: 'p7', name: 'Sudurpashchim', initial: 'S', value: 50, count: 2711270, d: "M290.4,233.9l-13.1-6.7l-15.8-21.9l-27-21.9l-13.3-1.2l-14.4,14.4l-10,13.3l-18.8,2.2l-8.9,13.3l-15.5,7.8l-2.2,14.4l10,13.3l13.3,4.4l11.1,11.1l22.2,12.2l12.2,1.7l23.3,1.7l15.5,2.2l14.4-13.3l1.2-15.5L290.4,233.9z", textX: 200, textY: 275 },
];

const getColor = (value) => {
    if (value === null || value === undefined) return 'bg-gray-200';
    const hue = 120 - (value / 100) * 120;
    return `hsl(${hue}, 90%, 45%)`;
};

const getRange = (value) => {
    if (value >= 67) return 'high';
    if (value >= 34) return 'medium';
    return 'low';
};

const Legend = ({ onRangeHover }) => {
    const legendItems = [
        { range: 'high', color: getColor(85), label: 'High' },
        { range: 'medium', color: getColor(50), label: 'Medium' },
        { range: 'low', color: getColor(15), label: 'Low' },
    ];

    return (
        <div className="flex justify-center items-center space-x-10 pt-2">
            {legendItems.map((item) => (
                <div
                    key={item.range}
                    className="flex items-center space-x-2 cursor-pointer"
                    onMouseEnter={() => onRangeHover(item.range)}
                    onMouseLeave={() => onRangeHover(null)}
                >
                    <div
                        className="w-5 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-gray-700" style={{ fontSize: '14px' }}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const Tooltip = ({ province, position }) => {
    if (!province) return null;
    return (
        <div
            className="absolute z-30 bg-white p-3 rounded-lg transition-opacity duration-200"
            style={{ left: position.x + 15, top: position.y + 15, pointerEvents: 'none', fontSize: '14px' }}
        >
            <h3 className="font-semibold text-gray-800" style={{ fontSize: '18px' }}>{province.name}</h3>
            <p className="text-gray-600 font-semibold" style={{ fontSize: '14px' }}>
                Priority Score: <span className="font-semibold">{province.value}</span>
            </p>
            <p className="text-gray-600 font-semibold" style={{ fontSize: '14px' }}>
                Population: <span className="font-semibold">{province.count.toLocaleString()}</span>
            </p>
        </div>
    );
};

export default function HeatMapCard() {
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [highlightedRange, setHighlightedRange] = useState(null);

    const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <>
            <div className="w-auto max-w-max bg-white p-4 rounded-2xl shadow-md" onMouseMove={handleMouseMove}>
                <h2
                    className="text-left text-gray-900 mb-1 font-semibold text-base"
                >
                    Provincial Priority Zones
                </h2>
                <p
                    className="text-left text-sm text-gray-500 mb-4 font-medium"
                >
                    Hover over the map or legend to interact.
                </p>

                <div className="bg-gray-100 rounded-xl p-4 mb-3">
                    <svg viewBox="100 0 700 400" className="w-full max-w-lg mx-auto">
                        {provinceData.map((province) => {
                            const isHovered = hoveredProvince?.id === province.id;
                            const provinceRange = getRange(province.value);
                            const isDimmed = highlightedRange && highlightedRange !== provinceRange && !isHovered;
                            const provinceColor = getColor(province.value);

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
                                    <text
                                        x={province.textX}
                                        y={province.textY}
                                        fontSize="18"
                                        fontWeight="600"  // semibold
                                        fill="white"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {province.initial}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <Legend onRangeHover={setHighlightedRange} />
            </div>

            <Tooltip province={hoveredProvince} position={mousePosition} />
        </>
    );
}
