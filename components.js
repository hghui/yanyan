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
    if (!pageBody) return;

    showLoading(pageBody, '正在加载...');

    try {
        // 显示搜索界面
        pageBody.innerHTML = `
            <div class="search-container">
                <input type="text" id="food-search" placeholder="搜索美食..." class="search-input">
                <button onclick="searchFood()" class="search-btn">搜索</button>
            </div>
            <div id="food-results" class="food-results">
                <div class="welcome-message">
                    <p>欢迎使用美食百科</p>
                    <p class="tip">输入食物名称开始搜索，例如：苹果、米饭、牛肉...</p>
                </div>
            </div>
        `;

        // 添加回车搜索功能
        const searchInput = document.getElementById('food-search');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchFood();
            }
        });
    } catch (error) {
        console.error('初始化失败:', error);
        showNotification('加载失败，请重试', 3000, 'error');
    }
}

let isSearching = false;
async function searchFood() {
    const searchInput = document.getElementById('food-search');
    const searchTerm = searchInput.value.trim();
    const foodResults = document.getElementById('food-results');
    
    if (!searchTerm) {
        showNotification('请输入搜索关键词');
        return;
    }

    showLoading(foodResults, '正在搜索美食...');
    
    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://www.mxnzp.com/api/food_heat/food/search?keyword=${encodeURIComponent(searchTerm)}&page=1&limit=10&app_id=lfjqxgttlgqeokjr&app_secret=qbNUu3JhZJUrXW7oSU9KJsD3nDoFKk7K`;
        
        const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
        const data = await response.json();
        
        if (data.code === 1) {
            displayFoodResults(data.data.list);
        } else {
            throw new Error(data.msg || '搜索失败');
        }
    } catch (error) {
        foodResults.innerHTML = `
            <div class="error-message">
                <p>搜索失败</p>
                <p class="error-detail">${error.message}</p>
                <button class="glass-btn" onclick="searchFood()">重试</button>
            </div>
        `;
        showNotification('搜索失败，请稍后重试', 3000, 'error');
        console.error('搜索出错:', error);
    }
}

function displayFoodResults(results) {
    const foodResults = document.getElementById('food-results');
    
    if (!results || results.length === 0) {
        foodResults.innerHTML = `
            <div class="no-results">
                <p>未找到相关美食</p>
                <p class="suggestion">试试其他关键词，例如：苹果、米饭、牛肉...</p>
            </div>
        `;
        return;
    }

    const resultsHtml = results.map(food => `
        <div class="food-item glass-card" onclick="showFoodDetail('${food.foodId}')">
            <div class="food-item-header">
                <h3>${food.name}</h3>
                <span class="calory">${food.calory || '0'} 千卡/100g</span>
            </div>
            <div class="food-item-nutrients">
                <!-- 健康等级 健康等级 1 2 3 分别是推荐 适量 少 -->
                <span class="nutrient">健康等级: ${food.healthLevel || '0'}</span>
            </div>
            <div class="food-item-footer">
                <span class="view-detail">点击查看详情 →</span>
            </div>
        </div>
    `).join('');
    
    foodResults.innerHTML = resultsHtml;
}

