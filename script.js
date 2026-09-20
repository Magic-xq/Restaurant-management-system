// 导航栏功能
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.querySelector('.navbar-menu');

// 切换移动端菜单
navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('show');
    // 切换图标
    const icon = navbarToggle.querySelector('i');
    if (navbarMenu.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 点击菜单项关闭移动端菜单
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // 如果链接是 #，阻止默认行为
        if (link.getAttribute('href') === '#') {
            e.preventDefault();
        }
        
        // 在移动端点击后关闭菜单
        if (window.innerWidth <= 992) {
            navbarMenu.classList.remove('show');
            const icon = navbarToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// 点击外部关闭移动端菜单
document.addEventListener('click', (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
        navbarMenu.classList.remove('show');
        const icon = navbarToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 移除之前添加的UML模态框相关代码

// 页面加载时自动调整主内容区域
window.addEventListener('load', () => {
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('.main-content');
    if (navbar && mainContent) {
        mainContent.style.marginTop = `${navbar.offsetHeight}px`;
    }
    setActiveMenuItem();
});

// 窗口大小改变时重新计算
window.addEventListener('resize', () => {
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('.main-content');
    if (navbar && mainContent) {
        mainContent.style.marginTop = `${navbar.offsetHeight}px`;
    }
    if (window.innerWidth > 992) {
        navbarMenu.classList.remove('show');
        const icon = navbarToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 设置活动菜单项
function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        // 如果是首页或当前页面，设置为活动状态
        if ((href === '#' && currentPage === '') || 
            (href && href !== '#' && currentPage.includes(href))) {
            link.classList.add('active');
        }
    });
}



// 模拟的用户数据库
const defaultUsers = [
    {
        email: "customer@example.com",
        username: "美食爱好者",
        phone: "13800138001",
        restaurant: "",
        password: "user123",
        userType: "customer",
        rememberMe: false
    },
    {
        email: "merchant@restaurant.com",
        username: "美食餐厅",
        phone: "13800138000",
        restaurant: "美食餐厅旗舰店",
        password: "abc123",
        userType: "merchant",
        rememberMe: false
    },
    {
        email: "manager@restaurant.com",
        username: "餐饮经理",
        phone: "13900139000",
        restaurant: "餐饮集团总部",
        password: "admin123",
        userType: "manager",
        rememberMe: false
    }
];

// 从 localStorage 加载用户数据，没有则用默认数据
let mockUsers = JSON.parse(localStorage.getItem('registeredUsers') || 'null') || defaultUsers;

// DOM元素
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const resetBtn = document.getElementById('resetBtn');
const resetRegisterBtn = document.getElementById('resetRegisterBtn');
const guestLoginBtn = document.getElementById('guestLogin');
const notification = document.getElementById('notification');
const loadingOverlay = document.getElementById('loadingOverlay');
const restaurantField = document.getElementById('restaurantField');

// 登录表单元素
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userTypeOptions = document.querySelectorAll('#loginForm .user-type-option');
const userTypeInput = document.getElementById('userType');

// 注册表单元素
const regEmailInput = document.getElementById('regEmail');
const regUsernameInput = document.getElementById('regUsername');
const regPhoneInput = document.getElementById('regPhone');
const regRestaurantInput = document.getElementById('regRestaurant');
const regPasswordInput = document.getElementById('regPassword');
const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
const regUserTypeOptions = document.querySelectorAll('#registerForm .user-type-option');
const regUserTypeInput = document.getElementById('regUserType');
const agreeTermsCheckbox = document.getElementById('agreeTerms');
const strengthText = document.getElementById('strengthText');
const strengthBars = document.querySelectorAll('.strength-bar');

// 切换显示/隐藏密码功能
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// 用户类型选择
function setupUserTypeSelection(options, inputElement) {
    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            const value = this.getAttribute('data-value');
            inputElement.value = value;
            
            // 如果是注册页面，根据用户类型显示/隐藏餐厅名称字段
            if (inputElement.id === 'regUserType') {
                if (value === 'customer') {
                    restaurantField.style.display = 'none';
                    regRestaurantInput.required = false;
                } else {
                    restaurantField.style.display = 'block';
                    regRestaurantInput.required = true;
                }
            }
        });
    });
}

setupUserTypeSelection(userTypeOptions, userTypeInput);
setupUserTypeSelection(regUserTypeOptions, regUserTypeInput);

// 初始隐藏顾客的餐厅字段
restaurantField.style.display = 'none';
regRestaurantInput.required = false;

// 切换到注册表单
switchToRegister.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    resetRegisterForm();
});

