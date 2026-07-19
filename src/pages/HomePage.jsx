import React from 'react';
import Hero from '../components/home/Hero';
import ValueChain from '../components/home/ValueChain';
import LongiTechHighlight from '../components/home/LongiTechHighlight';
import Solutions from '../components/home/Solutions';
import NewsFeed from '../components/home/NewsFeed';
import ESG from '../components/home/ESG';

const HomePage = ({ onViewChange }) => {
  return (
    <>
      {/* Premium Hero section with navigation triggers */}
      <Hero onViewChange={onViewChange} />

      {/* Vertically Integrated Solar PV Value Chain */}
      <ValueChain />

      {/* Corporate Tech & Innovation showcase */}
      <LongiTechHighlight />

      {/* Trison PV Solutions */}
      <Solutions />

      {/* Trending News & Events */}
      <NewsFeed />

      {/* Environmental, Social & Governance (ESG) */}
      <ESG />
    </>
  );
};

export default HomePage;
