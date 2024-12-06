function showNotification(message, duration = 3000, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // 触发重排以启动动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// 弹窗系统
function showDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.classList.add('active');

    // 添加点击外部关闭
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeDialog(dialogId);
        }
    });
}

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.classList.remove('active');
}

// 按钮点击波纹效果
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.glass-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// API 集成示例
class APIService {
    static async fetch(url, options = {}) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        } catch (error) {
            showNotification('API 请求失败: ' + error.message, 5000);
            throw error;
        }
    }
}

// 使用示例：
// APIService.fetch('https://api.example.com/data')
//     .then(data => {
//         showDialog('custom-dialog');
//         // 处理数据...
//     })
//     .catch(error => {
//         showNotification(error.message);
//     }); 

// 子页面系统
function openSubPage(title, contentCallback, pageId = 'sub-page') {
    let subPage = document.getElementById(pageId);

    // 重置子页面状态
    subPage.classList.remove('active');
    const contentBody = subPage.querySelector('.sub-page-body');
    if (contentBody) {
        contentBody.innerHTML = '';
    }

    // 设置标题
    const titleElement = subPage.querySelector('h2');
    titleElement.textContent = title;

    // 移除所有旧的事件监听器
    const newSubPage = subPage.cloneNode(true);
    subPage.parentNode.replaceChild(newSubPage, subPage);
    subPage = newSubPage;

    // 添加新的事件监听器
    subPage.addEventListener('click', (e) => {
        if (e.target === subPage) {
            closeSubPage(pageId);
        }
    });

    // 显示子页面
    subPage.classList.add('active');

    // 延迟执行回调，确保 DOM 已更新
    if (contentCallback) {
        requestAnimationFrame(() => {
            contentCallback();
        });
    }
}

function closeSubPage(pageId = 'sub-page') {
    const subPage = document.getElementById(pageId);
    subPage.classList.remove('active');
}

// 修改情话 API 集成
async function fetchAndShowLoveWords() {
    const pageBody = document.getElementById('love-page-body');
    if (!pageBody) return;

    showLoading(pageBody, '正在寻找浪漫的话语...', 'love-theme');

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const response = await fetch(corsProxy + encodeURIComponent('https://api.lovelive.tools/api/SweetNothings'), {
            cache: 'no-store' // 禁用缓存，确保每次都获取新数据
        });
        const text = await response.text();

        const currentPageBody = document.getElementById('love-page-body');
        if (!currentPageBody) return;

        if (text) {
            console.log('新获取的情话:', text);
            const content = `
                <div class="love-words">
                    <div class="floating-bubbles">
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                    </div>
                    <p class="content">${text}</p>
                    <p class="from">——来自心动的絮语</p>
                </div>
                <div class="button-wrapper">
                    <button class="refresh-btn">
                        <div class="btn-content">
                            <span class="heart-icon">♥</span>
                            <span>再来一句</span>
                        </div>
                    </button>
                </div>
            `;
            currentPageBody.innerHTML = content;

            // 重新绑定按钮事件
            const refreshBtn = currentPageBody.querySelector('.refresh-btn');
            if (refreshBtn) {
                const clickHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fetchAndShowLoveWords();
                };
                refreshBtn.removeEventListener('click', clickHandler);
                refreshBtn.addEventListener('click', clickHandler);
            }
        } else {
            throw new Error('获取情话失败');
        }
    } catch (error) {
        const currentPageBody = document.getElementById('love-page-body');
        if (!currentPageBody) return;

        currentPageBody.innerHTML = `
            <div class="error">
                <p>暂时无法获取浪漫情话</p>
                <button class="glass-btn pink-btn refresh-btn" style="margin-top: 1rem;">
                    重试
                </button>
            </div>
        `;

        const retryBtn = currentPageBody.querySelector('.refresh-btn');
        if (retryBtn) {
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                fetchAndShowLoveWords();
            };
            retryBtn.removeEventListener('click', clickHandler);
            retryBtn.addEventListener('click', clickHandler);
        }
        console.error('情话 API 错误:', error);
        showNotification('获取情话失败: ' + error.message, 3000, 'error');
    }
}

// 修改现有的 DOMContentLoaded 事件处理器，添加情话欢迎语
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://v1.hitokoto.cn/?c=i&c=d&c=k');
        const data = await response.json();

        if (data.id) {
            setTimeout(() => {
                showNotification('欢迎来到 H&Z', 3000, 'success');
                setTimeout(() => {
                    showNotification(data.hitokoto, 5000, 'info');
                }, 3500);
            }, 1000);
        }
    } catch (error) {
        console.error('API请求失败:', error);
        showNotification('欢迎来到 H&Z', 3000, 'success');
    }
});

