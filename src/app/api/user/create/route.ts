import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateUser } from '@/lib/credits'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name } = body

    const profile = await getOrCreateUser(
      user.id,
      user.email!,
      name || user.user_metadata?.full_name
    )

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        supabaseId: profile.supabaseId,
        email: profile.email,
        name: profile.name,
        creditsBalance: profile.creditsBalance,
        tier: profile.tier,
      },
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
