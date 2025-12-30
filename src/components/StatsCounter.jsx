import { useEffect, useState } from 'react';
import { getStats } from '../services/api';

const StatItem = ({ label, value, icon, color }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value, 10);
        if (start === end) return;

        let totalDuration = 2000;
        let incrementTime = (totalDuration / end) * 5;

        // Optimisation pour les grands nombres
        if (end > 1000) incrementTime = 10;

        let timer = setInterval(() => {
            start += Math.ceil(end / 100);
            if (start > end) start = end;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="text-center p-6 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:transform hover:scale-105">
            <div className={`text-4xl mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                {count.toLocaleString()}
                <span className="text-blue-500 text-sm ml-1">+</span>
            </div>
            <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">{label}</p>
        </div>
    );
};

const StatsCounter = () => {
    const [stats, setStats] = useState({
        totalTicketsSold: 0,
        happyCustomers: 0,
        eventsHosted: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getStats();
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
        // Polling every 10 seconds to keep stats updated
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 pb-16 pt-0 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatItem
                    label="Billets Vendus"
                    value={stats.totalTicketsSold}
                    icon={
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    }
                    color="text-blue-500"
                />
                <StatItem
                    label="Clients Heureux"
                    value={stats.happyCustomers}
                    icon={
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    color="text-green-500"
                />
                <StatItem
                    label="Événements"
                    value={stats.eventsHosted}
                    icon={
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    color="text-purple-500"
                />
            </div>
        </section>
    );
};

export default StatsCounter;
