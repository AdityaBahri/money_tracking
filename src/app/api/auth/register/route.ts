import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, fullName } = body;

    if (!username || !username.trim()) {
      return NextResponse.json({ success: false, error: 'Username wajib diisi.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi minimal 6 karakter.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Konfigurasi Supabase Admin belum tersedia di server.' },
        { status: 500 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const emailToUse = email && email.trim()
      ? email.trim().toLowerCase()
      : `${cleanUsername}@sakurapi.local`;

    // Periksa apakah username sudah terdaftar di profiles
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('username', cleanUsername)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username sudah digunakan, silakan pilih username lain.' },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar
    const { data: existingEmail } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('email', emailToUse)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk.' },
        { status: 400 }
      );
    }

    // Buat akun dengan email_confirm langsung aktif agar tidak terkena hambatan konfirmasi email
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: emailToUse,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: cleanUsername,
        full_name: fullName?.trim() || cleanUsername,
      },
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      email: emailToUse,
      userId: data.user.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
