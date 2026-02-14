<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Admin ISP</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @vite(['resources/css/style.css', 'resources/css/login.css'])
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-header">
            <div class="logo"><i class="fas fa-satellite-dish"></i><h1>CV BAMS</h1></div>
            <p class="tagline">Dashboard Management ISP</p>
        </div>

        <div class="login-form-wrapper">
            <div class="login-form-container">
                @if($errors->any())
                    <div style="background: #e74c3c; color: white; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                        {{ $errors->first() }}
                    </div>
                @endif
                @if(session('success'))
                    <div style="background: #2ecc71; color: white; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                        {{ session('success') }}
                    </div>
                @endif

                <form id="login-form" action="{{ route('login.post') }}" method="POST" class="form-active">
                    @csrf
                    <div class="form-header">
                        <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-user"></i> Username</label>
                        <input type="text" name="username" class="form-control" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-lock"></i> Password</label>
                        <input type="password" name="password" class="form-control" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Login Sekarang</button>
                    <div class="form-footer">
                        <p>Belum punya akun? <a href="#" id="show-register">Daftar disini</a></p>
                    </div>
                </form>

                <form id="register-form" action="{{ route('register.post') }}" method="POST" style="display: none;">
                    @csrf
                    <div class="form-header">
                        <h2><i class="fas fa-user-plus"></i> Registrasi</h2>
                    </div>
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" name="register_fullname" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="register_username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="register_password" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Kualifikasi (Role)</label>
                        <select name="register_role" class="form-control" required>
                            <option value="admin">Karyawan (Admin)</option>
                            <option value="super_admin">Administrator (Super Admin)</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-success btn-block">Daftar Akun</button>
                    <div class="form-footer">
                        <p>Sudah punya akun? <a href="#" id="show-login">Login disini</a></p>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        document.getElementById('show-register').onclick = (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        };
        
        document.getElementById('show-login').onclick = (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        };
    </script>
</body>
</html>