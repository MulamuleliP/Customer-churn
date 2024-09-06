function loginForm() {
    return {
        email: '',
        password: '',
        handleSubmit() {
            // Handle login logic here
            console.log(`Email: ${this.email}, Password: ${this.password}`);
        },
        forgotPassword() {
            // Handle forgot password logic here
            alert('Forgot Password clicked!');
        }
    };
};

function toggleSubMenu() {
    const submenu = document.getElementById('submenu');
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
    } else {
        submenu.classList.add('hidden');
    }
}