// 添加子页面内容的样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .daily-words {
        text-align: center;
        padding: 2rem;
    }
    
    .daily-words .quote {
        font-size: 1.5rem;
        line-height: 1.8;
        margin-bottom: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .daily-words .author {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 1rem;
    }
    
    .daily-words .date {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .error {
        text-align: center;
        padding: 2rem;
        color: rgba(255, 182, 193, 0.7);
    }
`;
document.head.appendChild(styleSheet);

// 百科 API 集成
async function fetchAndShowFoodList() {
    const pageBody = document.getElementById('wiki-page-body');

    // 创建搜索界面
    const searchUI = `
        <div class="search-container">
            <div class="search-tabs">
                <button class="tab-btn active" data-tab="food">
                    <span class="tab-icon">🍽️</span>
                    美食搜索
                </button>
                <button class="tab-btn" data-tab="disease">
                    <span class="tab-icon">💊</span>
                    病症搜索
                </button>
            </div>
            <div id="foodSearch" class="search-panel active">
                <div class="search-box">
                    <input type="text" class="search-input" placeholder="输入食物名称..." />
                    <button class="wiki-search-btn" onclick="searchFood(1)">
                        <span class="wiki-icon">🔍</span>
                        <span>搜索</span>
                    </button>
                </div>
            </div>
            <div id="diseaseSearch" class="search-panel">
                <div class="search-box">
                    <input type="text" class="search-input" placeholder="输入病症名称..." />
                    <button class="wiki-search-btn" onclick="showComingSoon()">
                        <span class="wiki-icon">🔍</span>
                        <span>搜索</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="searchResults" class="food-list"></div>
        <div id="loadingMore" class="loading-more" style="display: none;">
            <div class="loading-spinner"></div>
            <span>加载更多...</span>
        </div>
    `;

    pageBody.innerHTML = searchUI;

    // 添加鼠标移动效果
    const searchBtns = pageBody.querySelectorAll('.wiki-search-btn');
    searchBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--mouse-x', `${x}px`);
            btn.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 添加输入监听
    const searchBoxes = pageBody.querySelectorAll('.search-box');
    searchBoxes.forEach(box => {
        const input = box.querySelector('.search-input');
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                box.classList.add('has-content');
            } else {
                box.classList.remove('has-content');
            }
        });
    });

    // 添加标签切换事件
    const tabs = pageBody.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            const panels = pageBody.querySelectorAll('.search-panel');
            panels.forEach(p => p.classList.remove('active'));

            // 添加当前活动状态
            tab.classList.add('active');
            const targetPanel = document.getElementById(`${tab.dataset.tab}Search`);
            targetPanel.classList.add('active');

            // 清空搜索结果
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';
            const loadingMore = document.getElementById('loadingMore');
            loadingMore.style.display = 'none';
        });
    });

    // 添加入框回车事件
    const foodInput = pageBody.querySelector('#foodSearch .search-input');
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchFood(1);
        }
    });

    // 添加滚动加载
    pageBody.addEventListener('scroll', () => {
        const loadingMore = document.getElementById('loadingMore');
        if (!loadingMore || loadingMore.style.display === 'none') return;

        const scrollPosition = pageBody.scrollTop + pageBody.clientHeight;
        const scrollHeight = pageBody.scrollHeight;

        if (scrollPosition >= scrollHeight - 100) {
            const currentPage = parseInt(pageBody.dataset.currentPage || '1');
            searchFood(currentPage + 1);
        }
    });
}

let isSearching = false;
async function searchFood(page = 1) {
    if (isSearching) return;

    const searchInput = document.getElementById('foodSearch');
    const resultsContainer = document.getElementById('searchResults');
    const loadingMore = document.getElementById('loadingMore');
    const keyword = searchInput.value.trim();

    if (!keyword) {
        showNotification('请输入食物名称', 3000, 'info');
        return;
    }

    if (page === 1) {
        showLoading(resultsContainer, '正在搜索...', 'wiki-theme');
    }

    isSearching = true;

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://www.mxnzp.com/api/food_heat/food/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=3&app_id=lfjqxgttlgqeokjr&app_secret=qbNUu3JhZJUrXW7oSU9KJsD3nDoFKk7K`;

        const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
        const data = await response.json();
        if (data.code === 1) {
            if (page === 1) {
                resultsContainer.innerHTML = '';
            }

            if (data.data.list.length === 0 && page === 1) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <p>未找到"${keyword}"相关的食物</p>
                        <p class="suggestion">试试其他关键词比如"苹果"、"米饭"等</p>
                    </div>
                `;
                loadingMore.style.display = 'none';
                return;
            }

            data.data.list.forEach(food => {
                const foodItem = document.createElement('div');
                foodItem.className = 'food-item glass-card';
                foodItem.innerHTML = `
                    <div class="food-item-content">
                        <h3>${food.name}</h3>
                        <div class="food-info">
                            <span class="food-calory">🔥 ${food.calory || '暂无'} 千卡/100g</span>
                            <span class="food-view">点击查看详情 →</span>
                        </div>
                    </div>
                `;
                foodItem.onclick = () => showFoodDetail(food.foodId);
                resultsContainer.appendChild(foodItem);
            });

            const pageBody = document.getElementById('wiki-page-body');
            pageBody.dataset.currentPage = page.toString();

            // 更新加载更多状态
            if (data.data.list.length === 3) {
                loadingMore.style.display = 'flex';
                loadingMore.classList.remove('loading-complete');
            } else {
                loadingMore.classList.add('loading-complete');
                loadingMore.innerHTML = `
                    <div class="loading-end">
                        <span class="end-line"></span>
                        <span class="end-text">已经到底啦</span>
                        <span class="end-line"></span>
                    </div>
                `;
            }
        } else {
            throw new Error(data.msg || '搜索失败');
        }
    } catch (error) {
        if (page === 1) {
            resultsContainer.innerHTML = `
                <div class="error">
                    <p>抱歉，搜索遇到了问题</p>
                    <p class="error-detail">${error.message}</p>
                    <button class="glass-btn blue-btn" onclick="searchFood(1)">
                        <span class="retry-icon">🔄</span>
                        重新搜索
                    </button>
                </div>
            `;
        }
        showNotification('搜索失败，请重试', 3000, 'error');
        console.error('搜索失败:', error);
    } finally {
        isSearching = false;
    }
}
// 修改通用信息窗组件
function showInfoDialog({ title, content, theme = 'default' }) {
    const dialog = document.createElement('div');
    dialog.className = `info-dialog-overlay ${theme}-theme`;
    dialog.innerHTML = `
        <div class="info-dialog glass-card">
            <div class="info-dialog-header">
                <h3>${title}</h3>
                <button class="glass-btn close-btn" onclick="closeInfoDialog(this)">×</button>
            </div>
            <div class="info-dialog-content">
                ${content}
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    setTimeout(() => dialog.classList.add('active'), 10);
}

function closeInfoDialog(btn) {
    const dialog = btn.closest('.info-dialog-overlay');
    dialog.classList.remove('active');
    setTimeout(() => dialog.remove(), 300);
}

// 修改食物详情函数
async function showFoodDetail(foodId) {
    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://www.mxnzp.com/api/food_heat/food/details?foodId=${foodId}&app_id=lfjqxgttlgqeokjr&app_secret=qbNUu3JhZJUrXW7oSU9KJsD3nDoFKk7K`;

        const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
        const data = await response.json();

        if (data.code === 1 && data.data) {
            const food = data.data;
            showInfoDialog({
                title: food.name,
                content: `
                    <div class="food-detail-container">
                        <div class="food-header">
                            <span class="food-icon">🍽️</span>
                            <div class="food-calory-big">
                                <span class="number">${food.calory || '0'}</span>
                                <span class="unit">千卡/100g</span>
                            </div>
                        </div>
                        
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <div class="nutrition-icon">🥩</div>
                                <div class="nutrition-data">
                                    <span class="value">${food.protein || '0'}<small>g</small></span>
                                    <span class="label">蛋白质</span>
                                </div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-icon">🥑</div>
                                <div class="nutrition-data">
                                    <span class="value">${food.fat || '0'}<small>g</small></span>
                                    <span class="label">脂肪</span>
                                </div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-icon">🍚</div>
                                <div class="nutrition-data">
                                    <span class="value">${food.carbohydrate || '0'}<small>g</small></span>
                                    <span class="label">碳水化合物</span>
                                </div>
                            </div>
                        </div>

                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-header">
                                    <span class="detail-icon">🥗</span>
                                    <h4>膳食纤维</h4>
                                </div>
                                <p>${food.fiber || '暂无数据'} g</p>
                            </div>
                            <div class="detail-item">
                                <div class="detail-header">
                                    <span class="detail-icon">🥕</span>
                                    <h4>维生素A</h4>
                                </div>
                                <p>${food.vitaminA || '暂无数据'}</p>
                            </div>
                        </div>

                        ${food.description ? `
                            <div class="food-description">
                                <div class="description-header">
                                    <span class="description-icon">📝</span>
                                    <h4>食物简介</h4>
                                </div>
                                <p>${food.description}</p>
                            </div>
                        ` : ''}
                    </div>
                `,
                theme: 'wiki'
            });
        } else {
            throw new Error(data.msg || '获取情失败');
        }
    } catch (error) {
        showNotification('获取食物详情失败，请重试', 3000, 'error');
        console.error('获取详情失败:', error);
    }
}

// 添加 Logo 点击/悬浮事件
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo-container');
    let timer;

    // 悬浮显示计时器
    logo.addEventListener('mouseenter', () => {
        timer = setTimeout(() => {
            const content = getLoveTimerContent();
            showDialog({
                title: '我们的时光',
                content: content,
                theme: 'love'
            });
        }, 500);
    });

    logo.addEventListener('mouseleave', () => {
        clearTimeout(timer);
    });

    // 点击立即显示计时器
    logo.addEventListener('click', () => {
        clearTimeout(timer);
        const content = getLoveTimerContent();
        showDialog({
            title: '我们的时光',
            content: content,
            theme: 'love'
        });
    });
});

