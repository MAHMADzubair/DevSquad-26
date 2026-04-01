import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/plans');
      return data;
    },
  });

  return (
    <section className="w-full">
      <div className="w-full max-w-[1920px] mx-auto px-[15px] laptop:px-[80px] desktop:px-[162px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-[80px]">
          <div className="flex flex-col max-w-[900px]">
            <h2 className="text-[28px] md:text-[38px] font-bold text-text-p mb-3">Choose the plan that's right for you</h2>
            <p className="text-[14px] md:text-[18px] text-text-s font-normal">Join Netixsol and select from our flexible subscription options tailored to suit your viewing preferences.</p>
          </div>
          
          <div className="flex items-center bg-bg-custom border border-border-custom rounded-[12px] p-2 mt-6 md:mt-0">
            <button 
              className={`px-6 py-3 rounded-[10px] text-[16px] font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-surface text-text-p shadow-lg' : 'text-text-s hover:text-text-p'}`}
              onClick={() => setBillingCycle('monthly')}
            > Monthly </button>
            <button 
              className={`px-6 py-3 rounded-[10px] text-[16px] font-semibold transition-all ${billingCycle === 'yearly' ? 'bg-surface text-text-p shadow-lg' : 'text-text-s hover:text-text-p'}`}
              onClick={() => setBillingCycle('yearly')}
            > Yearly </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[30px]">
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : plans.map((plan: any) => (
            <div key={plan.id} className="bg-surface border border-border-custom rounded-[12px] p-8 lg:p-12 flex flex-col justify-between hover:border-primary/30 transition-colors">
              <div>
                <h3 className="text-[24px] font-semibold text-text-p mb-4">{plan.name}</h3>
                <p className="text-[16px] text-text-s font-normal mb-8 leading-[150%] h-[100px] overflow-hidden">
                  {plan.features.join(' • ')}
                </p>
                <div className="text-[40px] font-bold text-text-p mb-8 border-t border-border-custom pt-8">
                  ${billingCycle === 'yearly' ? (plan.price * 10).toFixed(2) : plan.price}
                  <span className="text-[16px] text-text-s font-medium">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button 
                  onClick={() => navigate('/register')}
                  className="flex-1 px-4 py-4 bg-bg-custom border border-border-custom text-text-p rounded-[8px] font-semibold hover:bg-border-custom transition-colors"
                >Free Trial</button>
                <button 
                  onClick={() => navigate('/plans')}
                  className="flex-1 px-4 py-4 bg-primary text-text-p rounded-[8px] font-semibold hover:bg-red-700 transition-colors"
                >Choose Plan</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

