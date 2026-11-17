import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier } = body;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json(
        { success: false, error: 'Username atau email wajib diisi.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Konfigurasi Supabase Admin belum tersedia.' },
        { status: 500 }
      );
    }

    const cleanId = identifier.trim();
    let emailToUse = cleanId;

    if (!cleanId.includes('@')) {
      // Cari profil pengguna berdasarkan username
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, id')
        .ilike('username', cleanId)
        .maybeSingle();

      if (profile && profile.email) {
        emailToUse = profile.email;
      } else {
        emailToUse = `${cleanId.toLowerCase()}@sakurapi.local`;
      }
    }

    // Pastikan akun sudah terkonfirmasi di auth.users agar tidak muncul error "Email not confirmed"
    try {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const targetUser = userList?.users?.find(
        (u) => u.email?.toLowerCase() === emailToUse.toLowerCase()
      );

      if (targetUser && !targetUser.email_confirmed_at) {
        await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
          email_confirm: true,
        });
      }
    } catch (confErr) {
      console.warn('Gagal memverifikasi status konfirmasi email pengguna:', confErr);
    }

    return NextResponse.json({
      success: true,
      email: emailToUse,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

