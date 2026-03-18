import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, MoreHorizontal, DollarSign, Loader2, TrendingUp, Target, Trophy, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGE_CONFIG = {
  Prospect: {
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-100',
    icon: Target,
    count_color: 'bg-blue-100 text-blue-700',
  },
  Negotiation: {
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-100',
    icon: TrendingUp,
    count_color: 'bg-amber-100 text-amber-700',
  },
  Won: {
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    icon: Trophy,
    count_color: 'bg-emerald-100 text-emerald-700',
  },
  Lost: {
    color: 'bg-red-400',
    lightColor: 'bg-red-50',
    textColor: 'text-red-500',
    borderColor: 'border-red-100',
    icon: XCircle,
    count_color: 'bg-red-100 text-red-600',
  },
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Deals = () => {
  const stages = ['Prospect', 'Negotiation', 'Won', 'Lost'];
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/deals`);
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDealStage = async (id, newStage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/deals/${id}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (response.ok) {
        setDeals(deals.map(d => d.id === id ? { ...d, stage: newStage } : d));
      }
    } catch (error) {
      console.error('Failed to update stage:', error);
    }
  };

  const getStageDeals = (stage) => deals.filter(deal =>
    deal.stage?.toLowerCase() === stage.toLowerCase()
  );

  const totalValue = deals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-500 mt-1">Track opportunities through the sales funnel.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Pipeline Value</p>
            <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <Button variant="outline" className="shadow-sm">View Statistics</Button>
          <Button className="flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-5 overflow-hidden">
        {stages.map((stage) => {
          const config = STAGE_CONFIG[stage];
          const stageDeals = getStageDeals(stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
          const StageIcon = config.icon;

          return (
            <div key={stage} className="flex flex-col min-h-0">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-2xl mb-3 ${config.lightColor} ${config.borderColor} border`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${config.color} flex items-center justify-center shadow-sm`}>
                    <StageIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className={`font-bold text-sm ${config.textColor}`}>{stage}</span>
                    {stageValue > 0 && (
                      <p className="text-[10px] text-gray-400 font-medium">${stageValue.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.count_color}`}>
                    {stageDeals.length}
                  </span>
                  <button className="p-1 hover:bg-white/60 rounded-lg text-gray-400 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Column Body */}
              <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mb-2 text-brand" />
                    <p className="text-sm font-medium">Loading deals...</p>
                  </div>
                ) : stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                    <div className={`w-12 h-12 rounded-2xl ${config.lightColor} flex items-center justify-center mb-3`}>
                      <StageIcon className={`w-6 h-6 ${config.textColor} opacity-40`} />
                    </div>
                    <p className="text-xs font-medium text-gray-400">No deals yet</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Add your first opportunity</p>
                  </div>
                ) : (
                  stageDeals.map((deal, index) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 text-sm leading-snug flex-1 mr-2">{deal.name}</h4>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-0.5 flex-shrink-0">
                          <DollarSign className="w-3 h-3" />
                          {deal.value?.toString().replace('$', '') || '0'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 line-clamp-1">{deal.company}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm">JD</div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm">AK</div>
                        </div>
                        <select
                          className="text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 focus:ring-1 focus:ring-brand/20 cursor-pointer hover:bg-gray-100 transition-colors"
                          value={deal.stage}
                          onChange={(e) => updateDealStage(deal.id, e.target.value)}
                        >
                          {stages.map(s => (
                            <option key={s} value={s.toLowerCase()}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Add Opportunity Button */}
                <button className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-400 bg-white/60 hover:text-brand hover:bg-brand/5 rounded-2xl border border-dashed border-gray-200 hover:border-brand/30 transition-all">
                  <Plus className="w-4 h-4" />
                  Add Opportunity
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Deals;
