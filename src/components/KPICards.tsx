import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, BarChart3 } from 'lucide-react';

const KPICards = () => {
  const kpis = [
    {
      title: 'Active Deals',
      value: '34',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Pipeline Value',
      value: '$247K',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Won Deals',
      value: '20',
      change: '+15%',
      trend: 'up',
      icon: Award,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Avg Deal Size',
      value: '$12.3K',
      change: '-3%',
      trend: 'down',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.color} shadow-lg`}>
              <kpi.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{kpi.change}</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
              {kpi.value}
            </h3>
            <p className="text-gray-400 text-sm">{kpi.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;