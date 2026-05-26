import Link from 'next/link';

import { getAdminInquiries } from '@/server/admin/inquiries';

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <main style={{ display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ margin: 0 }}>Inquiries</h1>
        <p style={{ margin: '8px 0 0', color: '#677489' }}>RFQ submissions from the storefront now flow into a real review queue.</p>
      </div>
      {!inquiries.length ? (
        <article className="info-card">
          <h2>No inquiries yet</h2>
          <p className="section-description">Inquiry-mode products will create records here after submission from the storefront.</p>
        </article>
      ) : (
        <div className="info-grid">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="info-card" style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{inquiry.productName}</h2>
                <span className="product-badge">{inquiry.status}</span>
              </div>
              <p style={{ margin: 0, color: '#677489' }}>{inquiry.fullName} · {inquiry.email}</p>
              <p style={{ margin: 0, color: '#677489' }}>{inquiry.company ?? 'No company'} · {inquiry.country ?? 'No country'}</p>
              <p style={{ margin: 0, color: '#677489' }}>Submitted {new Date(inquiry.createdAt).toLocaleString()}</p>
              <Link href={`/admin/inquiries/${inquiry.id}`}>Open inquiry detail</Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
