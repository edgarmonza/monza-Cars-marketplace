"use client"
import { useState, useEffect, useCallback } from 'react'

interface AuctionFilters {
  platform?: string;
  make?: string;
  model?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}

export function useAuctions(initialFilters?: AuctionFilters) {
  const [auctions, setAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AuctionFilters>(initialFilters || {})
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null)

  const fetchAuctions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value))
        }
      })
      const res = await fetch(`/api/auctions?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setAuctions(data.data)
        setMeta(data.meta)
      } else {
        setError(data.error || 'Failed to fetch auctions')
      }
    } catch (err) {
      setError('Failed to fetch auctions')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchAuctions() }, [fetchAuctions])

  const updateFilters = (newFilters: Partial<AuctionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const nextPage = () => {
    if (meta && meta.page < meta.totalPages) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))
    }
  }

  const prevPage = () => {
    if (meta && meta.page > 1) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))
    }
  }

  return { auctions, loading, error, filters, meta, updateFilters, nextPage, prevPage, refetch: fetchAuctions }
}
