// 通知系统优化
let notificationQueue = [];
let isShowingNotification = false;

// 通知记录系统
let notificationHistory = [];
const MAX_HISTORY = 5;

function showNotification(message, type = 'info', duration = 3000) {
    // 添加到历史记录
    addToHistory(message, type);
    
    // 将通知添加到队列
    notificationQueue.push({ message, type, duration });
    
    // 如果当前没有显示通知，开始显示
    if (!isShowingNotification) {
        showNextNotification();
    }
}

function addToHistory(message, type) {
    const timestamp = new Date();
    notificationHistory.unshift({ message, type, timestamp });
    
    // 保持最近5条记录
    if (notificationHistory.length > MAX_HISTORY) {
        notificationHistory.pop();
    }
}

function showNextNotification() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const { message, type, duration } = notificationQueue.shift();
    
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 创建内容包装器
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'notification-content';
    
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = getNotificationIcon(type);
    
    const text = document.createElement('span');
    text.className = 'notification-text';
    text.textContent = message;
    
    // 添加进度条
    const progress = document.createElement('div');
    progress.className = 'notification-progress';
    
    contentWrapper.appendChild(icon);
    contentWrapper.appendChild(text);
    notification.appendChild(contentWrapper);
    notification.appendChild(progress);
    
    // 添加进场动画
    notification.style.animation = 'slideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
    
    // 添加进度条动画
    progress.style.animation = `progress ${duration}ms linear forwards`;
    
    container.appendChild(notification);
    
    // 添加点击关闭功能
    notification.addEventListener('click', () => {
        clearTimeout(notification.closeTimeout);
        closeNotification(notification);
    });
    
    // 自动关闭定时器
    notification.closeTimeout = setTimeout(() => {
        closeNotification(notification);
    }, duration);
}

function closeNotification(notification) {
    if (!notification.classList.contains('closing')) {
        notification.classList.add('closing');
        
        // 停止进度条动画
        const progress = notification.querySelector('.notification-progress');
        if (progress) {
            progress.style.animationPlayState = 'paused';
        }
        
        // 添加退场动画
        notification.style.animation = 'slideOut 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        
        // 动画结束后移除元素
        setTimeout(() => {
            notification.remove();
            showNextNotification();
        }, 600);
    }
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✨';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'love': return '💝';
        default: return '💌';
    }
}

// 计时器功能
function updateTimer() {
    const startDate = new Date('2022-08-19T00:00:00');
    const now = new Date();
    const diff = now - startDate;
    
    // 计算时间差
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新DOM
    const daysElement = document.getElementById('timer-days');
    const hoursElement = document.getElementById('timer-hours');
    const minutesElement = document.getElementById('timer-minutes');
    const secondsElement = document.getElementById('timer-seconds');
    
    if (daysElement && hoursElement && minutesElement && secondsElement) {
        // 获取当前显示的值
        const currentDays = parseInt(daysElement.textContent) || 0;
        const currentHours = parseInt(hoursElement.textContent) || 0;
        const currentMinutes = parseInt(minutesElement.textContent) || 0;
        const currentSeconds = parseInt(secondsElement.textContent) || 0;
        
        // 只有当值发生变化时才执行动画
        if (currentDays !== days) {
            animateNumber(daysElement, currentDays, days, 800);
        }
        if (currentHours !== hours) {
            animateNumber(hoursElement, currentHours, hours, 500);
        }
        if (currentMinutes !== minutes) {
            animateNumber(minutesElement, currentMinutes, minutes, 500);
        }
        if (currentSeconds !== seconds) {
            animateNumber(secondsElement, currentSeconds, seconds, 300);
        }
    }
}

// 数字动画函数优化
function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (range * easeProgress));
        
        // 确保数字始终是两位数格式
        element.textContent = current.toString().padStart(2, '0');
        
        // 添加动画类
        element.classList.add('number-changing');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // 动画结束后移除类
            element.classList.remove('number-changing');
        }
    }
    
    requestAnimationFrame(update);
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化计时器
    updateTimer();
    // 启动计时器定时更新
    setInterval(updateTimer, 1000);
    
    // 欢迎通知序列
    showWelcomeSequence();
});

