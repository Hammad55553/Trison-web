-- Create Database (If creating locally; on Hostinger you will create it via hPanel)
-- CREATE DATABASE IF NOT EXISTS trison_db;
-- USE trison_db;

-- 1. Panels Registry Table (7 parameters + extra details)
CREATE TABLE IF NOT EXISTS panels (
  serial VARCHAR(100) PRIMARY KEY,
  brand VARCHAR(100) DEFAULT 'Trison',
  model VARCHAR(100) NOT NULL,
  wattage VARCHAR(50) NOT NULL,
  technology VARCHAR(100) DEFAULT 'Bifacial Mono PERC',
  class VARCHAR(10) DEFAULT 'A',
  country VARCHAR(100) DEFAULT 'Pakistan',
  customer_name VARCHAR(255) DEFAULT '',
  warranty_years VARCHAR(50) DEFAULT '25',
  status VARCHAR(50) DEFAULT 'active',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Contact Inquiries & Sales Leads Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  subject VARCHAR(255) DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Panels for Testing
INSERT INTO panels (serial, brand, model, wattage, technology, class, country, customer_name, warranty_years, status)
('TSCN-2607-731358458', 'Trison', 'TS-Premium-580M', '580W', 'Bifacial Mono PERC', 'A', 'Pakistan', 'Hammad Aslam', '25', 'active'),
('TRIPI4874289326', 'Trison', 'TS-Premium-580M', '580W', 'Bifacial Mono PERC', 'A', 'Pakistan', 'M. Tariq', '25', 'active')
ON DUPLICATE KEY UPDATE serial=serial;
