import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  Plus, Search, Loader2, Linkedin, UserCircle, MessageSquare,
  Copy, CheckCircle, ChevronLeft, ChevronRight, MapPin, Globe,
  Phone, Mail, RefreshCw, Sparkles, Building2, RotateCcw, Zap
} from 'lucide-react';

const STATUS_CONFIG = {
  prospect: { label: 'Prospect', color: 'bg-blue-100 text-blue-700' },
  New: { label: 'New', color: 'bg-indigo-100 text-indigo-700' },
  Contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  Qualified: { label: 'Qualified', color: 'bg-green-100 text-green-700' },
  meeting: { label: 'Meeting', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600' },
  Lost: { label: 'Lost', color: 'bg-red-100 text-red-600' },
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapsQuery, setMapsQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState({});
  const [leadContacts, setLeadContacts] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [sendLoading, setSendLoading] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState({});
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', status: 'New' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLead, setExpandedLead] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => { fetchLeads(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, leads]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/linkedin`);
      if (response.ok) {
        const data = await response.json();
        const grouped = data.reduce((acc, contact) => {
          if (!acc[contact.lead_id]) acc[contact.lead_id] = [];
          acc[contact.lead_id].push(contact);
          return acc;
        }, {});
        setLeadContacts(grouped);
        const statuses = {};
        data.forEach(c => { statuses[c.lead_id] = 'done'; });
        setDiscoveryStatus(prev => ({ ...prev, ...statuses }));
      }
    } catch (error) { console.error('Failed to fetch contacts:', error); }
  };

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/leads`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
        await fetchContacts();
      }
    } catch (error) { console.error('Failed to fetch leads:', error); }
    finally { setIsLoading(false); }
  };

  const handleDiscovery = async (leadId) => {
    try {
      setDiscoveryStatus({ ...discoveryStatus, [leadId]: 'loading' });
      const response = await fetch(`${API_BASE_URL}/api/linkedin/find`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      if (response.ok) {
        const data = await response.json();
        setLeadContacts({ ...leadContacts, [leadId]: data.contacts });
        setDiscoveryStatus({ ...discoveryStatus, [leadId]: 'done' });
        setExpandedLead(leadId);
      }
    } catch (error) {
      setDiscoveryStatus({ ...discoveryStatus, [leadId]: null });
    }
  };

  const handleGenerateAiMessage = async (contact) => {
    try {
      setAiLoading({ ...aiLoading, [contact.id]: true });
      setActiveContact(contact);
      const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setActiveMessage({ contactId: contact.id, contactName: contact.name, text: data.data.message_text, messageId: data.data.id });
        setRegenerateCount(0);
        setShowAiModal(true);
      }
    } catch (error) { console.error('AI Generation failed:', error); }
    finally { setAiLoading({ ...aiLoading, [contact.id]: false }); }
  };

  const handleRegenerate = async () => {
    if (!activeContact) return;
    try {
      setIsRegenerating(true);
      setActiveMessage(prev => ({ ...prev, text: null }));
      const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: activeContact.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setActiveMessage(prev => ({ ...prev, text: data.data.message_text, messageId: data.data.id }));
        setRegenerateCount(c => c + 1);
        setCopied(false);
      }
    } catch (error) { console.error('Regenerate failed:', error); }
    finally { setIsRegenerating(false); }
  };

  const handleSendOutreach = async () => {
    if (!activeMessage) return;
    try {
      setSendLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/outreach/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: activeMessage.contactId, messageId: activeMessage.messageId }),
      });
      if (response.ok) { alert('Outreach sent successfully!'); setShowAiModal(false); }
    } catch (error) { console.error(error); }
    finally { setSendLoading(false); }
  };

  const handleMapsSearch = async () => {
    if (!mapsQuery) return;
    try {
      setIsSearching(true);
      const response = await fetch(`${API_BASE_URL}/api/leads/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mapsQuery, limit: 200 }),
      });
      if (response.ok) { await fetchLeads(); setMapsQuery(''); }
    } catch (error) { alert('Failed to connect to backend for search.'); }
    finally { setIsSearching(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (error) { console.error(error); }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newLead = await response.json();
        setLeads([newLead, ...leads]);
        setIsModalOpen(false);
        setFormData({ name: '', company: '', email: '', status: 'New' });
      }
    } catch (error) { console.error(error); }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-400 mt-0.5 text-sm">AI-powered B2B lead discovery and outreach</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* AI Search Bar */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand/10 via-indigo-500/10 to-purple-500/10 border border-brand/15 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-bold text-gray-900">AI Lead Discovery</h3>
            </div>
            <p className="text-xs text-gray-500">Type any business type + city. Our AI finds 200 companies with CEO contacts automatically.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. IT companies in Delhi, Gyms in Mumbai..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-white/80 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 shadow-sm"
                value={mapsQuery}
                onChange={(e) => setMapsQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMapsSearch()}
              />
            </div>
            <Button onClick={handleMapsSearch} disabled={isSearching} className="whitespace-nowrap flex items-center gap-2 shadow-sm px-5">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isSearching ? 'Finding...' : 'Find 200 Leads'}
            </Button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            {filteredLeads.length > 0 && <span>{filteredLeads.length} leads found</span>}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Business</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Contact Info</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">CEO / Founder</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">LinkedIn</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">CEO Email</th>
                <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand mb-2" />
                    <p className="text-gray-400 text-sm">Finding leads and enriching with AI...</p>
                  </td>
                </tr>
              ) : currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Building2 className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-500 font-semibold mb-1">No leads yet</p>
                    <p className="text-gray-400 text-sm">Use the AI search above to find hundreds of businesses instantly.</p>
                  </td>
                </tr>
              ) : currentLeads.map((lead) => {
                const ceo = leadContacts[lead.id]?.[0];
                const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG['prospect'];
                const isExpanded = expandedLead === lead.id;

                return (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-gray-50/70 transition-colors group">
                      {/* Business Name */}
                      <td className="px-5 py-5 min-w-[220px] max-w-[250px]">
                        <p className="font-bold text-gray-900 text-sm leading-tight mb-1">{lead.name}</p>
                        {lead.address && (
                          <div className="flex items-start gap-1 text-[10px] text-gray-400 leading-relaxed">
                            <MapPin className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{lead.address}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="px-4 py-5 min-w-[180px]">
                        <div className="flex flex-col gap-1.5">
                          {lead.website && (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-brand hover:underline font-semibold w-fit">
                              <Globe className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate max-w-[140px]">{lead.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
                            </a>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                              <Phone className="w-3 h-3 text-gray-300" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CEO Name */}
                      <td className="px-4 py-5 min-w-[150px]">
                        {ceo ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm">
                              {ceo.name?.charAt(0) || 'C'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-none truncate">{ceo.name}</p>
                              <p className="text-[10px] text-gray-400 mt-1 font-medium">{ceo.role}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-300 italic">Finding CEO...</span>
                        )}
                      </td>

                      {/* LinkedIn */}
                      <td className="px-4 py-5">
                        {ceo?.linkedin_url ? (
                          <a href={ceo.linkedin_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#0077b5] text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-[#006097] transition-all shadow-sm active:scale-95">
                            <Linkedin className="w-3 h-3" /> Profile
                          </a>
                        ) : <span className="text-gray-200 text-xs">—</span>}
                      </td>

                      {/* CEO Email */}
                      <td className="px-4 py-5 min-w-[160px]">
                        {ceo?.email ? (
                          <a
                            href={`mailto:${ceo.email}`}
                            className="inline-flex items-center gap-1.5 bg-brand/5 hover:bg-brand/10 transition-colors px-2.5 py-2 rounded-lg group max-w-full"
                          >
                            <Mail className="w-3 h-3 text-brand flex-shrink-0" />
                            <span className="text-[10px] font-bold text-brand truncate max-w-[120px]">{ceo.email}</span>
                          </a>
                        ) : <span className="text-gray-200 text-xs">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-5">
                        <select
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-full border-0 ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-brand/20 cursor-pointer shadow-sm ${statusCfg.color}`}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        >
                          <option value="prospect">Prospect</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="meeting">Meeting</option>
                          <option value="closed">Closed</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDiscovery(lead.id)}
                            disabled={discoveryStatus[lead.id] === 'loading'}
                            className={`p-2 rounded-lg border transition-all ${
                              discoveryStatus[lead.id] === 'done' 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                            } ${discoveryStatus[lead.id] === 'loading' ? 'opacity-50' : ''}`}
                            title="Find CEO"
                          >
                            {discoveryStatus[lead.id] === 'loading' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                            className={`p-2 rounded-lg border transition-all ${
                              isExpanded 
                                ? 'bg-brand border-brand text-white shadow-brand/20 shadow-lg' 
                                : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                            }`}
                            title="Outreach"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Contacts Row */}
                    {isExpanded && leadContacts[lead.id]?.length > 0 && (
                      <tr className="bg-gradient-to-r from-brand/3 to-indigo-50/50">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-3">
                            <UserCircle className="w-4 h-4 text-brand" />
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Decision Makers Found</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {leadContacts[lead.id].map(contact => (
                              <div key={contact.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {contact.name?.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">{contact.name}</p>
                                    <p className="text-[10px] text-gray-400">{contact.role}</p>
                                    {contact.email && (
                                      <span className="text-[10px] text-brand font-medium truncate block">{contact.email}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {contact.linkedin_url && (
                                    <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                      <Linkedin className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleGenerateAiMessage(contact)}
                                    disabled={aiLoading[contact.id]}
                                    className="p-1.5 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
                                  >
                                    {aiLoading[contact.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLeads.length > itemsPerPage && (
          <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-xs text-gray-400 font-medium">
              Showing <span className="text-gray-900 font-bold">{indexOfFirstItem + 1}</span> – <span className="text-gray-900 font-bold">{Math.min(indexOfLastItem, filteredLeads.length)}</span> of <span className="text-gray-900 font-bold">{filteredLeads.length}</span> leads
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                className={`p-1.5 rounded-lg transition-colors ${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[30px] h-8 text-xs font-bold rounded-lg transition-all ${currentPage === i + 1 ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg transition-colors ${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Message Modal */}
      <Modal isOpen={showAiModal} onClose={() => setShowAiModal(false)} title={`✉️ AI Outreach — ${activeMessage?.contactName}`}>
        <div className="space-y-4">

          {/* Regenerate badge */}
          {regenerateCount > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-3 py-1 w-fit">
              <Zap className="w-3 h-3" />
              Regenerated {regenerateCount}×
            </div>
          )}

          {/* Message box */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative min-h-[100px]">
            {isRegenerating ? (
              <div className="space-y-2.5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded-full w-4/5" />
                <div className="h-3 bg-gray-200 rounded-full w-full" />
                <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI is writing a new variation...
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pr-8">{activeMessage?.text}</p>
                <button
                  onClick={() => copyToClipboard(activeMessage?.text)}
                  className="absolute top-2 right-2 p-2 bg-white shadow-sm border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Left: Regenerate */}
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating || sendLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-purple-600 border border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50 px-3.5 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Try Another Version'}
            </button>

            {/* Right: Cancel + Send */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAiModal(false)} disabled={isRegenerating}>Cancel</Button>
              <Button
                onClick={handleSendOutreach}
                disabled={sendLoading || isRegenerating || !activeMessage?.text}
                className="flex items-center gap-2"
              >
                {sendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                {sendLoading ? 'Sending...' : 'Send Outreach'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Lead Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Lead">
        <form className="space-y-4" onSubmit={handleAddLead}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="John Doe" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Company</label>
              <input type="text" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="Acme Inc." value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Status</label>
            <select className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
              value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