// 欢迎通知序列优化
function showWelcomeSequence() {
    // 清空之前的通知队列
    notificationQueue = [];
    isShowingNotification = false;
    
    // 第一条通知
    setTimeout(() => {
        showNotification('欢迎来到 H&Z', 'success', 2500);
    }, 800);

    // 第二条通知
    setTimeout(() => {
        const days = getDaysSince('2022-08-19');
        showNotification(`我们已经相伴 ${days} 天啦`, 'info', 3000);
    }, 3500);

    // 第三条通知 - 从API获取问候语
    setTimeout(async () => {
        try {
            const response = await fetch('https://api.kuleu.com/api/getGreetingMessage?type=json');
            const data = await response.json();
            
            if (data.code === 200 && data.data) {
                // 组合API返回的问候语和提示
                const greeting = `${data.data.greeting}，${data.data.tip}`;
                showNotification(greeting, 'love', 3500);
            } else {
                // 如果API调用失败，使用默认消息
                showNotification('愿时光待你我温柔 ❤️', 'love', 3500);
            }
        } catch (error) {
            console.error('获取问候语失败:', error);
            // 发生错误时使用默认消息
            showNotification('愿时光待你我温柔 ❤️', 'love', 3500);
        }
    }, 6800);
}

// 获取相恋天数
function getDaysSince(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// 子页面控制
function openSubPage(title, callback) {
    const subPage = document.getElementById('sub-page');
    const pageTitle = subPage.querySelector('h2');
    const pageBody = subPage.querySelector('.page-body');
    
    // 重置页面内容
    pageBody.innerHTML = '';
    showLoading(pageBody);
    pageTitle.textContent = title;
    
    // 显示子页面
    subPage.classList.add('active');
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleEscKey);
    
    // 添加背景点击事件
    subPage.addEventListener('click', handleBackgroundClick);
    
    // 执行回调
    if (callback) {
        try {
            callback();
        } catch (error) {
            console.error('页面加载失败:', error);
            showError(pageBody, '内容加载失败');
        }
    }
}

// 处理ESC键
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeSubPage();
    }
}

// 处理背景点击
function handleBackgroundClick(e) {
    // 如果点击的是背景而不是内容区域
    if (e.target.classList.contains('sub-page')) {
        closeSubPage();
    }
}

function closeSubPage() {
    const subPage = document.getElementById('sub-page');
    
    // 移除事件监听
    document.removeEventListener('keydown', handleEscKey);
    subPage.removeEventListener('click', handleBackgroundClick);
    
    // 添加关闭动画
    subPage.style.opacity = '0';
    subPage.querySelector('.sub-page-content').style.transform = 'scale(0.95)';
    
    // 动画结束后移除激活状态
    setTimeout(() => {
        subPage.classList.remove('active');
        subPage.style.opacity = '';
        subPage.querySelector('.sub-page-content').style.transform = '';
        
        // 清空内容
        const pageBody = subPage.querySelector('.page-body');
        if (pageBody) {
            pageBody.innerHTML = '';
        }
    }, 300);
}

// 加载状态
function showLoading(container) {
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">
                <span class="dot-animation">正在加载</span>
            </div>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-container">
            <div class="error-icon">😢</div>
            <p class="error-message">${message}</p>
            <button class="retry-btn" onclick="location.reload()">重试</button>
        </div>
    `;
}

// 情话功能
async function fetchAndShowLoveWords() {
    const pageBody = document.querySelector('.page-body');
    
    try {
        const response = await fetch('https://api.kuleu.com/api/getGreetingMessage?type=json');
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            // 组合API返回的问候语和提示
            const greeting = `${data.data.greeting}，${data.data.tip}`;
            pageBody.innerHTML = `
                <div class="love-words-container">
                    <div class="love-words-card">
                        <div class="love-words-content">
                            <p>${greeting}</p>
                        </div>
                        <button class="refresh-btn" onclick="fetchAndShowLoveWords()">
                            <span class="btn-icon">💝</span>
                            <span>再来一句</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            throw new Error('获取情话失败');
        }
    } catch (error) {
        console.error('API请求失败:', error);
        showError(pageBody, '获取情话失败，请稍后重试');
    }
}

// 美食���能
async function fetchAndShowFoodList() {
    const pageBody = document.querySelector('.page-body');
    
    pageBody.innerHTML = `
        <div class="search-container">
            <div class="search-box">
                <input type="text" id="food-search" placeholder="输入美食名称，开启美味之旅..." />
                <button onclick="searchFood()" class="search-btn">
                    <span class="btn-icon">🔍</span>
                    <span>搜索</span>
                </button>
            </div>
        </div>
        <div id="search-results" class="search-results">
            <div class="welcome-message">
                <p>探索美食世界</p>
                <p class="tip">输入食物名称，发现更多美味</p>
            </div>
        </div>
    `;
    
    // 添加回车搜索
    const searchInput = document.getElementById('food-search');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchFood();
        }
    });
}

