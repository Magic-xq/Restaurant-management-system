// ===== 模拟数据初始化 =====
const defaultUsers = [
    { id: 1, email: 'customer@example.com', username: '美食爱好者', phone: '13800138001', restaurant: '', password: 'user123', userType: 'customer' },
    { id: 2, email: 'merchant@restaurant.com', username: '美食餐厅', phone: '13800138000', restaurant: '美食餐厅旗舰店', password: 'abc123', userType: 'merchant' },
    { id: 3, email: 'manager@restaurant.com', username: '餐饮经理', phone: '13900139000', restaurant: '餐饮集团总部', password: 'admin123', userType: 'manager' }
];

const defaultDishes = [
    { id: 1, name: '宫保鸡丁', price: 38, category: 'recommended', desc: '经典川菜，麻辣鲜香', icon: 'fa-drumstick-bite', recommended: true, stock: 50 },
    { id: 2, name: '北京烤鸭', price: 88, category: 'recommended', desc: '皮脆肉嫩，配薄饼葱丝', icon: 'fa-utensils', recommended: true, stock: 20 },
    { id: 3, name: '水煮鱼', price: 58, category: 'recommended', desc: '鲜嫩鱼片，麻辣汤底', icon: 'fa-fish', recommended: true, stock: 15 },
    { id: 4, name: '红烧狮子头', price: 42, category: 'recommended', desc: '传统淮扬菜，肥而不腻', icon: 'fa-circle', recommended: true, stock: 30 },
    { id: 5, name: '扬州炒饭', price: 25, category: 'staple', desc: '粒粒分明，配料丰富', icon: 'fa-bowl-rice', recommended: false, stock: 100 },
    { id: 6, name: '兰州拉面', price: 22, category: 'staple', desc: '一清二白三红四绿', icon: 'fa-bowl-food', recommended: false, stock: 80 },
    { id: 7, name: '蒸饺', price: 18, category: 'staple', desc: '皮薄馅大，鲜汁满溢', icon: 'fa-cookie', recommended: false, stock: 60 },
    { id: 8, name: '石锅拌饭', price: 35, category: 'staple', desc: '韩式风味，蔬菜丰富', icon: 'fa-bowl-rice', recommended: false, stock: 40 },
    { id: 9, name: '酸梅汤', price: 12, category: 'drink', desc: '古法熬制，消暑解腻', icon: 'fa-mug-hot', recommended: false, stock: 200 },
    { id: 10, name: '鲜榨橙汁', price: 15, category: 'drink', desc: '新鲜橙子现榨', icon: 'fa-glass-water', recommended: false, stock: 150 },
    { id: 11, name: '茉莉花茶', price: 10, category: 'drink', desc: '清香怡人，回味悠长', icon: 'fa-mug-saucer', recommended: false, stock: 180 },
    { id: 12, name: '椰汁西米露', price: 16, category: 'drink', desc: '椰香浓郁，Q弹爽滑', icon: 'fa-glass-waterdrop', recommended: false, stock: 120 },
    { id: 13, name: '桂花糕', price: 15, category: 'dessert', desc: '软糯香甜，桂花飘香', icon: 'fa-cookie-bite', recommended: false, stock: 50 },
    { id: 14, name: '红豆双皮奶', price: 18, category: 'dessert', desc: '嫩滑细腻，奶香四溢', icon: 'fa-ice-cream', recommended: false, stock: 40 },
    { id: 15, name: '杨枝甘露', price: 22, category: 'dessert', desc: '芒果西米，椰汁浓郁', icon: 'fa-ice-cream', recommended: true, stock: 35 },
    { id: 16, name: '杏仁豆腐', price: 16, category: 'dessert', desc: '清甜爽口，杏仁飘香', icon: 'fa-cheese', recommended: false, stock: 45 }
];

