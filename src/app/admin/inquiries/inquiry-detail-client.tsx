'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

type InquiryDetail = {
  id: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  message: string;
  sourcePageUrl: string | null;
  internalNote: string | null;
  createdAt: string;
  handledAt: string | null;
  productName: string;
  productSlug: string;
  productSku: string;
  handledByEmail: string | null;
};

export function InquiryDetailClient({ initialInquiry }: { initialInquiry: InquiryDetail }) {
  const [inquiry, setInquiry] = useState(initialInquiry);
  const [status, setStatus] = useState(initialInquiry.status);
  const [internalNote, setInternalNote] = useState(initialInquiry.internalNote ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNote }),
      });

      if (!response.ok) {
        setMessage('Unable to update inquiry state.');
        return;
      }

      const nextInquiry = (await response.json()) as InquiryDetail;
      setInquiry(nextInquiry);
      setStatus(nextInquiry.status);
      setInternalNote(nextInquiry.internalNote ?? '');
      setMessage('Inquiry updated.');
    });
  }

  return (
    <main style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Inquiry Review</h1>
          <p style={{ margin: '8px 0 0', color: '#677489' }}>{inquiry.fullName} · {inquiry.email}</p>
        </div>
        <Link href="/admin/inquiries">Back to Inquiries</Link>
      </div>
      <div className="info-grid">
        <article className="info-card">
          <h2 style={{ marginTop: 0 }}>Customer Context</h2>
          <p>Company: {inquiry.company ?? 'Not provided'}</p>
          <p>Phone: {inquiry.phone ?? 'Not provided'}</p>
          <p>Country: {inquiry.country ?? 'Not provided'}</p>
          <p>Submitted: {new Date(inquiry.createdAt).toLocaleString()}</p>
          <p>Handled At: {inquiry.handledAt ? new Date(inquiry.handledAt).toLocaleString() : 'Not handled yet'}</p>
          <p>Handled By: {inquiry.handledByEmail ?? 'Unassigned'}</p>
        </article>
        <article className="info-card">
          <h2 style={{ marginTop: 0 }}>Product Context</h2>
          <p>{inquiry.productName}</p>
          <p>{inquiry.productSku}</p>
          <Link href={`/products/${inquiry.productSlug}`} className="nav-link">Open storefront product</Link>
          {inquiry.sourcePageUrl ? <p style={{ wordBreak: 'break-all' }}>Source: {inquiry.sourcePageUrl}</p> : null}
        </article>
      </div>
      <article className="info-card">
        <h2 style={{ marginTop: 0 }}>Customer Message</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.message}</p>
      </article>
      <article className="info-card" style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>Workflow Update</h2>
        <label style={{ display: 'grid', gap: 8 }}>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as InquiryDetail['status'])} style={{ minHeight: 44, borderRadius: 12, border: '1px solid var(--color-border)', padding: '0 12px' }}>
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="quoted">quoted</option>
            <option value="closed">closed</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: 8 }}>
          <span>Internal Note</span>
          <textarea rows={6} value={internalNote} onChange={(event) => setInternalNote(event.target.value)} style={{ borderRadius: 16, border: '1px solid var(--color-border)', padding: 14, font: 'inherit' }} />
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="button-primary" disabled={isPending} onClick={save}>{isPending ? 'Saving...' : 'Save Update'}</button>
        </div>
        {message ? <p style={{ margin: 0, color: '#677489' }}>{message}</p> : null}
      </article>
    </main>
  );
}