// 修改通用信息窗组件
function showInfoDialog({ title, content, theme = 'default' }) {
    const dialog = document.createElement('div');
    dialog.className = `info-dialog-overlay ${theme}-theme`;
    dialog.innerHTML = `
        <div class="info-dialog glass-card">
            <div class="info-dialog-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeInfoDialog(this)">
                    <span>×</span>
                </button>
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

// 修改食物详情函数，添加触摸支持和响应式布局
async function showFoodDetail(foodId) {
    showInfoDialog({
        title: '食物详情',
        content: `
            <div class="detail-loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">获取详情中...</div>
            </div>
        `,
        theme: 'wiki'
    });

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://www.mxnzp.com/api/food_heat/food/details?foodId=${foodId}&app_id=lfjqxgttlgqeokjr&app_secret=qbNUu3JhZJUrXW7oSU9KJsD3nDoFKk7K`;
        
        const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
        const data = await response.json();
        console.log(data);
        if (data.code === 1) {
            const food = data.data;
            const dialog = document.querySelector('.info-dialog-content');
            if (dialog) {
                dialog.innerHTML = `
                    <div class="food-detail-content" id="foodDetailContent">
                        <!-- 内容模板保持不变 -->
                        ${createFoodDetailContent(food)}
                    </div>
                `;

                initTouchInteractions();
                initKeyboardNavigation();
                initScrollOptimization();
            }
        } else {
            throw new Error(data.msg || '获取失败');
        }
    } catch (error) {
        const dialog = document.querySelector('.info-dialog-content');
        if (dialog) {
            dialog.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">❌</div>
                    <div class="error-message">获取详情失败</div>
                    <button class="retry-button" onclick="showFoodDetail('${foodId}')">重试</button>
                </div>
            `;
        }
        showNotification('获取食物详情失败，请重试', 3000, 'error');
        console.error('获取详情失败:', error);
    }
}

// 创建食物详情内容模板
function createFoodDetailContent(food) {
    return `
        <!-- 基本信息区域 -->
        <div class="food-header">
            <div class="food-info">
                <h2 class="food-title">${food.name}</h2>
                <div class="food-meta">
                    <span class="health-tag">${getHealthTag(food.healthLight)}</span>
                    <span class="health-tips">${food.healthTips || ''}</span>
                </div>
            </div>
            <div class="calory-display">
                <div class="energy-info">
                    <div class="calory-value">${food.calory || '0'}</div>
                    <div class="calory-unit">${food.caloryUnit || '千卡/100g'}</div>
                </div>
                <div class="joule-info">
                    <div class="joule-value">${food.joule || '0'}</div>
                    <div class="joule-unit">${food.jouleUnit || '千焦/100g'}</div>
                </div>
            </div>
        </div>

        <!-- 主要营养成分 -->
        <div class="main-nutrition">
            <div class="nutrition-card">
                <div class="nutrition-value">${food.protein || '0'}</div>
                <div class="nutrition-name">蛋白质</div>
                <div class="nutrition-unit">${food.proteinUnit || 'g/100g'}</div>
            </div>
            <div class="nutrition-card">
                <div class="nutrition-value">${food.fat || '0'}</div>
                <div class="nutrition-name">脂肪</div>
                <div class="nutrition-unit">${food.fatUnit || 'g/100g'}</div>
            </div>
            <div class="nutrition-card">
                <div class="nutrition-value">${food.carbohydrate || '0'}</div>
                <div class="nutrition-name">碳水化合物</div>
                <div class="nutrition-unit">${food.carbohydrateUnit || 'g/100g'}</div>
            </div>
            <div class="nutrition-card">
                <div class="nutrition-value">${food.fiberDietary || '0'}</div>
                <div class="nutrition-name">膳食纤维</div>
                <div class="nutrition-unit">${food.fiberDietaryUnit || 'g/100g'}</div>
            </div>
        </div>

        <!-- 脂肪详情 -->
        <div class="fat-details">
            <h3 class="section-title">脂肪详情</h3>
            <div class="fat-grid">
                ${createFatDetails(food)}
            </div>
        </div>

        <!-- 维生素详情 -->
        <div class="vitamin-details">
            <h3 class="section-title">维生素含量</h3>
            <div class="vitamin-grid">
                ${createVitaminDetails(food)}
            </div>
        </div>

        <!-- 矿物质详情 -->
        <div class="mineral-details">
            <h3 class="section-title">矿物质含量</h3>
            <div class="mineral-grid">
                ${createMineralDetails(food)}
            </div>
        </div>

        <!-- 血糖指数信息 -->
        ${food.glycemicInfoData ? `
            <div class="glycemic-info">
                <h3 class="section-title">血糖生成指数</h3>
                <div class="glycemic-grid">
                    <div class="glycemic-item">
                        <div class="glycemic-header">GI值</div>
                        <div class="glycemic-value">${food.glycemicInfoData.gi.value || '0'}</div>
                        <div class="glycemic-label">${food.glycemicInfoData.gi.label || '-'}</div>
                    </div>
                    <div class="glycemic-item">
                        <div class="glycemic-header">GL值</div>
                        <div class="glycemic-value">${food.glycemicInfoData.gl.value || '0'}</div>
                        <div class="glycemic-label">${food.glycemicInfoData.gl.label || '-'}</div>
                    </div>
                </div>
            </div>
        ` : ''}

        <!-- 健康建议 -->
        ${food.healthSuggest ? `
            <div class="health-advice">
                <h3 class="section-title">健康建议</h3>
                <div class="advice-content">${food.healthSuggest}</div>
            </div>
        ` : ''}
    `;
}

// 辅助函数：获取健康标签文本
function getHealthTag(healthLight) {
    switch (healthLight) {
        case 1:
            return '推荐食用';
        case 2:
            return '适量食用';
        case 3:
            return '少量食用';
        default:
            return '暂无建议';
    }
}

// 创建脂肪详情展示
function createFatDetails(food) {
    const fatTypes = [
        { label: '饱和脂肪', value: food.saturatedFat, unit: food.saturatedFatUnit },
        { label: '反式脂肪', value: food.fattyAcid, unit: food.fattyAcidUnit },
        { label: '单不饱和脂肪', value: food.mufa, unit: food.mufaUnit },
        { label: '多不饱和脂肪', value: food.pufa, unit: food.pufaUnit },
        { label: '胆固醇', value: food.cholesterol, unit: food.cholesterolUnit }
    ];

    return fatTypes.map(fat => {
        if (!fat.value || fat.value === '0') return '';
        return `
            <div class="detail-item">
                <div class="detail-label">${fat.label}</div>
                <div class="detail-value">${fat.value}${fat.unit || ''}</div>
            </div>
        `;
    }).join('');
}

// 创建维生素详情展示
function createVitaminDetails(food) {
    const vitamins = [
        { label: '维生素A', value: food.vitaminA, unit: food.vitaminAUnit },
        { label: '维生素C', value: food.vitaminC, unit: food.vitaminCUnit },
        { label: '维生素D', value: food.vitaminD, unit: food.vitaminDUnit },
        { label: '维生素E', value: food.vitaminE, unit: food.vitaminEUnit },
        { label: '维生素K', value: food.vitaminK, unit: food.vitaminKUnit },
        { label: '维生素B1', value: food.thiamine, unit: food.thiamineUnit },
        { label: '维生素B2', value: food.lactoflavin, unit: food.lactoflavinUnit },
        { label: '维生素B6', value: food.vitaminB6, unit: food.vitaminB6Unit },
        { label: '维生素B12', value: food.vitaminB12, unit: food.vitaminB12Unit },
        { label: '烟酸', value: food.niacin, unit: food.niacinUnit },
        { label: '叶酸', value: food.folacin, unit: food.folacinUnit }
    ];

    return vitamins.map(vitamin => {
        if (!vitamin.value || vitamin.value === '0') return '';
        return `
            <div class="detail-item">
                <div class="detail-label">${vitamin.label}</div>
                <div class="detail-value">${vitamin.value}${vitamin.unit || ''}</div>
            </div>
        `;
    }).join('');
}

// 创建矿物质详情展示
function createMineralDetails(food) {
    const minerals = [
        { label: '钙', value: food.calcium, unit: food.calciumUnit },
        { label: '铁', value: food.iron, unit: food.ironUnit },
        { label: '锌', value: food.zinc, unit: food.zincUnit },
        { label: '磷', value: food.phosphor, unit: food.phosphorUnit },
        { label: '钾', value: food.kalium, unit: food.kaliumUnit },
        { label: '镁', value: food.magnesium, unit: food.magnesiumUnit },
        { label: '硒', value: food.selenium, unit: food.seleniumUnit },
        { label: '铜', value: food.copper, unit: food.copperUnit },
        { label: '锰', value: food.manganese, unit: food.manganeseUnit },
        { label: '碘', value: food.iodine, unit: food.iodineUnit }
    ];

    return minerals.map(mineral => {
        if (!mineral.value || mineral.value === '0') return '';
        return `
            <div class="detail-item">
                <div class="detail-label">${mineral.label}</div>
                <div class="detail-value">${mineral.value}${mineral.unit || ''}</div>
            </div>
        `;
    }).join('');
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
        <div class="timer-split-layout">
            <!-- 左侧计时器 -->
            <div class="timer-panel">
                
                <div class="days-counter">
                    <span class="days-number">${days}</span>
                    <span class="days-label">天</span>
                </div>
                
                <div class="time-grid">
                    <div class="time-item">
                        <span class="time-number">${hours}</span>
                        <span class="time-label">小时</span>
                    </div>
                    <div class="time-item">
                        <span class="time-number">${minutes}</span>
                        <span class="time-label">分钟</span>
                    </div>
                    <div class="time-item">
                        <span class="time-number">${seconds}</span>
                        <span class="time-label">秒</span>
                    </div>
                </div>
            </div>

            <!-- 右侧文案 -->
            <div class="message-panel">
                <div class="message-header">
                    <span class="message-icon">💌</span>
                    <h3>爱的时光</h3>
                </div>
                
                <div class="message-content">
                    <div class="start-date">
                        <span class="date-label">开始于</span>
                        <span class="date">2022年8月19日</span>
                    </div>
                    
                    <div class="love-quote">
                        <p>愿时光待你我温柔</p>
                        <p>未来的每一天都充满爱与幸福</p>
                    </div>
                </div>
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
function showLoading(container, text = '加载中...') {
    // 创建随机数量的粒子
    const particles = Array.from({ length: 8 }, (_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return `<div class="particle" style="left: ${left}%; top: ${top}%;"></div>`;
    }).join('');

    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-particles">
                ${particles}
            </div>
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
    showNotification('病症搜索功能敬请期待 (��∀✧)', 3000, 'info');
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

// 初始化触摸交互
function initTouchInteractions() {
    const content = document.getElementById('foodDetailContent');
    if (!content) return;

    // 添加触摸反馈
    const touchElements = content.querySelectorAll('.nutrition-card, .glycemic-item, .nutrition-group, .food-description');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        element.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });

    // 支持触摸滑动
    let startY = 0;
    content.addEventListener('touchstart', function(e) {
        startY = e.touches[0].pageY;
    }, { passive: true });

    content.addEventListener('touchmove', function(e) {
        const deltaY = e.touches[0].pageY - startY;
        if (Math.abs(deltaY) > 5) {
            // 允许自然滚动
            e.stopPropagation();
        }
    }, { passive: true });
}

// 初始化键盘导航
function initKeyboardNavigation() {
    const focusableElements = document.querySelectorAll('[tabindex="0"]');
    focusableElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                element.click();
            }
        });
    });
}

// 初始化滚动优化
function initScrollOptimization() {
    const content = document.getElementById('foodDetailContent');
    if (!content) return;

    // 使用 Intersection Observer 优化滚动性能
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: content,
        threshold: 0.1
    });

    // 观察所有可滚动内容
    const elements = content.querySelectorAll('.nutrition-card, .glycemic-item, .nutrition-group, .food-description');
    elements.forEach(element => observer.observe(element));

    // 优化滚动性能
    let scrollTimeout;
    content.addEventListener('scroll', () => {
        if (!content.classList.contains('scrolling')) {
            content.classList.add('scrolling');
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            content.classList.remove('scrolling');
        }, 150);
    }, { passive: true });
}

