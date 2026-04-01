import { CheckOne, Diamond, Lightning } from '@icon-park/react';
import './DashboardPage.css';
import './BillingPage.css';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '¥0',
    period: '永久免费',
    features: ['无限图表创建', '3 种图表类型', 'PNG / HTML 导出', '基础颜色主题'],
    current: true,
    cta: '当前方案',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '¥29',
    period: '每月',
    features: ['Free 全部功能', '更多图表类型', '自定义品牌水印', '优先客户支持', '团队协作（即将推出）'],
    current: false,
    cta: '升级到 Pro',
    highlight: true,
  },
];

function BillingPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Billing &amp; Payments</h2>
        <p>管理你的订阅方案与付款方式</p>
      </div>

      <div className="dashboard-content">
        {/* 当前方案 */}
        <section className="dashboard-section">
          <h3 className="section-title">
            <Diamond size={16} /> 选择方案
          </h3>
          <div className="plans-grid">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`plan-card ${plan.highlight ? 'plan-highlight' : ''} ${plan.current ? 'plan-current' : ''}`}>
                {plan.highlight && <div className="plan-badge"><Lightning size={12} /> 推荐</div>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  {plan.price}
                  <span className="plan-period"> / {plan.period}</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}><CheckOne size={14} /> {f}</li>
                  ))}
                </ul>
                <button
                  className={`btn ${plan.current ? 'btn-secondary' : 'btn-primary'} plan-cta`}
                  disabled={plan.current}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 付款历史（占位） */}
        <section className="dashboard-section">
          <h3 className="section-title">账单历史</h3>
          <div className="empty-state">
            <p>暂无账单记录</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BillingPage;