// 数据加载/保存
function loadData(key, defaultValue) {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let users = loadData('adminUsers', defaultUsers);
let dishes = loadData('adminDishes', defaultDishes);
let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

// ===== DOM元素 =====
const notification = document.getElementById('notification');
const loadingOverlay = document.getElementById('loadingOverlay');

// ===== 导航栏功能 =====
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('show');
    const icon = navbarToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') e.preventDefault();
        if (window.innerWidth <= 992) {
            navbarMenu.classList.remove('show');
            const icon = navbarToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

document.addEventListener('click', (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
        navbarMenu.classList.remove('show');
        const icon = navbarToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// ===== 用户信息与权限验证 =====
function loadUserInfo() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
        const user = JSON.parse(userJson);
        document.getElementById('userName').textContent = user.username || '管理员';
    } else {
        document.getElementById('userName').textContent = '管理员';
    }
}

// 权限检查：仅商家和管理者可访问管理后台
function checkPermission() {
    const userJson = sessionStorage.getItem('currentUser');
    const typeNames = { customer: '顾客', merchant: '商家', manager: '管理者', guest: '游客' };

    if (!userJson) {
        // 未登录，无权限
        document.getElementById('noPermission').style.display = 'block';
        document.getElementById('adminContent').style.display = 'none';
        document.getElementById('currentUserType').textContent = '未登录';
        return false;
    }

    const user = JSON.parse(userJson);
    if (user.userType !== 'merchant' && user.userType !== 'manager') {
        // 顾客或游客，无权限
        document.getElementById('noPermission').style.display = 'block';
        document.getElementById('adminContent').style.display = 'none';
        document.getElementById('currentUserType').textContent = typeNames[user.userType] || user.userType;
        return false;
    }

    // 权限通过，显示管理内容
    document.getElementById('noPermission').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    return true;
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    showNotification('正在退出登录...', 'info');
    setTimeout(() => window.location.href = '登录页.html', 1000);
});

// ===== 通知 =====
function showNotification(message, type = 'info', duration = 3000) {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    let icon = 'info-circle';
    switch(type) {
        case 'success': icon = 'check-circle'; break;
        case 'error': icon = 'exclamation-circle'; break;
        case 'warning': icon = 'exclamation-triangle'; break;
    }
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    setTimeout(() => notification.classList.remove('show'), duration);
}

function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

// ===== 标签页切换 =====
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tab.getAttribute('data-tab')}`).classList.add('active');
    });
});

// ===== 数据看板渲染 =====
function renderDashboard() {
    // 基础统计
    document.getElementById('statUsers').textContent = users.length;
    document.getElementById('statDishes').textContent = dishes.length;
    document.getElementById('statOrders').textContent = orders.length;

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('statRevenue').textContent = `￥${totalRevenue.toFixed(2)}`;

    // 今日统计
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.time).toDateString() === today);
    document.getElementById('statTodayOrders').textContent = todayOrders.length;

    const pendingOrders = orders.filter(o => o.status === '待处理' || o.status === '已支付');
    document.getElementById('statPendingOrders').textContent = pendingOrders.length;

    const completedOrders = orders.filter(o => o.status === '已完成');
    document.getElementById('statCompletedOrders').textContent = completedOrders.length;

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('statTodayRevenue').textContent = `￥${todayRevenue.toFixed(2)}`;

    // 分类统计
    const categories = { recommended: '推荐菜品', staple: '主食', drink: '饮料', dessert: '甜点' };
    const categoryStats = document.getElementById('categoryStats');
    categoryStats.innerHTML = Object.entries(categories).map(([key, label]) => {
        const count = dishes.filter(d => d.category === key).length;
        const percentage = dishes.length > 0 ? (count / dishes.length * 100).toFixed(1) : 0;
        return `
            <div class="category-stat-item">
                <div class="category-stat-info">
                    <span class="category-stat-label">${label}</span>
                    <span class="category-stat-count">${count} 种</span>
                </div>
                <div class="category-stat-bar">
                    <div class="category-stat-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="category-stat-percent">${percentage}%</span>
            </div>
        `;
    }).join('');

    // 最近订单
    const recentOrders = orders.slice(0, 5);
    const recentBody = document.getElementById('recentOrdersBody');
    if (recentOrders.length === 0) {
        recentBody.innerHTML = `<tr><td colspan="6" class="table-empty">暂无订单数据</td></tr>`;
    } else {
        recentBody.innerHTML = recentOrders.map(o => `
            <tr>
                <td>${o.orderNum}</td>
                <td>${o.time}</td>
                <td>${o.orderType === 'dinein' ? '堂食' : o.orderType === 'takeout' ? '外卖' : '自提'}</td>
                <td>${o.count} 件</td>
                <td>￥${o.total.toFixed(2)}</td>
                <td><span class="status-tag status-${o.status === '已完成' ? 'completed' : 'pending'}">${o.status}</span></td>
            </tr>
        `).join('');
    }
}

// ===== 用户管理 =====
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="table-empty">暂无用户数据</td></tr>`;
        return;
    }
    const typeNames = { customer: '顾客', merchant: '商家', manager: '管理者' };
    const typeColors = { customer: 'green', merchant: 'blue', manager: 'purple' };
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.email}</td>
            <td>${u.username}</td>
            <td>${u.phone}</td>
            <td>${u.restaurant || '-'}</td>
            <td><span class="type-tag type-${typeColors[u.userType]}">${typeNames[u.userType]}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${u.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 添加/编辑用户
let editingUserId = null;

document.getElementById('addUserBtn').addEventListener('click', () => {
    editingUserId = null;
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> 添加用户';
    document.getElementById('editUserId').value = '';
    document.getElementById('editUserEmail').value = '';
    document.getElementById('editUsername').value = '';
    document.getElementById('editUserPhone').value = '';
    document.getElementById('editUserRestaurant').value = '';
    document.getElementById('editUserPassword').value = '';
    document.getElementById('editUserType').value = 'customer';
    document.getElementById('userModal').style.display = 'flex';
});

function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    editingUserId = id;
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> 编辑用户';
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editUserPhone').value = user.phone;
    document.getElementById('editUserRestaurant').value = user.restaurant || '';
    document.getElementById('editUserPassword').value = user.password;
    document.getElementById('editUserType').value = user.userType;
    document.getElementById('userModal').style.display = 'flex';
}

