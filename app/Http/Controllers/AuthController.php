<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Menampilkan Halaman Login
    public function showLogin() {
        return view('auth.login'); // Pastikan file ada di resources/views/auth/login.blade.php
    }

    // Proses Registrasi Akun Baru
    public function register(Request $request) {
        $request->validate([
            'register_fullname' => 'required|string|max:255',
            'register_username' => 'required|string|unique:users,username',
            'register_password' => 'required|min:8',
            'register_role' => 'required'
        ]);

        User::create([
            'full_name' => $request->register_fullname,
            'username' => $request->register_username,
            'password' => Hash::make($request->register_password),
            'role' => $request->register_role,
        ]);

        return redirect()->route('login')->with('success', 'Registrasi Berhasil! Silakan Login.');
    }

    // Proses Login
    public function login(Request $request) {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors(['loginError' => 'Username atau Password salah!']);
    }

    // Proses Logout
    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}