async function searchFood() {
    const searchInput = document.getElementById('food-search');
    const resultsContainer = document.getElementById('search-results');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showNotification('请输入搜索关键词', 'warning');
        return;
    }
    
    showLoading(resultsContainer);
    
    try {
        const response = await fetch(`https://api.example.com/food/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.success) {
            displaySearchResults(data.results);
        } else {
            throw new Error(data.message || '搜索失败');
        }
    } catch (error) {
        console.error('搜索失败:', error);
        showError(resultsContainer, '搜索失败,请稍后重试');
    }
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    
    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>未找到相关美食</p>
                <p class="tip">换关键词试试吧</p>
            </div>
        `;
        return;
    }
    
    const resultsHtml = results.map(food => `
        <div class="food-card" onclick="showFoodDetail('${food.id}')">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p class="food-desc">${food.description}</p>
            </div>
            <div class="food-meta">
                <span class="calorie">${food.calorie}千卡/100g</span>
                <span class="view-detail">查看详情 →</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="results-grid">
            ${resultsHtml}
        </div>
    `;
}

// 显示敬请期待提示
function showComingSoon(title) {
    const pageBody = document.querySelector('.page-body');
    pageBody.innerHTML = `
        <div class="coming-soon-container">
            <div class="coming-soon-content">
                <div class="coming-soon-icon">✨</div>
                <h3>${title}</h3>
                <p>功能开发中，敬请期待～</p>
                <div class="development-progress">
                    <div class="progress-bar">
                        <div class="progress-value"></div>
                    </div>
                    <span class="progress-text">开发进度 30%</span>
                </div>
            </div>
        </div>
    `;
}

// 更新各个功能的处理函数
function showPhotoAlbum() {
    showComingSoon('纪念相册');
}

function showTravelMap() {
    showComingSoon('旅行地图');
}

function showWishList() {
    showComingSoon('心愿清单');
}

function showMemoryCalendar() {
    showComingSoon('纪念日历');
}

function showMusicPlayer() {
    showComingSoon('音乐播放器');
}

function showMessageBoard() {
    showComingSoon('留言板');
}

// 显示通知历史面板
function toggleNotificationHistory() {
    const existingPanel = document.getElementById('notification-history-panel');
    
    if (existingPanel) {
        existingPanel.remove();
        return;
    }
    
    const panel = document.createElement('div');
    panel.id = 'notification-history-panel';
    panel.className = 'notification-history-panel glass-card';
    
    const header = document.createElement('div');
    header.className = 'history-header';
    header.innerHTML = `
        <h3>通知记录</h3>
        <button class="clear-history" onclick="clearNotificationHistory()">清空</button>
    `;
    
    const content = document.createElement('div');
    content.className = 'history-content';
    
    if (notificationHistory.length === 0) {
        content.innerHTML = '<div class="no-history">暂无通知记录</div>';
    } else {
        content.innerHTML = notificationHistory.map(notification => `
            <div class="history-item ${notification.type}">
                <span class="history-icon">${getNotificationIcon(notification.type)}</span>
                <div class="history-info">
                    <div class="history-message">${notification.message}</div>
                    <div class="history-time">${formatTime(notification.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }
    
    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);
    
    // 点击外部关闭面板
    setTimeout(() => {
        document.addEventListener('click', closeHistoryPanelOnClickOutside);
    }, 100);
}

// 点击外部关闭面板
function closeHistoryPanelOnClickOutside(e) {
    const panel = document.getElementById('notification-history-panel');
    const bell = document.querySelector('.nav-btn');
    
    if (panel && !panel.contains(e.target) && !bell.contains(e.target)) {
        panel.remove();
        document.removeEventListener('click', closeHistoryPanelOnClickOutside);
    }
}

// 格式化时间函数
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 小于1分钟
        return '刚刚';
    } else if (diff < 3600000) { // 小于1小时
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 小于24小时
        return `${Math.floor(diff / 3600000)}小时前`;
    } else {
        return date.toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
}

// 清空通知历史
function clearNotificationHistory() {
    notificationHistory = [];
    toggleNotificationHistory(); // 重新打开面板显示空状态
}

