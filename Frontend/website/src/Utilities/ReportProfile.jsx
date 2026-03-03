import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import axiosinstance from './axiosIntance';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

export default function ReportProfile({ user, reports = [] }) {

    const [totalReports, setTotalReports] = useState(0);
    const [reportsByReason, setReportsByReason] = useState([]);
    const blockCount = user.BlockCount || 0;

    const reasons = [
        'Sexual Harassment',
        'Unattended Review',
        'Misrepresentation of Skills',
        'Vulgar Language',
        'Spam',
        'False Reporter'
    ];

    const handleGetReportInfo = async () => {
        const response = await axiosinstance.post(
            '/Admin/get-reportInfo',
            { id: user._id }
        );

        setTotalReports(response.data.totalReports);

        // ✅ normalize data so every reason exists
        const normalizedData = reasons.map(reason => {
            const found = response.data.reportsByReason.find(
                r => r.reason === reason
            );
            return {
                reason,
                count: found ? found.count : 0
            };
        });

        setReportsByReason(normalizedData);
    };

    const MAX_RISK_SCORE = 50;

    const rawRiskScore =
        totalReports * 2 +
        blockCount * 10;

    const riskScore = Math.min(
        Math.round((rawRiskScore / MAX_RISK_SCORE) * 100),
        100
    );

    const riskLevel =
        riskScore >= 70 ? 'High Risk'
            : riskScore > 30 && riskScore <= 50 ? 'Medium Risk'
                : 'Low Risk';

    useEffect(() => {
        handleGetReportInfo();
    }, []);

    return (
        <section className="space-y-6 text-gray-100">

            <div className="flex justify-between items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className='flex gap-5'>
                    {user.profileImageUrl ? <img
                        src={user.profileImageUrl}
                        alt="profile"
                        className="w-16 h-16 rounded-full object-cover"
                    /> : <User className='text-slate-400' />}
                    <div>
                        <p className="text-lg font-semibold text-teal-400">
                            {user.userName}
                        </p>
                        <p className="text-sm text-gray-300">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className='px-10 text-sm space-y-3 text-white/50'>
                    <p>Created at : {new Date(user.createdAt).toLocaleString()}</p>
                    <p>Last Active : {new Date(user.lastActive).toLocaleString()}</p>
                </div>
            </div>

            {/* ===== RISK SCORE + CHART ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Risk Score */}
                <div className="bg-gray-900 p-4 rounded-xl border min-w-52 border-gray-800 text-center">
                    <p className="text-xs text-gray-400">Risk Percentage</p>

                    <p className={`text-3xl font-bold ${riskLevel === 'High Risk'
                        ? 'text-red-500'
                        : riskLevel === 'Medium Risk'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                        {riskScore}%
                    </p>

                    <p className="text-sm">{riskLevel}</p>

                    <div className="flex flex-col justify-between mt-4 text-sm text-gray-400">
                        <span>Reports: {totalReports}</span>
                        <span>Blocks: {blockCount}</span>
                    </div>
                </div>

                {/* Reports by Reason Chart */}
                <div className="md:col-span-2 h-60 bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={reportsByReason}
                            layout="vertical"
                            barCategoryGap={16}
                        >
                            <XAxis type="number" allowDecimals={false} domain={[0, 6]} />
                            <YAxis
                                type="category"
                                dataKey="reason"
                                width={180}
                            />
                            <Tooltip formatter={(v) => [v, 'Reports']} />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18} fill='#52f7bb' >
                                <LabelList dataKey="count" position="right" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* ===== SYSTEM RECOMMENDATION ===== */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <p className="text-sm font-semibold text-yellow-400 mb-2">
                    System Recommendation
                </p>

                <p className="text-sm text-gray-300">
                    {blockCount >= 2
                        ? 'Permanent ban strongly recommended'
                        : totalReports >= 5
                            ? 'Temporary suspension recommended'
                            : 'Monitor user activity'}
                </p>
            </div>

        </section>
    );
}