function deleteUser(id) {
    if (users.length <= 1) {
        showNotification('至少保留一个用户', 'warning');
        return;
    }
    if (!confirm('确定删除该用户吗？')) return;
    users = users.filter(u => u.id !== id);
    saveData('adminUsers', users);
    renderUsers();
    renderDashboard();
    showNotification('用户已删除', 'success');
}

document.getElementById('saveUserBtn').addEventListener('click', () => {
    const email = document.getElementById('editUserEmail').value.trim();
    const username = document.getElementById('editUsername').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();
    const restaurant = document.getElementById('editUserRestaurant').value.trim();
    const password = document.getElementById('editUserPassword').value.trim();
    const userType = document.getElementById('editUserType').value;

    if (!email || !username || !phone || !password) {
        showNotification('请填写所有必填项', 'warning');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('邮箱格式无效', 'warning');
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        showNotification('电话号码格式无效', 'warning');
        return;
    }

    // 检查邮箱重复
    const duplicate = users.find(u => u.email === email && u.id !== editingUserId);
    if (duplicate) {
        showNotification('该邮箱已被使用', 'warning');
        return;
    }

    if (editingUserId) {
        const user = users.find(u => u.id === editingUserId);
        Object.assign(user, { email, username, phone, restaurant, password, userType });
        showNotification('用户信息已更新', 'success');
    } else {
        const newId = Math.max(...users.map(u => u.id), 0) + 1;
        users.push({ id: newId, email, username, phone, restaurant, password, userType });
        showNotification('用户已添加', 'success');
    }

    saveData('adminUsers', users);
    renderUsers();
    renderDashboard();
    document.getElementById('userModal').style.display = 'none';
});

document.getElementById('closeUserModal').addEventListener('click', () => {
    document.getElementById('userModal').style.display = 'none';
});
document.getElementById('cancelUserBtn').addEventListener('click', () => {
    document.getElementById('userModal').style.display = 'none';
});
document.getElementById('userModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
});

