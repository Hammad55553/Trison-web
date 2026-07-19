import React from 'react';
import { Layers, Zap, Landmark } from 'lucide-react';
import './ValueChain.css';

// Import premium generated illustrations
import waferImg from '../../assets/images/silicon_wafer.png';
import moduleImg from '../../assets/images/pv_module.png';
import solutionsImg from '../../assets/images/pv_solutions.png';

const ValueChain = () => {
  const valueChain = [
    {
      title: 'Silicon Wafers',
      icon: <Layers size={24} />,
      image: waferImg,
      desc: 'A full range of wafer products meeting the requirements of different solar cell technology routes. High-quality monocrystalline wafers provide superior baseline performance.'
    },
    {
      title: 'PV Modules',
      icon: <Zap size={24} />,
      image: moduleImg,
      desc: 'High-conversion-efficiency solar modules engineered with advanced cell technology, bifacial output, and double glass layouts for long-term field stability.'
    },
    {
      title: 'PV Solutions',
      icon: <Landmark size={24} />,
      image: solutionsImg,
      desc: 'Multi-scenario solar PV generation configurations designed to optimize land use, C&I facility protection, and residential load offsets.'
    }
  ];

  return (
    <section id="value-chain" className="value-chain-section">
      <div className="value-chain-container">
        <div className="section-header-center">
          <span className="value-badge">Integrated Value Chain</span>
          <h2>Vertically Integrated Solar PV Value Chain</h2>
          <p>
            Trison’s technological and manufacturing leadership in monocrystalline wafers, cells, and modules underscores our commitment to helping accelerate the clean energy transition.
          </p>
        </div>

        <div className="value-grid">
          {valueChain.map((item, idx) => (
            <div className="value-chain-card" key={idx}>
              <div className="value-chain-img-box">
                <img src={item.image} alt={item.title} className="value-chain-img" />
              </div>
              <div className="value-chain-content">
                <div className="value-chain-icon-box">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueChain;