// 计时器内容生成函数
function getLoveTimerContent() {
    const startDate = new Date('2022-08-19T00:00:00');
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `
        <div class="timer-container">
            <div class="timer-header">
                <span class="timer-icon">💑</span>
                <p>在一起已经...</p>
            </div>
            <div class="timer-grid">
                <div class="timer-item">
                    <span class="timer-number">${days}</span>
                    <span class="timer-label">天</span>
                </div>
                <div class="timer-item">
                    <span class="timer-number">${hours}</span>
                    <span class="timer-label">小时</span>
                </div>
                <div class="timer-item">
                    <span class="timer-number">${minutes}</span>
                    <span class="timer-label">分钟</span>
                </div>
                <div class="timer-item">
                    <span class="timer-number">${seconds}</span>
                    <span class="timer-label">秒</span>
                </div>
            </div>
            <div class="timer-footer">
                <p>从 2022年8月19日 开始</p>
                <p class="timer-quote">愿时光待你我温柔，未来的每一天都充满爱与幸福</p>
            </div>
        </div>
    `;
}

// 通用弹窗函数
function showDialog({ title, content, theme = 'default' }) {
    const dialog = document.createElement('div');
    dialog.className = `dialog-overlay ${theme}-theme`;
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeDialog(this)">×</button>
            </div>
            <div class="dialog-body">
                ${content}
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    setTimeout(() => dialog.classList.add('active'), 10);
}

