"use client"
import { useState, useEffect, useCallback } from 'react'

interface AnalysisResult {
  id: string;
  auctionId: string;
  overallScore: number;
  investmentRating: string;
  summary: string;
  marketAnalysis: {
    estimatedValue: number;
    confidenceLevel: number;
    comparableSales: number;
    marketTrend: 'appreciating' | 'stable' | 'depreciating';
    pricePosition: 'below' | 'at' | 'above';
  };
  conditionAssessment: {
    exterior: number;
    interior: number;
    mechanical: number;
    documentation: number;
    overall: number;
    flags: string[];
  };
  investmentOutlook: {
    shortTerm: string;
    longTerm: string;
    risks: string[];
    opportunities: string[];
  };
  recommendation: string;
  createdAt: string;
}

export function useAnalysis(auctionId: string) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const fetchAnalysis = useCallback(async () => {
    if (!auctionId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/analyze?auctionId=${auctionId}`)
      const data = await res.json()
      if (data.success && data.data) {
        setAnalysis(data.data)
      } else if (res.status === 404) {
        setAnalysis(null)
      } else {
        setError(data.error || 'Failed to fetch analysis')
      }
    } catch (err) {
      setError('Failed to fetch analysis')
    } finally {
      setLoading(false)
    }
  }, [auctionId])

  useEffect(() => { fetchAnalysis() }, [fetchAnalysis])

  const triggerAnalysis = useCallback(async () => {
    if (!auctionId) return
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId }),
      })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.data)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to trigger analysis')
    } finally {
      setAnalyzing(false)
    }
  }, [auctionId])

  return { analysis, loading, error, analyzing, triggerAnalysis }
}
