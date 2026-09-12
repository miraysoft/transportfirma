import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAdmin } from '../../contexts/AdminContext';
import {
  Search, ChevronLeft, ChevronRight, MessageSquare,
  Trash2, StickyNote, Send, X, Filter
} from 'lucide-react';
import { toast } from 'sonner';

const statusLabels = { new: 'Yeni', reviewed: 'Incelendi', contacted: 'Iletisime Gecildi' };
const statusColors = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  reviewed: 'bg-amber-100 text-amber-700 border-amber-200',
  contacted: 'bg-green-100 text-green-700 border-green-200'
};

const AdminInquiries = () => {
  const { apiCall } = useAdmin();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    let url = `/admin/inquiries?page=${page}&limit=15`;
    if (statusFilter) url += `&status_filter=${statusFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const result = await apiCall('GET', url);
    if (result.success) {
      setInquiries(result.data.inquiries);
      setTotalPages(result.data.pages);
      setTotal(result.data.total);
    }
    setLoading(false);
  }, [apiCall, page, statusFilter, search]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const handleStatusChange = async (id, newStatus) => {
    const result = await apiCall('PATCH', `/admin/inquiries/${id}/status`, { status: newStatus });
    if (result.success) {
      toast.success('Durum guncellendi');
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu mesaji silmek istediginize emin misiniz?')) return;
    const result = await apiCall('DELETE', `/admin/inquiries/${id}`);
    if (result.success) {
      toast.success('Mesaj silindi');
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      fetchInquiries();
    } else {
      toast.error(result.message);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedInquiry) return;
    setNoteLoading(true);
    const result = await apiCall('POST', `/admin/inquiries/${selectedInquiry.id}/notes`, { note: noteText.trim() });
    if (result.success) {
      toast.success('Not eklendi');
      setNoteText('');
      fetchInquiries();
      // Update selected inquiry notes
      setSelectedInquiry(prev => ({
        ...prev,
        notes: [result.data.note, ...(prev.notes || [])]
      }));
    } else {
      toast.error(result.message);
    }
    setNoteLoading(false);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateStr; }
  };

  return (
    <div data-testid="admin-inquiries" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
          <p className="text-sm text-gray-500">{total} mesaj toplam</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            data-testid="inquiries-search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ara... (isim, e-posta, mesaj)"
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setStatusFilter(''); setPage(1); }}
            className={statusFilter === '' ? 'bg-gray-900 text-white' : ''}
          >
            <Filter className="h-4 w-4 mr-1" /> Tumu
          </Button>
          {Object.entries(statusLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setStatusFilter(key); setPage(1); }}
              className={statusFilter === key ? 'bg-gray-900 text-white' : ''}
              data-testid={`filter-${key}`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Inquiry List */}
        <div className="flex-1 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
            <Card className="bg-white border border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Mesaj bulunamadi</p>
              </CardContent>
            </Card>
          ) : (
            inquiries.map((inquiry) => (
              <Card
                key={inquiry.id}
                data-testid={`inquiry-card-${inquiry.id}`}
                className={`bg-white border cursor-pointer transition-all hover:shadow-md ${
                  selectedInquiry?.id === inquiry.id ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200'
                }`}
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{inquiry.name}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[inquiry.status]}`}>
                          {statusLabels[inquiry.status]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{inquiry.email}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{inquiry.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {inquiry.service && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">{inquiry.service}</span>
                        )}
                        <span className="text-xs text-gray-400">{formatDate(inquiry.created_at)}</span>
                        {inquiry.notes?.length > 0 && (
                          <span className="text-xs text-amber-600 flex items-center gap-1">
                            <StickyNote className="h-3 w-3" /> {inquiry.notes.length} not
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <select
                        data-testid={`status-select-${inquiry.id}`}
                        value={inquiry.status}
                        onChange={(e) => { e.stopPropagation(); handleStatusChange(inquiry.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="new">Yeni</option>
                        <option value="reviewed">Incelendi</option>
                        <option value="contacted">Iletisime Gecildi</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleDelete(inquiry.id); }}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-7 px-2"
                        data-testid={`delete-inquiry-${inquiry.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 px-3">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedInquiry && (
          <Card className="lg:w-96 bg-white border border-gray-200 self-start lg:sticky lg:top-4">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Mesaj Detayi</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedInquiry(null)} className="p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Gonderen</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">E-Posta</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-sm text-red-600 hover:underline">{selectedInquiry.email}</a>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Telefon</p>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-sm text-red-600 hover:underline">{selectedInquiry.phone}</a>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Firma</p>
                    <p className="text-sm text-gray-700">{selectedInquiry.company}</p>
                  </div>
                )}
                {selectedInquiry.service && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Hizmet</p>
                    <p className="text-sm text-gray-700 capitalize">{selectedInquiry.service}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Mesaj</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Tarih</p>
                  <p className="text-sm text-gray-700">{formatDate(selectedInquiry.created_at)}</p>
                </div>

                {/* Notes */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Notlar</p>
                  {(selectedInquiry.notes || []).length > 0 ? (
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {selectedInquiry.notes.map((note) => (
                        <div key={note.id} className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                          <p className="text-sm text-gray-700">{note.note}</p>
                          <p className="text-xs text-gray-400 mt-1">{note.admin_username} - {formatDate(note.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mb-3">Henuz not eklenmemis</p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      data-testid="note-input"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Not ekle..."
                      className="text-sm h-9"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <Button
                      data-testid="add-note-btn"
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!noteText.trim() || noteLoading}
                      className="bg-red-600 hover:bg-red-700 text-white h-9 px-3"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch { return dateStr; }
};

export default AdminInquiries;