function closeDialog(btn) {
    const dialog = btn.closest('.dialog-overlay');
    dialog.classList.remove('active');
    setTimeout(() => dialog.remove(), 300);
}

// 添加通用加载状态组件
function showLoading(container, text = '加载中...', theme = '') {
    container.innerHTML = `
        <div class="loading-container ${theme}">
            <div class="loading-spinner"></div>
            <div class="loading-text">${text}</div>
        </div>
    `;
}

// 添加鼠标移光晕效果
function initLoveWordsEffect() {
    const container = document.querySelector('.love-words-content');
    if (!container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / container.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / container.clientHeight) * 100;

        container.style.setProperty('--mouse-x', `${x}%`);
        container.style.setProperty('--mouse-y', `${y}%`);

        // 3D 倾斜效果
        const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

        container.style.transform = `
            translateY(-5px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    });

    container.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
}

// 添加敬请期待提示函数
function showComingSoon() {
    showNotification('病症搜索功能敬请期待 (✧∀✧)', 3000, 'info');
}

// 创建再来一句按钮
function createRefreshButton() {
    const button = document.createElement('button');
    button.className = 'refresh-btn';

    const btnContent = document.createElement('div');
    btnContent.className = 'btn-content';

    const heartIcon = document.createElement('span');
    heartIcon.className = 'heart-icon';
    heartIcon.innerHTML = '♥';

    const text = document.createElement('span');
    text.textContent = '再来一句';

    btnContent.appendChild(heartIcon);
    btnContent.appendChild(text);
    button.appendChild(btnContent);

    // 添加鼠标移动效果
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
    });

    return button;
}

