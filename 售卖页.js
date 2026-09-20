// ===== 全局变量 =====
let currentStep = 1;
let orderType = 'dinein';
let selectedTable = '';
let cart = [];
let currentCategory = 'all';
let searchKeyword = '';
let selectedPaymentMethod = 'alipay';

// ===== 模拟菜品数据 =====
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

// 从 localStorage 加载菜品数据，与管理员页同步
let dishes = JSON.parse(localStorage.getItem('adminDishes') || 'null') || defaultDishes;

// ===== DOM 元素 =====
const notification = document.getElementById('notification');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');

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

// ===== 用户信息显示 =====
function loadUserInfo() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
        const user = JSON.parse(userJson);
        document.getElementById('userName').textContent = user.username || '顾客';

        // 顾客/游客隐藏管理后台入口
        if (user.userType !== 'merchant' && user.userType !== 'manager') {
            const adminLink = document.querySelector('a[href="管理员页.html"]');
            if (adminLink) {
                const li = adminLink.closest('li');
                if (li) li.style.display = 'none';
            }
        }
    } else {
        document.getElementById('userName').textContent = '游客';
        // 未登录也隐藏管理后台入口
        const adminLink = document.querySelector('a[href="管理员页.html"]');
        if (adminLink) {
            const li = adminLink.closest('li');
            if (li) li.style.display = 'none';
        }
    }
}

// ===== 退出登录 =====
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    showNotification('正在退出登录...', 'info');
    setTimeout(() => {
        window.location.href = '登录页.html';
    }, 1000);
});

// ===== 通知与加载 =====
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

function showLoading(show, text = '正在处理...') {
    if (show) {
        loadingText.textContent = text;
        loadingOverlay.style.display = 'flex';
    } else {
        loadingOverlay.style.display = 'none';
    }
}