// 切换到登录表单
switchToLogin.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    resetLoginForm();
});

// 显示通知
function showNotification(message, type = 'info', duration = 5000) {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    
    // 添加图标
    let icon = 'info-circle';
    switch(type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
    }
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 显示/隐藏加载层
function showLoading(show) {
    if (show) {
        loadingOverlay.style.display = 'flex';
    } else {
        loadingOverlay.style.display = 'none';
    }
}

// 验证邮箱格式
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 验证密码格式（必须包含英文和数字）
function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
}

// 验证电话号码格式
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 检查密码强度
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4); // 限制最大为4
}

// 更新密码强度显示
regPasswordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = checkPasswordStrength(password);
    
    // 更新强度条
    strengthBars.forEach((bar, index) => {
        bar.style.backgroundColor = index < strength ? getStrengthColor(strength) : '#EEE';
    });
    
    // 更新强度文本
    let strengthLevel = '弱';
    let color = '#F44336';
    
    if (strength >= 4) {
        strengthLevel = '强';
        color = '#4CAF50';
    } else if (strength >= 2) {
        strengthLevel = '中';
        color = '#FF9800';
    }
    
    strengthText.textContent = strengthLevel;
    strengthText.style.color = color;
});

function getStrengthColor(strength) {
    if (strength >= 4) return '#4CAF50';
    if (strength >= 2) return '#FF9800';
    return '#F44336';
}

// 重置登录表单
function resetLoginForm() {
    emailInput.value = '';
    passwordInput.value = '';

    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // 恢复默认用户类型选择
    userTypeOptions.forEach(opt => opt.classList.remove('active'));
    userTypeOptions[0].classList.add('active');
    userTypeInput.value = 'customer';
}

// 重置注册表单
function resetRegisterForm() {
    regEmailInput.value = '';
    regUsernameInput.value = '';
    regPhoneInput.value = '';
    regRestaurantInput.value = '';
    regPasswordInput.value = '';
    regConfirmPasswordInput.value = '';
    agreeTermsCheckbox.checked = false;
    
    document.getElementById('regEmailError').textContent = '';
    document.getElementById('regUsernameError').textContent = '';
    document.getElementById('regPhoneError').textContent = '';
    document.getElementById('regRestaurantError').textContent = '';
    document.getElementById('regPasswordError').textContent = '';
    document.getElementById('regConfirmPasswordError').textContent = '';
    document.getElementById('termsError').textContent = '';
    
    // 重置密码强度显示
    strengthBars.forEach(bar => bar.style.backgroundColor = '#EEE');
    strengthText.textContent = '弱';
    strengthText.style.color = '#F44336';
    
    // 恢复默认用户类型选择
    regUserTypeOptions.forEach(opt => opt.classList.remove('active'));
    regUserTypeOptions[0].classList.add('active');
    regUserTypeInput.value = 'customer';
    
    // 隐藏餐厅字段
    restaurantField.style.display = 'none';
    regRestaurantInput.required = false;
}

// 模拟登录验证延迟
function simulateLoginDelay() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

// 模拟跳转到不同界面
function navigateToUserPage(userType) {
    showLoading(true);

    let pageName = '';
    let targetPage = '';
    switch(userType) {
        case 'customer':
            pageName = '餐饮点餐界面';
            targetPage = '售卖页.html';
            break;
        case 'merchant':
            pageName = '餐饮管理界面';
            targetPage = '管理员页.html';
            break;
        case 'manager':
            pageName = '餐饮数据分析界面';
            targetPage = '管理员页.html';
            break;
    }

    // 保存用户登录信息到 sessionStorage
    const user = mockUsers.find(u => u.email === emailInput.value.trim());
    sessionStorage.setItem('currentUser', JSON.stringify({
        email: user ? user.email : '',
        username: user ? user.username : '',
        userType: userType,
        loginTime: new Date().toLocaleString()
    }));

    showNotification(`正在跳转到${pageName}...`, 'info');

    setTimeout(() => {
        showLoading(false);
        showNotification('登录成功！', 'success');
        setTimeout(() => {
            window.location.href = targetPage;
        }, 800);
    }, 1200);
}

// 登录表单验证
function validateLoginForm() {
    let isValid = true;

    // 验证邮箱
    const email = emailInput.value.trim();
    if (!email) {
        document.getElementById('emailError').textContent = '请输入邮箱地址';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = '邮箱格式无效';
        isValid = false;
    } else {
        document.getElementById('emailError').textContent = '';
    }

    // 验证密码
    const password = passwordInput.value;
    if (!password) {
        document.getElementById('passwordError').textContent = '请输入密码';
        isValid = false;
    } else {
        document.getElementById('passwordError').textContent = '';
    }

    return isValid;
}

