export default function AdminLoadingSkeleton() {
  return (
    <div className="admin-loading p-3 border rounded">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading admin panel...</span>
      </div>
      <p className="mt-2">Loading admin features...</p>
    </div>
  );
}