// ===== 步骤切换 =====
function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.order-step-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step${step}Content`).classList.remove('hidden');
    if (step <= 3) {
        document.getElementById('paymentSuccess').classList.add('hidden');
    }
    updateStepIndicator(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicator(step) {
    document.querySelectorAll('.step-indicator .step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) {
            el.classList.add('completed');
        } else if (index + 1 === step) {
            el.classList.add('active');
        }
    });
}

// ===== 第一步：点餐类型选择 =====
const orderTypeCards = document.querySelectorAll('.order-type-card');
orderTypeCards.forEach(card => {
    card.addEventListener('click', () => {
        orderTypeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        orderType = card.getAttribute('data-type');

        if (orderType === 'dinein') {
            document.getElementById('dineinDetail').classList.remove('hidden');
            document.getElementById('deliveryDetail').classList.add('hidden');
        } else {
            document.getElementById('dineinDetail').classList.add('hidden');
            document.getElementById('deliveryDetail').classList.remove('hidden');
        }
    });
});

// 桌台选择
document.querySelectorAll('.table-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.table-item').forEach(t => t.classList.remove('selected'));
        item.classList.add('selected');
        selectedTable = item.getAttribute('data-table');
    });
});

// 下一步：进入菜品选择
document.getElementById('toStep2').addEventListener('click', () => {
    if (orderType === 'dinein' && !selectedTable) {
        showNotification('请选择桌台号', 'warning');
        return;
    }
    if (orderType !== 'dinein') {
        const address = document.getElementById('deliveryAddress').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        if (!address) {
            showNotification('请填写配送地址', 'warning');
            return;
        }
        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
            showNotification('请输入正确的11位手机号', 'warning');
            return;
        }
    }
    goToStep(2);
});

// ===== 第二步：菜品浏览与购物车 =====

// 渲染菜品网格
function renderDishes() {
    const grid = document.getElementById('dishGrid');
    let filtered = dishes.filter(d => {
        let catMatch = currentCategory === 'all' || d.category === currentCategory;
        let searchMatch = !searchKeyword ||
            d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            d.desc.toLowerCase().includes(searchKeyword.toLowerCase());
        return catMatch && searchMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="dish-empty"><i class="fas fa-search"></i><p>未找到匹配的菜品</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(dish => `
        <div class="dish-card" data-id="${dish.id}">
            ${dish.recommended ? '<div class="dish-badge">推荐</div>' : ''}
            <div class="dish-image">
                <i class="fas ${dish.icon}"></i>
            </div>
            <div class="dish-info">
                <h3 class="dish-name">${dish.name}</h3>
                <p class="dish-desc">${dish.desc}</p>
                <div class="dish-meta">
                    <span class="dish-price">￥${dish.price.toFixed(2)}</span>
                    <span class="dish-stock"><i class="fas fa-box"></i> 库存 ${dish.stock}</span>
                </div>
            </div>
            <button class="btn-add-cart" data-id="${dish.id}" ${dish.stock === 0 ? 'disabled' : ''}>
                <i class="fas fa-plus"></i> 加入购物车
            </button>
        </div>
    `).join('');

    // 绑定加入购物车事件
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// 搜索功能
document.getElementById('dishSearch').addEventListener('input', (e) => {
    searchKeyword = e.target.value;
    renderDishes();
});

// 分类切换
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category');
        renderDishes();
    });
});

// ===== 购物车管理 =====

// 添加到购物车
function addToCart(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    const existing = cart.find(item => item.id === dishId);
    if (existing) {
        if (existing.quantity >= dish.stock) {
            showNotification('已达库存上限', 'warning');
            return;
        }
        existing.quantity++;
    } else {
        cart.push({ id: dish.id, name: dish.name, price: dish.price, icon: dish.icon, quantity: 1, stock: dish.stock });
    }
    saveCart();
    renderCart();
    showNotification(`${dish.name} 已加入购物车`, 'success', 1500);

    // 动画效果
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('bounce');
    setTimeout(() => cartSidebar.classList.remove('bounce'), 500);
}

// 渲染购物车
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>购物车空空如也</p>
                <span>快去挑选心仪的菜品吧</span>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-icon"><i class="fas ${item.icon}"></i></div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">￥${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                    <span class="qty-num">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                    <button class="qty-btn delete" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // 绑定数量调整事件
        cartItems.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                decreaseQuantity(id);
            });
        });
        cartItems.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                increaseQuantity(id);
            });
        });
        cartItems.querySelectorAll('.qty-btn.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
    updateCartTotal();
}

function increaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item && item.quantity < item.stock) {
        item.quantity++;
        saveCart();
        renderCart();
    } else {
        showNotification('已达库存上限', 'warning');
    }
}

function decreaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        renderCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    showNotification('已从购物车移除', 'info', 1500);
}

// 清空购物车
document.getElementById('clearCartBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('购物车已经是空的', 'info');
        return;
    }
    cart = [];
    saveCart();
    renderCart();
    showNotification('购物车已清空', 'info');
});

// 更新购物车总价
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('cartTotal').textContent = `￥${total.toFixed(2)}`;
}

// 购物车数据持久化
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        renderCart();
    }
}

// 去结算
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('购物车为空，请先选择菜品', 'warning');
        return;
    }
    renderCheckout();
    goToStep(3);
});

// 上一步
document.getElementById('backToStep1').addEventListener('click', () => goToStep(1));
document.getElementById('backToStep2').addEventListener('click', () => goToStep(2));

// ===== 第三步：支付结算 =====

function renderCheckout() {
    // 订单信息栏
    const infoBar = document.getElementById('orderInfoBar');
    if (orderType === 'dinein') {
        infoBar.innerHTML = `
            <div class="info-tag"><i class="fas fa-store"></i> 堂食</div>
            <div class="info-tag"><i class="fas fa-chair"></i> 桌台号：${selectedTable}</div>
        `;
    } else {
        const address = document.getElementById('deliveryAddress').value;
        const phone = document.getElementById('contactPhone').value;
        const method = document.getElementById('deliveryMethod');
        const methodText = method.options[method.selectedIndex].text;
        const note = document.getElementById('orderNote').value;
        infoBar.innerHTML = `
            <div class="info-tag"><i class="fas fa-motorcycle"></i> ${orderType === 'takeout' ? '外卖' : '自提'}</div>
            <div class="info-tag"><i class="fas fa-map-marker-alt"></i> ${address}</div>
            <div class="info-tag"><i class="fas fa-phone"></i> ${phone}</div>
            <div class="info-tag"><i class="fas fa-shipping-fast"></i> ${methodText}</div>
            ${note ? `<div class="info-tag"><i class="fas fa-sticky-note"></i> ${note}</div>` : ''}
        `;
    }

    // 订单项列表
    document.getElementById('checkoutItems').innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-icon"><i class="fas ${item.icon}"></i></div>
            <div class="checkout-item-name">${item.name}</div>
            <div class="checkout-item-qty">×${item.quantity}</div>
            <div class="checkout-item-price">￥${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    // 合计
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('checkoutCount').textContent = `${count} 件`;
    document.getElementById('checkoutTotal').textContent = `￥${total.toFixed(2)}`;
    document.getElementById('payAmount').textContent = `￥${total.toFixed(2)}`;
}

// 支付方式选择
document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedPaymentMethod = opt.getAttribute('data-method');
    });
});

// 确认支付
document.getElementById('payBtn').addEventListener('click', () => {
    const methodNames = { alipay: '支付宝', wechat: '微信', bankcard: '银行卡' };
    showLoading(true, `正在通过${methodNames[selectedPaymentMethod]}支付...`);

    setTimeout(() => {
        showLoading(false);

        // 生成订单号
        const orderNum = generateOrderNumber();
        document.getElementById('orderNumber').textContent = orderNum;

        // 支付摘要
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('paymentSummary').innerHTML = `
            <div class="summary-row"><span>支付方式：</span><span>${methodNames[selectedPaymentMethod]}</span></div>
            <div class="summary-row"><span>菜品数量：</span><span>${count} 件</span></div>
            <div class="summary-row total-row"><span>支付金额：</span><span>￥${total.toFixed(2)}</span></div>
        `;

        // 保存订单到历史记录
        saveOrder(orderNum, total, count);

        // 清空购物车
        cart = [];
        saveCart();
        renderCart();

        // 显示成功页面
        document.querySelectorAll('.order-step-content').forEach(el => el.classList.add('hidden'));
        document.getElementById('paymentSuccess').classList.remove('hidden');
        updateStepIndicator(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
});

// 生成订单号
function generateOrderNumber() {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
}

// 保存订单到历史
function saveOrder(orderNum, total, count) {
    let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const orderData = {
        orderNum,
        orderType,
        table: selectedTable,
        items: [...cart],
        total,
        count,
        paymentMethod: selectedPaymentMethod,
        time: new Date().toLocaleString(),
        status: '已支付'
    };
    // 外卖/自提订单保存配送信息
    if (orderType !== 'dinein') {
        orderData.address = document.getElementById('deliveryAddress').value;
        orderData.phone = document.getElementById('contactPhone').value;
        const method = document.getElementById('deliveryMethod');
        orderData.deliveryMethod = method.options[method.selectedIndex].text;
        orderData.note = document.getElementById('orderNote').value;
    }
    orders.unshift(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
}

// 继续点餐
document.getElementById('continueShopping').addEventListener('click', () => {
    // 重置到第一步
    orderType = 'dinein';
    selectedTable = '';
    document.querySelectorAll('.order-type-card').forEach((c, i) => {
        c.classList.toggle('active', i === 0);
    });
    document.getElementById('dineinDetail').classList.remove('hidden');
    document.getElementById('deliveryDetail').classList.add('hidden');
    document.querySelectorAll('.table-item').forEach(t => t.classList.remove('selected'));
    document.getElementById('deliveryAddress').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('orderNote').value = '';
    goToStep(1);
});

// 查看订单
document.getElementById('viewOrders').addEventListener('click', () => {
    renderOrderHistory();
    document.getElementById('orderHistoryModal').style.display = 'flex';
});

document.getElementById('closeOrderHistory').addEventListener('click', () => {
    document.getElementById('orderHistoryModal').style.display = 'none';
});

function renderOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const list = document.getElementById('orderHistoryList');
    if (orders.length === 0) {
        list.innerHTML = `<div class="cart-empty"><i class="fas fa-inbox"></i><p>暂无历史订单</p></div>`;
        return;
    }
    list.innerHTML = orders.map(order => `
        <div class="order-history-item">
            <div class="order-history-header">
                <strong>${order.orderNum}</strong>
                <span class="order-status">${order.status}</span>
            </div>
            <div class="order-history-info">
                <span><i class="fas fa-clock"></i> ${order.time}</span>
                <span><i class="fas fa-box"></i> ${order.count}件</span>
                <span class="order-total">￥${order.total.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

// 点击模态框外部关闭
document.getElementById('orderHistoryModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.style.display = 'none';
    }
});

// ===== 初始化 =====
window.addEventListener('load', () => {
    loadUserInfo();
    renderDishes();
    loadCart();
});