// ===== 菜品管理 =====
function renderDishes() {
    const tbody = document.getElementById('dishesTableBody');
    if (dishes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="table-empty">暂无菜品数据</td></tr>`;
        return;
    }
    const catNames = { recommended: '推荐菜品', staple: '主食', drink: '饮料', dessert: '甜点' };
    tbody.innerHTML = dishes.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${catNames[d.category]}</td>
            <td>￥${d.price.toFixed(2)}</td>
            <td class="col-desc">${d.desc}</td>
            <td>${d.stock}</td>
            <td>${d.recommended ? '<span class="type-tag type-green">推荐</span>' : '<span class="type-tag type-gray">普通</span>'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editDish(${d.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteDish(${d.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

let editingDishId = null;

document.getElementById('addDishBtn').addEventListener('click', () => {
    editingDishId = null;
    document.getElementById('dishModalTitle').innerHTML = '<i class="fas fa-plus"></i> 添加菜品';
    document.getElementById('editDishId').value = '';
    document.getElementById('editDishName').value = '';
    document.getElementById('editDishCategory').value = 'recommended';
    document.getElementById('editDishPrice').value = '';
    document.getElementById('editDishDesc').value = '';
    document.getElementById('editDishStock').value = '';
    document.getElementById('editDishRecommended').checked = false;
    document.getElementById('dishModal').style.display = 'flex';
});

function editDish(id) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return;
    editingDishId = id;
    document.getElementById('dishModalTitle').innerHTML = '<i class="fas fa-edit"></i> 编辑菜品';
    document.getElementById('editDishId').value = dish.id;
    document.getElementById('editDishName').value = dish.name;
    document.getElementById('editDishCategory').value = dish.category;
    document.getElementById('editDishPrice').value = dish.price;
    document.getElementById('editDishDesc').value = dish.desc;
    document.getElementById('editDishStock').value = dish.stock;
    document.getElementById('editDishRecommended').checked = dish.recommended;
    document.getElementById('dishModal').style.display = 'flex';
}

function deleteDish(id) {
    if (!confirm('确定删除该菜品吗？')) return;
    dishes = dishes.filter(d => d.id !== id);
    saveData('adminDishes', dishes);
    renderDishes();
    renderDashboard();
    showNotification('菜品已删除', 'success');
}

document.getElementById('saveDishBtn').addEventListener('click', () => {
    const name = document.getElementById('editDishName').value.trim();
    const category = document.getElementById('editDishCategory').value;
    const price = parseFloat(document.getElementById('editDishPrice').value);
    const desc = document.getElementById('editDishDesc').value.trim();
    const stock = parseInt(document.getElementById('editDishStock').value);
    const recommended = document.getElementById('editDishRecommended').checked;

    if (!name || isNaN(price) || isNaN(stock) || !desc) {
        showNotification('请填写所有必填项', 'warning');
        return;
    }
    if (price < 0) {
        showNotification('价格不能为负', 'warning');
        return;
    }
    if (stock < 0) {
        showNotification('库存不能为负', 'warning');
        return;
    }

    if (editingDishId) {
        const dish = dishes.find(d => d.id === editingDishId);
        Object.assign(dish, { name, category, price, desc, stock, recommended });
        showNotification('菜品信息已更新', 'success');
    } else {
        const newId = Math.max(...dishes.map(d => d.id), 0) + 1;
        const icons = { recommended: 'fa-star', staple: 'fa-bowl-rice', drink: 'fa-mug-hot', dessert: 'fa-ice-cream' };
        dishes.push({ id: newId, name, category, price, desc, stock, recommended, icon: icons[category] || 'fa-utensils' });
        showNotification('菜品已添加', 'success');
    }

    saveData('adminDishes', dishes);
    renderDishes();
    renderDashboard();
    document.getElementById('dishModal').style.display = 'none';
});

document.getElementById('closeDishModal').addEventListener('click', () => {
    document.getElementById('dishModal').style.display = 'none';
});
document.getElementById('cancelDishBtn').addEventListener('click', () => {
    document.getElementById('dishModal').style.display = 'none';
});
document.getElementById('dishModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
});

// ===== 订单管理 =====
function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="table-empty">暂无订单数据</td></tr>`;
        return;
    }
    const methodNames = { alipay: '支付宝', wechat: '微信', bankcard: '银行卡' };
    tbody.innerHTML = orders.map((o, index) => `
        <tr>
            <td>${o.orderNum}</td>
            <td>${o.time}</td>
            <td>${o.orderType === 'dinein' ? '堂食' : o.orderType === 'takeout' ? '外卖' : '自提'}</td>
            <td>${o.table || o.address || '-'}</td>
            <td>${o.count} 件</td>
            <td>￥${o.total.toFixed(2)}</td>
            <td>${methodNames[o.paymentMethod] || '-'}</td>
            <td><span class="status-tag status-${o.status === '已完成' ? 'completed' : 'pending'}">${o.status}</span></td>
            <td>
                <button class="action-btn complete-btn" onclick="completeOrder(${index})" ${o.status === '已完成' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function completeOrder(index) {
    orders[index].status = '已完成';
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    renderOrders();
    renderDashboard();
    showNotification('订单已标记为完成', 'success');
}

function deleteOrder(index) {
    if (!confirm('确定删除该订单吗？')) return;
    orders.splice(index, 1);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    renderOrders();
    renderDashboard();
    showNotification('订单已删除', 'success');
}

// ===== 初始化 =====
window.addEventListener('load', () => {
    loadUserInfo();
    if (checkPermission()) {
        renderDashboard();
        renderUsers();
        renderDishes();
        renderOrders();
    }
});