// 注册表单验证
function validateRegisterForm() {
    let isValid = true;
    
    // 验证邮箱
    const email = regEmailInput.value.trim();
    if (!email) {
        document.getElementById('regEmailError').textContent = '请输入邮箱地址';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('regEmailError').textContent = '邮箱格式无效';
        isValid = false;
    } else {
        document.getElementById('regEmailError').textContent = '';
    }
    
    // 验证用户名
    const username = regUsernameInput.value.trim();
    if (!username) {
        document.getElementById('regUsernameError').textContent = '请输入用户名';
        isValid = false;
    } else if (username.length < 2) {
        document.getElementById('regUsernameError').textContent = '用户名至少2个字符';
        isValid = false;
    } else {
        document.getElementById('regUsernameError').textContent = '';
    }
    
    // 验证电话
    const phone = regPhoneInput.value.trim();
    if (!phone) {
        document.getElementById('regPhoneError').textContent = '请输入联系电话';
        isValid = false;
    } else if (!validatePhone(phone)) {
        document.getElementById('regPhoneError').textContent = '电话号码格式无效';
        isValid = false;
    } else {
        document.getElementById('regPhoneError').textContent = '';
    }
    
    // 验证餐厅名称（如果不是顾客）
    const userType = regUserTypeInput.value;
    const restaurant = regRestaurantInput.value.trim();
    if (userType !== 'customer') {
        if (!restaurant) {
            document.getElementById('regRestaurantError').textContent = '请输入餐厅名称';
            isValid = false;
        } else {
            document.getElementById('regRestaurantError').textContent = '';
        }
    }
    
    // 验证密码
    const password = regPasswordInput.value;
    if (!password) {
        document.getElementById('regPasswordError').textContent = '请输入密码';
        isValid = false;
    } else if (!validatePassword(password)) {
        document.getElementById('regPasswordError').textContent = '密码需同时包含英文和数字';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('regPasswordError').textContent = '密码长度至少6位';
        isValid = false;
    } else {
        document.getElementById('regPasswordError').textContent = '';
    }
    
    // 验证确认密码
    const confirmPassword = regConfirmPasswordInput.value;
    if (!confirmPassword) {
        document.getElementById('regConfirmPasswordError').textContent = '请再次输入密码';
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('regConfirmPasswordError').textContent = '两次输入的密码不一致';
        isValid = false;
    } else {
        document.getElementById('regConfirmPasswordError').textContent = '';
    }
    
    // 验证条款同意
    if (!agreeTermsCheckbox.checked) {
        document.getElementById('termsError').textContent = '请同意服务条款和隐私政策';
        isValid = false;
    } else {
        document.getElementById('termsError').textContent = '';
    }
    
    return isValid;
}

// 登录处理
loginBtn.addEventListener('click', async () => {
    if (!validateLoginForm()) {
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const userType = userTypeInput.value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 如果记住我，保存邮箱到本地存储
    if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedUserType', userType);
    } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedUserType');
    }
    
    // 查找用户
    const user = mockUsers.find(u => 
        u.email === email && 
        u.password === password && 
        u.userType === userType
    );
    
    if (!user) {
        // 用户不存在，提示注册
        showNotification('用户不存在，请先注册！', 'warning');
        resetLoginForm();
        // 切换到注册页面
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        resetRegisterForm();
        
        // 预填充邮箱和用户类型
        regEmailInput.value = email;
        regUserTypeInput.value = userType;
        
        // 更新用户类型选择
        regUserTypeOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-value') === userType) {
                opt.classList.add('active');
            }
        });
        
        return;
    }
    
    // 用户存在，模拟登录验证
    showNotification('正在验证用户信息...', 'info');
    showLoading(true);

    await simulateLoginDelay();

    showLoading(false);
    showNotification('验证通过！正在登录...', 'success');
    // 跳转到相应用户界面
    setTimeout(() => {
        navigateToUserPage(userType);
    }, 500);
});

