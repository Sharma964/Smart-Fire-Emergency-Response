import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  ShieldCheck, 
  X,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';

export default function EmergencyContactsPage() {
  const { activeAlert, addToast } = useAlert();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: 'Family',
    priority: 'High'
  });

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (e) {
      console.warn('Could not fetch contacts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.relationship) {
      addToast('Please fill in all contact fields', 'warning');
      return;
    }

    try {
      if (editContact) {
        const res = await fetch(`/api/contacts/${editContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          addToast(`✓ Contact "${formData.name}" updated successfully`, 'success');
        }
      } else {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          addToast(`✓ Contact "${formData.name}" added to emergency grid`, 'success');
        }
      }
      fetchContacts();
      setAddModalOpen(false);
      setEditContact(null);
      setFormData({ name: '', phone: '', relationship: 'Family', priority: 'High' });
    } catch (e) {
      addToast('Failed to save contact', 'error');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Contact removed from emergency list', 'info');
        fetchContacts();
      }
    } catch (e) {
      addToast('Failed to delete contact', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const openEdit = (c) => {
    setEditContact(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      relationship: c.relationship,
      priority: c.priority || 'High'
    });
    setAddModalOpen(true);
  };

  const handleSimulatedCall = (contact) => {
    addToast(`📞 Dialing ${contact.name} (${contact.phone})... Connecting directly.`, 'info', 4000);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Emergency Contacts
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Designated individuals and campus safety personnel notified instantly when SOS triggers.
            </p>
          </div>

          <button
            onClick={() => {
              setEditContact(null);
              setFormData({ name: '', phone: '', relationship: 'Family', priority: 'High' });
              setAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <UserPlus className="w-4 h-4" />
            + Add Contact
          </button>
        </div>

        {/* SOS Alert Active Banner if applicable */}
        {activeAlert && activeAlert.status !== 'RESOLVED' && (
          <div className="bg-red-900/60 border border-red-500 p-4 rounded-2xl flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-300 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-white">EMERGENCY SOS ACTIVE:</span> All contacts below have been sent high-priority SMS alerts and push pings.
              </div>
            </div>
            <span className="text-[11px] font-mono bg-red-800 text-white px-2.5 py-1 rounded font-bold uppercase">
              NOTIFIED
            </span>
          </div>
        )}

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contacts.map((contact) => {
            const isEmergencyPriority = contact.priority === 'Emergency' || contact.relationship.includes('Security') || contact.relationship.includes('Doctor');
            return (
              <div
                key={contact.id}
                className={`glass-panel p-5 rounded-2xl border transition-all hover:border-slate-700 flex flex-col justify-between ${
                  isEmergencyPriority ? 'border-red-500/30 bg-red-950/20' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${
                        isEmergencyPriority
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {contact.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {contact.relationship}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      contact.priority === 'Emergency'
                        ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {contact.priority || 'High'}
                    </span>
                  </div>

                  <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300">{contact.phone}</span>
                    <a
                      href={`tel:${contact.phone}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSimulatedCall(contact);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">SOS Transmission:</span>
                    {activeAlert && activeAlert.status !== 'RESOLVED' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Notified & Delivered
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Linked & Armed
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(contact)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(contact.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                {editContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Deshmukh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98221 12233"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="Father, Mother, Friend..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Alert Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
                >
                  {editContact ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Delete Emergency Contact?</h4>
            <p className="text-xs text-slate-400 mt-1">
              This contact will no longer receive emergency notifications during SOS alerts.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteContact(deleteConfirmId)}
                className="py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
