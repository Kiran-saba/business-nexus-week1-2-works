 import React, { useState } from 'react';
import { Search } from 'lucide-react';
// @ts-ignore
import MeetingCalendar from '../../components/meetingCalendar';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { entrepreneurs } from '../../data/users';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);

  // ✅ Industries
  const allIndustries = Array.from(
    new Set(entrepreneurs.map((e) => e.industry))
  );

  // ✅ Funding Ranges
  const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];

  // ✅ Filter Logic (IMPROVED)
  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    // 🔍 Search
    const matchesSearch =
      searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());

    // 🏭 Industry
    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);

    // 💰 Funding (FIXED PROPERLY)
    const amountStr = entrepreneur.fundingNeeded;

    let amount = 0;

    if (amountStr.includes('M')) {
      amount = parseFloat(amountStr.replace(/[^0-9.]/g, '')) * 1000;
    } else if (amountStr.includes('K')) {
      amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    }

    const matchesFunding =
      selectedFundingRange.length === 0 ||
      selectedFundingRange.some((range) => {
        switch (range) {
          case '< $500K':
            return amount < 500;
          case '$500K - $1M':
            return amount >= 500 && amount <= 1000;
          case '$1M - $5M':
            return amount > 1000 && amount <= 5000;
          case '> $5M':
            return amount > 5000;
          default:
            return true;
        }
      });

    return matchesSearch && matchesIndustry && matchesFunding;
  });

  // 🔘 Toggle Industry
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  // 🔘 Toggle Funding
  const toggleFundingRange = (range: string) => {
    setSelectedFundingRange((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in p-4">
      
      {/* 🔥 TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Startups</h1>
        <p className="text-gray-600">
          Discover promising startups looking for investment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 🧩 SIDEBAR */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            </CardHeader>

            <CardBody className="space-y-6">

              {/* Industry */}
              <div>
                <h3 className="text-sm font-medium mb-2">Industry</h3>
                {allIndustries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleIndustry(industry)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedIndustries.includes(industry)
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>

              {/* Funding */}
              <div>
                <h3 className="text-sm font-medium mb-2">Funding Range</h3>
                {fundingRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => toggleFundingRange(range)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedFundingRange.includes(range)
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

            </CardBody>
          </Card>
        </div>

        {/* 📊 MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          {/* 🔍 Search */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} />}
              fullWidth
            />
            <span className="text-sm text-gray-600">
              {filteredEntrepreneurs.length} results
            </span>
          </div>

          {/* 🧾 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntrepreneurs.length > 0 ? (
              filteredEntrepreneurs.map((entrepreneur) => (
                <EntrepreneurCard
                  key={entrepreneur.id}
                  entrepreneur={entrepreneur}
                />
              ))
            ) : (
              <p className="text-gray-500">No startups found 😢</p>
            )}
          </div>

          {/* 📅 MILESTONE 2 (IMPORTANT) */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              📅 My Business Meetings (Milestone 2)
            </h2>
         <div className="mt-8">
             <MeetingCalendar/>
          </div> 
            {/* DEBUG TEXT */}
            <p className="text-sm text-gray-500 mb-4">
              If you can see this, calendar section is working ✅
            </p>

            {/* CALENDAR */}
            <MeetingCalendar />
          </div>

        </div>
      </div>
    </div>
  );
};