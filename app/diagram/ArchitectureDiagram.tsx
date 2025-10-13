'use client';

import React, { useState } from 'react';
import { Database, Cloud, Shield, Activity, FileText, Workflow, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ArchitectureDiagram = () => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const router = useRouter();

  const sections = {
    frontend: {
      title: "Frontend Application",
      description: "React/Next.js Dashboard",
      features: ["Storage Management", "Server Monitoring", "Database Overview", "Network Configuration"],
      color: "from-blue-500 to-blue-600"
    },
    postman: {
      title: "Postman Platform",
      description: "API Development & Testing Hub",
      features: ["Collections", "Mock Servers", "Flows", "Monitors", "Tests & Docs"],
      color: "from-orange-500 to-orange-600"
    },
    aws: {
      title: "AWS Services",
      description: "Cloud Infrastructure",
      features: ["S3 Buckets", "RDS Databases", "EC2 Instances", "Networking"],
      color: "from-yellow-500 to-yellow-600"
    },
    agent: {
      title: "Agent Mode",
      description: "AI-Powered Development",
      features: ["Generate Tests", "Create Specs", "Update Mocks", "Set Up Monitors", "Discover APIs"],
      color: "from-purple-500 to-purple-600"
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden px-8 py-4">
      {/* Title Header with Back Button */}
      <div className="relative text-center pb-4">
        <button
          onClick={() => router.push('/')}
          className="absolute left-0 top-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-1">Cloud Infrastructure Architectural Diagram</h1>
        <p className="text-slate-400 text-base">Built with Postman Agent Mode</p>
      </div>

      {/* Main Architecture Container - Centered */}
      <div className="max-w-7xl mx-auto h-[calc(100%-80px)] flex flex-col">
        {/* Agent Mode Overlay Banner */}
        <div className="mb-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Agent Mode</h2>
              <p className="text-purple-200">AI Assistant orchestrating the entire platform with natural language</p>
            </div>
            <div className="text-right">
              <div className="text-purple-300 text-sm mb-1">Capabilities:</div>
              <div className="flex gap-2 flex-wrap justify-end">
                {sections.agent.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-500/30 rounded text-xs text-purple-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Three Main Sections */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          {/* Frontend */}
          <div
            className={`bg-slate-800 rounded-xl border-2 ${hoveredSection === 'frontend' ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-slate-700'} transition-all duration-300 p-4`}
            onMouseEnter={() => setHoveredSection('frontend')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className={`bg-gradient-to-br ${sections.frontend.color} p-4 rounded-lg mb-4`}>
              <Cloud className="w-12 h-12 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">{sections.frontend.title}</h3>
            <p className="text-slate-400 text-sm text-center mb-4">{sections.frontend.description}</p>
            <div className="space-y-2">
              {sections.frontend.features.map((feature, idx) => (
                <div key={idx} className="bg-slate-700/50 px-3 py-2 rounded text-sm text-slate-300">
                  • {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Postman Platform */}
          <div
            className={`bg-slate-800 rounded-xl border-2 ${hoveredSection === 'postman' ? 'border-orange-500 shadow-lg shadow-orange-500/50' : 'border-slate-700'} transition-all duration-300 p-4`}
            onMouseEnter={() => setHoveredSection('postman')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className={`bg-gradient-to-br ${sections.postman.color} p-4 rounded-lg mb-4`}>
              <Workflow className="w-12 h-12 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">{sections.postman.title}</h3>
            <p className="text-slate-400 text-sm text-center mb-4">{sections.postman.description}</p>
            <div className="space-y-2">
              {sections.postman.features.map((feature, idx) => (
                <div key={idx} className="bg-slate-700/50 px-3 py-2 rounded text-sm text-slate-300">
                  • {feature}
                </div>
              ))}
            </div>
          </div>

          {/* AWS Backend */}
          <div
            className={`bg-slate-800 rounded-xl border-2 ${hoveredSection === 'aws' ? 'border-yellow-500 shadow-lg shadow-yellow-500/50' : 'border-slate-700'} transition-all duration-300 p-4`}
            onMouseEnter={() => setHoveredSection('aws')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className={`bg-gradient-to-br ${sections.aws.color} p-4 rounded-lg mb-4`}>
              <Database className="w-12 h-12 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">{sections.aws.title}</h3>
            <p className="text-slate-400 text-sm text-center mb-4">{sections.aws.description}</p>
            <div className="space-y-2">
              {sections.aws.features.map((feature, idx) => (
                <div key={idx} className="bg-slate-700/50 px-3 py-2 rounded text-sm text-slate-300">
                  • {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow Arrows */}
        <div className="relative mb-3">
          <div className="flex justify-between items-center">
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-orange-500"></div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">→</span>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex-1 text-center">
              <h2 className="text-base font-semibold text-blue-400">API Requests</h2>
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-base font-semibold text-yellow-400">AWS API Calls</h2>
            </div>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 cursor-pointer">
            <Shield className="w-8 h-8 text-green-400 mb-2" />
            <h4 className="text-white font-semibold mb-1">Secure</h4>
            <p className="text-slate-400 text-xs">Credentials isolated in Flows</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300 cursor-pointer">
            <Activity className="w-8 h-8 text-blue-400 mb-2" />
            <h4 className="text-white font-semibold mb-1">Mock First</h4>
            <p className="text-slate-400 text-xs">Build frontend independently</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/50 transition-all duration-300 cursor-pointer">
            <FileText className="w-8 h-8 text-purple-400 mb-2" />
            <h4 className="text-white font-semibold mb-1">Auto-Docs</h4>
            <p className="text-slate-400 text-xs">Tests & specs generated</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-400/50 transition-all duration-300 cursor-pointer">
            <Activity className="w-8 h-8 text-orange-400 mb-2" />
            <h4 className="text-white font-semibold mb-1">Monitored</h4>
            <p className="text-slate-400 text-xs">Continuous health checks</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-400/50 transition-all duration-300 cursor-pointer">
            <Sparkles className="w-8 h-8 text-pink-400 mb-2" />
            <h4 className="text-white font-semibold mb-1">AI-Powered</h4>
            <p className="text-slate-400 text-xs">Natural language setup</p>
          </div>
        </div>

        {/* The 5 Challenges Solved */}
        <div className="bg-slate-800 rounded-xl border-2 border-green-500/50 p-4 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 cursor-pointer">
          <h3 className="text-xl font-bold text-white mb-3 text-center">5 Developer Challenges Solved</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { title: "Discovery", desc: "Find the right APIs", icon: "🔍" },
              { title: "Contract", desc: "Frontend/backend sync", icon: "🤝" },
              { title: "Security", desc: "Safe credential handling", icon: "🔒" },
              { title: "Reliability", desc: "Testing & monitoring", icon: "✅" },
              { title: "Documentation", desc: "Up-to-date docs", icon: "📚" }
            ].map((challenge, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-2">{challenge.icon}</div>
                <h4 className="text-white font-semibold mb-1">{challenge.title}</h4>
                <p className="text-slate-400 text-xs">{challenge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;