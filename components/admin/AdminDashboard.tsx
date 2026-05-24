  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const res = await fetch('/api/submissions')
        const data = await res.json()
        const rows = data.submissions || []
        const normalized = rows.map((r: any) => ({
          ...r,
          qrText: r.qr_text ?? r.qrText,
          qrDataUrl: r.qr_data_url ?? r.qrDataUrl,
          checkedIn: typeof r.checked_in !== 'undefined' ? r.checked_in : r.checkedIn,
          checkInAt: r.check_in_at ?? r.checkInAt,
          createdAt: r.created_at ?? r.createdAt,
          updatedAt: r.updated_at ?? r.updatedAt,
          itemId: r.item_id ?? r.itemId,
        }))
        setSubmissions(normalized)
      } catch {
        setSubmissions([])
      }
    }
    
    loadSubmissions()
    
    // Auto-refresh submissions every 10 seconds
    const interval = setInterval(loadSubmissions, 10000)
    
    return () => clearInterval(interval)
  }, [])
