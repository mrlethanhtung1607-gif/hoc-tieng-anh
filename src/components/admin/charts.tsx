"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface RegistrationChartProps {
    data: { date: string; users: number }[];
}

export function RegistrationChart({ data }: RegistrationChartProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold">
                Đăng ký mới (30 ngày)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id="colorUsers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        className="fill-muted-foreground"
                    />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        className="fill-muted-foreground"
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid hsl(var(--border))",
                            fontSize: "13px",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        name="Users"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

interface PopularCoursesChartProps {
    data: { name: string; students: number }[];
}

export function PopularCoursesChart({ data }: PopularCoursesChartProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold">
                Khóa học phổ biến nhất
            </h3>
            {data.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                    Chưa có dữ liệu
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                        />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 11 }}
                            className="fill-muted-foreground"
                            allowDecimals={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            width={140}
                            className="fill-muted-foreground"
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid hsl(var(--border))",
                                fontSize: "13px",
                            }}
                        />
                        <Bar
                            dataKey="students"
                            fill="#f59e0b"
                            radius={[0, 6, 6, 0]}
                            name="Học viên"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
