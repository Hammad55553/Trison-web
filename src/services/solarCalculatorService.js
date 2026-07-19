/**
 * Solar Sizing and Financial ROI Calculation Service
 * Custom calculations based on Pakistan's current tariff rates (approx Rs. 65 per unit average)
 * and state-of-the-art Tier-1 Mono PERC 580W panels.
 */

// Constants for calculations
const ELECTRICITY_UNIT_PRICE = 65; // average cost in PKR per kWh (unit)
const PEAK_SUN_HOURS_PER_DAY = 4.5; // Average daily effective sun hours in Pakistan
const PANEL_WATTAGE = 580; // Standard premium panel wattage
const SYSTEM_EFFICIENCY = 0.82; // standard losses (inverter, wiring, temperature)
const COST_PER_KW_ON_GRID = 165000; // PKR per kW approximate market rate for Tier-1 on-grid
const COST_PER_KW_HYBRID = 240000;  // PKR per kW approximate market rate for Hybrid with batteries

/**
 * Calculates solar system sizing and savings based on monthly electric bill
 * @param {number} monthlyBill - Average monthly electricity bill in PKR
 * @param {string} systemType - 'on-grid' | 'hybrid'
 * @returns {object} calculation results
 */
export const calculateSolarOutput = (monthlyBill, systemType = 'on-grid') => {
  if (!monthlyBill || monthlyBill <= 0) {
    return {
      monthlyUnits: 0,
      systemSizeKw: 0,
      panelsRequired: 0,
      estimatedCost: 0,
      monthlySavings: 0,
      yearlySavings: 0,
      paybackYears: 0,
      co2SavedTons: 0,
    };
  }

  // 1. Calculate monthly units consumed
  const monthlyUnits = Math.round(monthlyBill / ELECTRICITY_UNIT_PRICE);

  // 2. Daily units required
  const dailyUnitsRequired = monthlyUnits / 30;

  // 3. System size required (kW)
  // Formula: System Size (kW) = Daily Units / (Peak Sun Hours * Efficiency)
  let systemSizeKw = dailyUnitsRequired / (PEAK_SUN_HOURS_PER_DAY * SYSTEM_EFFICIENCY);
  
  // Round system size to 1 decimal place, minimum 3kW (standard residential starting size)
  systemSizeKw = Math.max(3, Math.round(systemSizeKw * 10) / 10);

  // 4. Panels required (580W each)
  // Formula: (System Size in Watts) / Panel Wattage
  const panelsRequired = Math.ceil((systemSizeKw * 1000) / PANEL_WATTAGE);

  // 5. Estimated Installation Cost
  const costPerKw = systemType === 'hybrid' ? COST_PER_KW_HYBRID : COST_PER_KW_ON_GRID;
  let estimatedCost = Math.round(systemSizeKw * costPerKw);
  
  // Add base fee for structure and net-metering setup (PKR 150,000 fixed approx)
  estimatedCost += 150000;

  // 6. Savings Calculations
  // Daily generation = kW * sun hours * efficiency
  const dailyGenerationUnits = systemSizeKw * PEAK_SUN_HOURS_PER_DAY * SYSTEM_EFFICIENCY;
  const monthlyGenerationUnits = dailyGenerationUnits * 30;

  // Save either what they generate or what they consume (whichever is lower)
  const offsetUnits = Math.min(monthlyUnits, monthlyGenerationUnits);
  const monthlySavings = Math.round(offsetUnits * ELECTRICITY_UNIT_PRICE);
  const yearlySavings = monthlySavings * 12;

  // 7. Payback period (ROI in years)
  const paybackYears = Math.round((estimatedCost / yearlySavings) * 10) / 10;

  // 8. Environmental Impact (approx 0.5 kg of CO2 offset per kWh produced)
  const yearlyGenerationUnits = monthlyGenerationUnits * 12;
  const co2SavedTons = Math.round(((yearlyGenerationUnits * 0.5) / 1000) * 10) / 10;

  return {
    monthlyUnits,
    systemSizeKw,
    panelsRequired,
    estimatedCost,
    monthlySavings,
    yearlySavings,
    paybackYears: isFinite(paybackYears) ? paybackYears : 0,
    co2SavedTons,
  };
};

/**
 * Get pre-designed solar packages based on common system sizes
 */
export const getSolarPackages = () => {
  return [
    {
      id: 'pkg-5kw',
      name: 'Eco-Smart 5kW System',
      tagline: 'Ideal for Small to Medium Homes',
      size: '5 kW',
      type: 'On-Grid / Net Metering Ready',
      panels: '9 x Tier-1 580W Mono PERC Panels',
      inverter: '5kW Smart Hybrid/On-Grid Inverter (IP65)',
      appliances: '1.5 Ton AC (1), Fridge (1), Fans (4-6), LED Bulbs (10-12)',
      estimatedCost: 'PKR 975,000',
      roi: '2.4 Years',
      icon: 'Sun',
      popular: false,
    },
    {
      id: 'pkg-10kw',
      name: 'Power-House 10kW System',
      tagline: 'Ideal for Double Story Homes',
      size: '10 kW',
      type: 'On-Grid / Hybrid Compatible',
      panels: '18 x Tier-1 580W Mono PERC Panels',
      inverter: '10kW High-Efficiency Inverter with Remote App tracking',
      appliances: '1.5 Ton ACs (2-3), Fridge/Deep Freezer (2), Water Pump (1), LED Bulbs & Fans (Full house)',
      estimatedCost: 'PKR 1,800,000',
      roi: '2.1 Years',
      icon: 'Zap',
      popular: true,
    },
    {
      id: 'pkg-15kw',
      name: 'Industrial/Commercial 15kW System',
      tagline: 'For Large Estates & Small Offices',
      size: '15 kW',
      type: 'On-Grid / Custom Battery Options',
      panels: '26 x Tier-1 580W Mono PERC Panels',
      inverter: '15kW Industrial Grade Three-Phase Inverter',
      appliances: '1.5 Ton ACs (4-5), Commercial Printers, Computers, Water Pumps, Full Building Load',
      estimatedCost: 'PKR 2,625,000',
      roi: '1.9 Years',
      icon: 'Shield',
      popular: false,
    },
  ];
};