// 注册处理
registerBtn.addEventListener('click', () => {
    if (!validateRegisterForm()) {
        return;
    }
    
    const email = regEmailInput.value.trim();
    const username = regUsernameInput.value.trim();
    const phone = regPhoneInput.value.trim();
    const restaurant = regRestaurantInput.value.trim();
    const password = regPasswordInput.value;
    const userType = regUserTypeInput.value;
    
    // 检查用户是否已存在
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
        showNotification('该邮箱已注册，请直接登录！', 'warning');
        // 切换到登录页面
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        resetLoginForm();
        
        // 预填充邮箱
        emailInput.value = email;
        userTypeInput.value = userType;
        
        // 更新用户类型选择
        userTypeOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-value') === userType) {
                opt.classList.add('active');
            }
        });
        
        return;
    }
    
    // 添加新用户到模拟数据库
    const newUser = {
        email,
        username,
        phone,
        restaurant: userType !== 'customer' ? restaurant : '',
        password,
        userType,
        rememberMe: false
    };
    
    mockUsers.push(newUser);

    // 持久化用户数据到 localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(mockUsers));

    showNotification('注册成功！请使用新账户登录。', 'success');
    
    // 切换到登录页面
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    resetLoginForm();
    
    // 预填充邮箱
    emailInput.value = email;
    userTypeInput.value = userType;
    
    // 更新用户类型选择
    userTypeOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-value') === userType) {
            opt.classList.add('active');
        }
    });
});

// 游客登录
guestLoginBtn.addEventListener('click', () => {
    showNotification('正在进入游客模式...', 'info');

    // 模拟登录过程
    showLoading(true);

    setTimeout(() => {
        showLoading(false);

        // 保存游客信息到 sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            email: 'guest@example.com',
            username: '游客',
            userType: 'customer',
            loginTime: new Date().toLocaleString()
        }));

        showNotification('游客登录成功！部分功能受限。', 'success');

        // 跳转到顾客界面
        setTimeout(() => {
            showLoading(true);
            setTimeout(() => {
                showLoading(false);
                window.location.href = '售卖页.html';
            }, 1000);
        }, 500);
    }, 1500);
});

// 重置按钮事件
resetBtn.addEventListener('click', resetLoginForm);
resetRegisterBtn.addEventListener('click', resetRegisterForm);

// 忘记密码事件
document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    if (!email || !validateEmail(email)) {
        showNotification('请输入有效的邮箱地址以重置密码', 'warning');
        return;
    }
    
    showNotification(`重置密码链接已发送到 ${email}，请查收邮件。`, 'info');
});

// 社交登录按钮事件
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.classList.contains('wechat') ? '微信' : 
                    this.classList.contains('alipay') ? '支付宝' : '手机';
        showNotification(`${type}登录功能正在开发中...`, 'info');
    });
});

// 页面加载时检查是否有记住的登录信息
window.addEventListener('load', () => {
    // 检查本地存储中是否有记住的登录信息
    const savedEmail = localStorage.getItem('savedEmail');
    const savedUserType = localStorage.getItem('savedUserType');
    
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('rememberMe').checked = true;
        
        if (savedUserType) {
            userTypeInput.value = savedUserType;
            userTypeOptions.forEach(opt => {
                opt.classList.remove('active');
                if (opt.getAttribute('data-value') === savedUserType) {
                    opt.classList.add('active');
                }
            });
        }
    }
});

// 实时验证
emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
        document.getElementById('emailError').textContent = '邮箱格式无效';
    } else {
        document.getElementById('emailError').textContent = '';
    }
});

passwordInput.addEventListener('blur', function() {
    const password = this.value;
    if (password && !validatePassword(password)) {
        document.getElementById('passwordError').textContent = '密码需同时包含英文和数字';
    } else {
        document.getElementById('passwordError').textContent = '';
    }
});

// 注册表单实时验证
regEmailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
        document.getElementById('regEmailError').textContent = '邮箱格式无效';
    } else {
        document.getElementById('regEmailError').textContent = '';
    }
});

regPhoneInput.addEventListener('blur', function() {
    const phone = this.value.trim();
    if (phone && !validatePhone(phone)) {
        document.getElementById('regPhoneError').textContent = '电话号码格式无效';
    } else {
        document.getElementById('regPhoneError').textContent = '';
    }
});

regPasswordInput.addEventListener('blur', function() {
    const password = this.value;
    if (password && !validatePassword(password)) {
        document.getElementById('regPasswordError').textContent = '密码需同时包含英文和数字';
    } else {
        document.getElementById('regPasswordError').textContent = '';
    }
});

regConfirmPasswordInput.addEventListener('blur', function() {
    const confirmPassword = this.value;
    const password = regPasswordInput.value;
    if (confirmPassword && password !== confirmPassword) {
        document.getElementById('regConfirmPasswordError').textContent = '两次输入的密码不一致';
    } else {
        document.getElementById('regConfirmPasswordError').textContent = '';
    }
});

// 初始化页面
resetLoginForm();