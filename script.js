// 登録されたハッカーハウスのデータ
let registeredHouses = [];

// 登録された創設者のデータ
let registeredFounders = [];

// Sample hacker house data
const hackerHouses = [
    {
        name: "Tokyo Innovation Hub",
        location: "Shibuya, Tokyo",
        description: "A cutting-edge hacker house in the heart of Tokyo's startup district",
        features: ["24/7 Access", "High-speed WiFi", "Coworking Space"],
        image: "🏙️",
        region: "tokyo"
    },
    {
        name: "SF Tech House",
        location: "SOMA, San Francisco",
        description: "Premier tech house in the heart of Silicon Valley",
        features: ["VC Networking", "Mentor Program", "Investor Events"],
        image: "🌉",
        region: "sf"
    },
    {
        name: "NYC Creative Collective",
        location: "Brooklyn, New York",
        description: "Where creative founders gather to build the future",
        features: ["Art Studio", "Rooftop Terrace", "Subway Access"],
        image: "🗽",
        region: "nyc"
    }
];

// AIマッチングのシミュレーション
function simulateAIMatching(formData) {
    const { region, product } = formData;
    
    // 地域でフィルタリング + 空き状況チェック
    let matches = hackerHouses.filter(house => {
        // 地域マッチ
        if (house.region !== region) return false;
        
        // 空き状況チェック（シンプル）
        const capacity = parseInt(house.capacity || 10);
        const currentOccupancy = parseInt(house.currentOccupancy || 0);
        const availableSpots = capacity - currentOccupancy;
        
        return availableSpots > 0;
    });
    
    // 自己紹介の内容に基づいてスコアリング
    const introText = product.toLowerCase();
    
    // Technical keywords
    const techKeywords = ['ai', 'ml', 'app', 'web', 'blockchain', 'iot', 'coding', 'programming', 'engineer', 'development', 'software', 'tech', 'startup', 'build'];
    const techScore = techKeywords.filter(keyword => introText.includes(keyword)).length;
    
    // Experience keywords
    const experienceKeywords = ['university', 'college', 'hackathon', 'won', 'startup', 'founder', 'intern', 'project', 'experience', 'built', 'created', 'developed'];
    const experienceScore = experienceKeywords.filter(keyword => introText.includes(keyword)).length;
    
    // Passion keywords
    const passionKeywords = ['future', 'dream', 'goal', 'passion', 'challenge', 'innovation', 'change', 'create', 'build', 'revolutionize', 'impact'];
    const passionScore = passionKeywords.filter(keyword => introText.includes(keyword)).length;
    
    matches = matches.map(house => {
        // ベーススコア
        let baseScore = 50;
        
        // 技術スキルボーナス
        baseScore += techScore * 8;
        
        // 経験ボーナス
        baseScore += experienceScore * 6;
        
        // 情熱ボーナス
        baseScore += passionScore * 5;
        
        // 文字数ボーナス（詳細な自己紹介ほど高スコア）
        if (product.length > 100) baseScore += 10;
        else if (product.length > 50) baseScore += 5;
        
        // ランダム要素を追加
        const randomFactor = Math.random() * 15 - 7.5; // -7.5から+7.5
        
        return {
            ...house,
            matchScore: Math.min(Math.max(baseScore + randomFactor, 30), 98) // 30-98%の範囲
        };
    });
    
    return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// 日付とタイムゾーン機能
function updateTimezone() {
    const region = document.getElementById('region').value;
    const timezoneInfo = document.getElementById('timezoneInfo');
    
    if (region) {
        const currentTime = getCurrentTimeInRegion(region);
        timezoneInfo.textContent = `* Local time: ${currentTime}`;
        timezoneInfo.classList.remove('text-blue-600');
        timezoneInfo.classList.add('text-green-600');
    } else {
        timezoneInfo.textContent = '* Times shown in local timezone';
        timezoneInfo.classList.remove('text-green-600');
        timezoneInfo.classList.add('text-blue-600');
    }
}

// 地域の現在時刻を取得
function getCurrentTimeInRegion(region) {
    const timezoneMap = {
        'tokyo': 'Asia/Tokyo',
        'sf': 'America/Los_Angeles',
        'nyc': 'America/New_York',
        'london': 'Europe/London',
        'singapore': 'Asia/Singapore'
    };
    
    const timezone = timezoneMap[region];
    if (!timezone) return '';
    
    const now = new Date();
    return now.toLocaleString('ja-JP', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

// 滞在期間の計算と表示
function updateDurationDisplay() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const durationDisplay = document.getElementById('durationDisplay');
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end <= start) {
            durationDisplay.textContent = 'Duration: End date must be after start date';
            durationDisplay.classList.add('text-red-500');
            return false;
        }
        
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let durationText = `Duration: ${diffDays} days`;
        if (diffDays >= 7) {
            const weeks = Math.floor(diffDays / 7);
            const remainingDays = diffDays % 7;
            durationText += ` (${weeks} week${weeks > 1 ? 's' : ''}`;
            if (remainingDays > 0) {
                durationText += ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
            }
            durationText += ')';
        }
        
        durationDisplay.textContent = durationText;
        durationDisplay.classList.remove('text-red-500');
        return true;
    } else {
        durationDisplay.textContent = 'Duration: Please select dates';
        durationDisplay.classList.remove('text-red-500');
        return false;
    }
}

// 日付入力のイベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    const startDateInput = document.getElementById('appStartDate');
    const endDateInput = document.getElementById('appEndDate');
    
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', function() {
            endDateInput.min = this.value;
            updateDurationDisplay();
        });
        
        endDateInput.addEventListener('change', updateDurationDisplay);
    }
    
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('appAge').value);
            const termsAgreed = document.getElementById('termsAgreement').checked;
            
            if (!termsAgreed) {
                alert('You must agree to the Terms of Service to register.');
                return;
            }
            
            if (age < 18) {
                alert('Since you are under 18, you will need parental consent to apply. This feature is still being implemented.');
                return;
            }
            
            const formData = {
                gender: document.getElementById('appGender').value,
                name: document.getElementById('appName').value,
                email: document.getElementById('appEmail').value,
                age: document.getElementById('appAge').value,
                location: document.getElementById('appLocation').value,
                introduction: document.getElementById('appIntroduction').value,
                startDate: document.getElementById('appStartDate').value,
                endDate: document.getElementById('appEndDate').value
            };
            
            // フォームデータを保存
            window.currentFounderData = formData;
            
            // データをコンソールに表示
            console.log('Founder data:', formData);
            
            // フォームを非表示にして成功メッセージを表示
            applicationForm.style.display = 'none';
            document.getElementById('applicationSuccess').style.display = 'block';
            
            try {
                await submitApplication(formData);
            } catch (error) {
                console.error('Error submitting application:', error);
            }
        });
    }
    
    const houseForm = document.getElementById('houseForm');
    if (houseForm) {
        houseForm.addEventListener('submit', async function(e) {
            e.preventDefault();
             
            const formData = {
                name: document.getElementById('houseName').value,
                location: document.getElementById('houseLocation').value,
                email: document.getElementById('houseEmail').value,
                region: document.getElementById('houseRegion').value,
                description: document.getElementById('houseDescription').value,
                capacity: document.getElementById('houseCapacity').value
            };
            
            if (!formData.name || !formData.location || !formData.email || !formData.region || !formData.description || !formData.capacity) {
                alert('Please fill in all required fields');
                return;
            }
            
            try {
                // ハッカーハウスを登録
                await registerHackerHouse(formData);
            } catch (error) {
                console.error('Error registering house:', error);
            }
        });
    }
});

// Founder Application Functions
async function submitApplication(formData) {
    console.log('Submitting application:', formData);
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    document.getElementById('applicationForm').style.display = 'none';
    document.getElementById('applicationSuccess').style.display = 'block';
    
    // In a real implementation, you would send the application data to your backend here
    // For example, using fetch or axios to send a POST request
}

// House Registration Functions
async function registerHackerHouse(formData) {
    console.log('Registering hacker house:', formData);
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    document.getElementById('houseForm').style.display = 'none';
    document.getElementById('houseSuccess').style.display = 'block';
    
    // In a real implementation, you would send the house data to your backend here
    // For example, using fetch or axios to send a POST request
}

// Find My Matchボタンのイベントリスナー
document.getElementById('findMatchBtn').addEventListener('click', function() {
    if (window.currentFounderData) {
        showMatchingResults(window.currentFounderData);
    } else {
        alert('Please register as a founder first.');
    }
});

// ハッカーハウス一覧を表示
function showMatchingResults(formData) {
    document.getElementById('results').classList.remove('hidden');
    
    const allHouses = window.hackerHouses || [];
    
    const housesToShow = allHouses.length > 0 ? allHouses : [
        {
            name: "Sample House",
            location: "Tokyo, Japan",
            description: "Please register a hacker house first",
            capacity: 5,
            email: "sample@example.com"
        }
    ];
    
    const resultsContainer = document.getElementById('matches');
    
    resultsContainer.innerHTML = housesToShow.map(house => `
        <div class="simple-card p-6 mb-4">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold">${house.name}</h3>
                    <p class="text-sm">${house.location}</p>
                </div>
                <div class="text-right">
                    <div class="text-sm font-bold text-green-600">Available</div>
                    <div class="text-xs">${house.capacity} spots</div>
                </div>
            </div>
            <p class="text-sm mb-4">${house.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm">Capacity: ${house.capacity} founders</span>
                <button onclick="alert('Application sent to ${house.name}! They will contact you soon.')"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Apply Now
                </button>
            </div>
        </div>
    `).join('');
}

// ハッカーハウスへの申し込み
async function applyToHouse(houseName, founderDataStr) {
    const founderData = JSON.parse(founderDataStr);
    const start = new Date(founderData.startDate);
    const end = new Date(founderData.endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // ハウスの連絡先を取得
    const allHouses = [...hackerHouses, ...registeredHouses];
    const house = allHouses.find(h => h.name === houseName);
    const houseEmail = house ? house.email : 'contact@house.com';
    
    try {
        let parentalConsentId = null;
        
        // 未成年者の場合は親権者同意書を取得
        if (founderAge < 18) {
            // 親権者同意書が存在するかチェック
            if (!founderData.parentalConsentId) {
                alert('Parental consent is required for minors. Please complete the registration process first.');
                return;
            }
            
            parentalConsentId = founderData.parentalConsentId;
        }
        
        // マッチレコードを作成
        if (typeof SupabaseDB !== 'undefined') {
            await SupabaseDB.createMatch({
                founderId: Date.now(), // 実際の実装では適切なfounder IDを使用
                houseId: house.id || Date.now(),
                matchScore: 85, // 仮のスコア
                parentalConsentId
            });
            
            // メール通知を送信（エラーが出ても処理を続行）
            try {
                await SupabaseDB.sendApplicationEmail(founderData, house, parentalConsentId);
            } catch (emailError) {
                console.error('Application email failed:', emailError);
                // メール送信が失敗しても申し込みは続行
            }
        }
        
        // 成人の場合は通常の申し込み
        alert(`Application to ${houseName} submitted successfully!\n\nYour Info:\nName: ${founderData.name}\nEmail: ${founderData.email}\nAge: ${founderData.age}\nStay Duration: ${founderData.startDate} - ${founderData.endDate} (${diffDays} days)\n\nNext Steps:\n1. The house will contact you at ${founderData.email}\n2. You can also reach them at ${houseEmail}\n3. Schedule interview and confirm details\n\nAn email notification has been sent to the house.`);
        
    } catch (error) {
        console.error('Application submission error:', error);
        alert('Error submitting application. Please try again.');
    }
}

// 未成年者用申し込みフォーム表示
function showMinorApplicationForm(houseName, founderName, founderEmail, founderAge, startDate, endDate, houseEmail) {
    const parentName = prompt('Parent/Guardian Full Name (required for minors):');
    if (!parentName) {
        alert('Parental information is required for minors.');
        return;
    }
    
    const parentEmail = prompt('Parent/Guardian Email (required for minors):');
    if (!parentEmail) {
        alert('Parental email is required for minors.');
        return;
    }
    
    const parentPhone = prompt('Parent/Guardian Phone (required for minors):');
    if (!parentPhone) {
        alert('Parental phone is required for minors.');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // 未成年者の申し込み完了メッセージ（保護者情報付き）
    alert(`Minor Application to ${houseName} submitted successfully!\n\n=== MINOR APPLICANT ===\nName: ${founderName}\nAge: ${founderAge} (MINOR - Under 18)\nEmail: ${founderEmail}\nStay Duration: ${startDate} - ${endDate} (${diffDays} days)\n\n=== PARENT/GUARDIAN INFO ===\nName: ${parentName}\nEmail: ${parentEmail}\nPhone: ${parentPhone}\n\n=== IMPORTANT NOTICE ===\nThis application includes parental information as required for minors.\nThe hacker house will contact both the minor and parent/guardian.\nParental supervision and approval is required for all arrangements.\n\nNext Steps:\n1. House will contact parent at ${parentEmail}\n2. Parent must approve all arrangements\n3. You can reach the house at ${houseEmail}`);
}

// 同意書アップロード処理
document.getElementById('consentFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        alert(`Consent form "${file.name}" uploaded successfully.\nStarting matching process after verification.`);
        
        // 同意書確認後、マッチング実行
        setTimeout(() => {
            const formData = {
                name: document.getElementById('name').value,
                age: parseInt(document.getElementById('age').value),
                product: document.getElementById('product').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                region: document.getElementById('region').value
            };
            performMatching(formData);
        }, 1000);
    }
});

// ハッカーハウス登録フォーム処理
document.getElementById('houseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    

    
    const formData = {
        name: document.getElementById('houseName').value,
        location: document.getElementById('houseLocation').value,
        region: document.getElementById('houseRegion').value,
        description: document.getElementById('houseDescription').value,
        capacity: parseInt(document.getElementById('houseCapacity').value),
        currentOccupancy: 0, // 初期値は0
        email: document.getElementById('houseEmail').value,
        preferences: document.getElementById('housePreferences').value
    };
    
    // 設備の取得
    const facilities = [];
    document.querySelectorAll('#housePage input[type="checkbox"]:checked').forEach(checkbox => {
        facilities.push(checkbox.value);
    });
    formData.facilities = facilities;
    
    // バリデーション
    if (!formData.name || !formData.location || !formData.region || !formData.description || !formData.capacity || !formData.email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // ハッカーハウスを登録
    registerHackerHouse(formData);
});

// ハッカーハウス登録処理
async function registerHackerHouse(houseData) {
    try {
        console.log('registerHackerHouse called with:', houseData);
        
        // Check if Supabase is available
        if (typeof SupabaseDB !== 'undefined') {
            console.log('SupabaseDB is available, creating house...');
            const houseWithImage = {
                ...houseData,
                image: getRegionEmoji(houseData.region)
            };
            
            console.log('House data with image:', houseWithImage);
            const newHouse = await SupabaseDB.createHackerHouse(houseWithImage);
            console.log('新しいハッカーハウスがデータベースに登録されました:', newHouse);
            
            // Update local stats and house list
            await updateHomeStats();
            
            // Force reload of house list from database
            if (typeof loadHackerHousesList === 'function') {
                await loadHackerHousesList();
            }
            
            if (document.getElementById('houseGrid')) {
                await displayHouseList();
            }
        } else {
            console.log('SupabaseDB not available, using local storage fallback');
            // Fallback to local storage
            const newHouse = {
                ...houseData,
                id: Date.now(),
                registeredAt: new Date().toISOString(),
                image: getRegionEmoji(houseData.region)
            };
            
            registeredHouses.push(newHouse);
            
            // ハウス一覧を更新
            if (document.getElementById('houseGrid')) {
                displayHouseList();
            }
            
            console.log('新しいハッカーハウスがローカルに登録されました:', newHouse);
        }
        
        // 成功画面を表示
        console.log('Showing success message');
        const successElement = document.getElementById('houseSuccess');
        const formElement = document.getElementById('houseForm');
        
        if (successElement) {
            successElement.classList.remove('hidden');
            successElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Success element not found');
            alert('House registered successfully!');
        }
        
        // フォームをリセット
        if (formElement) {
            formElement.reset();
        }
        
    } catch (error) {
        console.error('ハッカーハウス登録エラー:', error);
        alert('Registration failed. Please try again.');
    }
}

// 創設者登録処理
async function registerFounder(founderData) {
    try {
        // Check if Supabase is available
        if (typeof SupabaseDB !== 'undefined') {
            const newFounder = await SupabaseDB.createFounder(founderData);
            console.log('新しい創設者がデータベースに登録されました:', newFounder);
            
            // Update local stats
            await updateHomeStats();
        } else {
            // Fallback to local storage
            const newFounder = {
                ...founderData,
                id: Date.now(),
                registeredAt: new Date().toISOString()
            };
            
            registeredFounders.push(newFounder);
            console.log('新しい創設者がローカルに登録されました:', newFounder);
        }
    } catch (error) {
        console.error('創設者登録エラー:', error);
        alert('Registration failed. Please try again.');
    }
}

// 地域に応じた絵文字を取得
function getRegionEmoji(region) {
    const emojiMap = {
        'tokyo': '🏙️',
        'sf': '🌉',
        'nyc': '🗽',
        'london': '🏰',
        'singapore': '🌴',
        'other': '🏠'
    };
    return emojiMap[region] || '🏠';
}

// ハウス一覧表示機能
function displayHouseList(houses = null) {
    const housesToShow = houses || [...hackerHouses, ...registeredHouses];
    const houseGrid = document.getElementById('houseGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (housesToShow.length === 0) {
        houseGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    houseGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    houseGrid.innerHTML = housesToShow.map(house => `
        <div class="simple-card p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <span class="text-3xl mr-3">${house.image}</span>
                    <div>
                        <h3 class="text-lg font-bold">${house.name}</h3>
                        <p class="text-sm">${house.location}</p>
                    </div>
                </div>
                <span class="border border-black px-2 py-1 text-xs font-mono">
                    ${getRegionName(house.region)}
                </span>
            </div>
            
            <p class="text-sm mb-4">${house.description}</p>
            
            ${house.features ? `
                <div class="flex flex-wrap gap-1 mb-4">
                    ${house.features.slice(0, 3).map(feature => `
                        <span class="border border-black px-2 py-1 text-xs">${feature}</span>
                    `).join('')}
                    ${house.features.length > 3 ? `<span class="text-xs">+${house.features.length - 3} more</span>` : ''}
                </div>
            ` : ''}
            
            ${house.facilities ? `
                <div class="flex flex-wrap gap-1 mb-4">
                    ${house.facilities.slice(0, 3).map(facility => `
                        <span class="border border-black px-2 py-1 text-xs">${getFacilityName(facility)}</span>
                    `).join('')}
                    ${house.facilities.length > 3 ? `<span class="text-xs">+${house.facilities.length - 3} more</span>` : ''}
                </div>
            ` : ''}
            
            <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                    <div>
                        ${house.capacity ? `Capacity: ${house.capacity}` : ''}
                    </div>
                    <div class="font-mono">
                        ${(() => {
                            const capacity = parseInt(house.capacity || 10);
                            const currentOccupancy = parseInt(house.currentOccupancy || 0);
                            const availableSpots = capacity - currentOccupancy;
                            return availableSpots > 0 ? 
                                `🟢 ${availableSpots} spots` : 
                                '🔴 Full';
                        })()}
                    </div>
                </div>
                <button onclick="contactHouse('${house.name}')" class="w-full simple-button px-4 py-2 text-sm font-mono">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
    
    updateStats(housesToShow);
}

// フィルタリング機能
function filterHouses() {
    const regionFilter = document.getElementById('filterRegion').value;
    const capacityFilter = document.getElementById('filterCapacity').value;
    const facilityFilter = document.getElementById('filterFacility').value;
    
    let filteredHouses = [...hackerHouses, ...registeredHouses];
    
    if (regionFilter) {
        filteredHouses = filteredHouses.filter(house => house.region === regionFilter);
    }
    
    if (capacityFilter) {
        filteredHouses = filteredHouses.filter(house => house.capacity === capacityFilter);
    }
    
    if (facilityFilter) {
        filteredHouses = filteredHouses.filter(house => {
            const houseFacilities = house.facilities || house.features || [];
            return houseFacilities.some(facility => 
                facility.toLowerCase().includes(facilityFilter.toLowerCase()) ||
                getFacilityName(facility).toLowerCase().includes(facilityFilter.toLowerCase())
            );
        });
    }
    
    displayHouseList(filteredHouses);
}

// フィルターをクリア
function clearFilters() {
    document.getElementById('filterRegion').value = '';
    document.getElementById('filterCapacity').value = '';
    document.getElementById('filterFacility').value = '';
    displayHouseList();
}

// 統計情報を更新
function updateStats(houses) {
    const totalHouses = houses.length;
    const availableSpots = houses.reduce((sum, house) => {
        const capacity = house.capacity;
        if (capacity === '10+') return sum + 10;
        if (capacity === '3-5') return sum + 4;
        if (capacity === '6-10') return sum + 8;
        return sum + (parseInt(capacity) || 1);
    }, 0);
    const activeRegions = new Set(houses.map(house => house.region)).size;
    
    document.getElementById('totalHouses').textContent = totalHouses;
    document.getElementById('availableSpots').textContent = availableSpots;
    document.getElementById('activeRegions').textContent = activeRegions;
}

// ハウスに連絡
function contactHouse(houseName) {
    // Find the house details
    const allHouses = [...hackerHouses, ...registeredHouses];
    const house = allHouses.find(h => h.name === houseName);
    
    if (!house) {
        alert('House not found');
        return;
    }
    
    // Create detailed information display
    const facilities = house.facilities ? house.facilities.map(f => getFacilityName(f)).join(', ') : 'None specified';
    const features = house.features ? house.features.join(', ') : 'None specified';
    
    const modalContent = `
        <div class="space-y-6">
            <div class="flex items-center space-x-4">
                <span class="text-4xl">${house.image}</span>
                <div>
                    <h3 class="text-xl font-bold">${house.name}</h3>
                    <p class="text-sm">${house.location}</p>
                    <span class="border border-black px-2 py-1 text-xs font-mono">${getRegionName(house.region)}</span>
                </div>
            </div>
            
            <div>
                <h4 class="font-bold mb-2">Description</h4>
                <p class="text-sm">${house.description}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <h4 class="font-bold mb-2">Capacity</h4>
                    <p class="text-sm">${house.capacity || 'Not specified'}</p>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Contact</h4>
                    <p class="text-sm">${house.email || 'Email not provided'}</p>
                </div>
            </div>
            
            <div>
                <h4 class="font-bold mb-2">Facilities</h4>
                <div class="flex flex-wrap gap-2">
                    ${house.facilities ? house.facilities.map(facility => `
                        <span class="border border-black px-2 py-1 text-xs">${getFacilityName(facility)}</span>
                    `).join('') : '<span class="text-sm">None specified</span>'}
                </div>
            </div>
            
            ${house.features ? `
                <div>
                    <h4 class="font-bold mb-2">Features</h4>
                    <div class="flex flex-wrap gap-2">
                        ${house.features.map(feature => `
                            <span class="border border-black px-2 py-1 text-xs">${feature}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="border-t pt-4">
                <h4 class="font-bold mb-2">Next Steps</h4>
                <ol class="text-sm space-y-1">
                    <li>1. Contact the house directly via email</li>
                    <li>2. Schedule a visit or interview</li>
                    <li>3. Discuss your project and goals</li>
                </ol>
            </div>
            
            <div class="flex space-x-4">
                <button onclick="window.open('mailto:${house.email}', '_blank')" class="simple-button px-4 py-2 font-mono flex-1">
                    Send Email
                </button>
                <button onclick="closeHouseModal()" class="simple-button px-4 py-2 font-mono">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('houseModalContent').innerHTML = modalContent;
    document.getElementById('houseModal').classList.remove('hidden');
}

// モーダルを閉じる
function closeHouseModal() {
    document.getElementById('houseModal').classList.add('hidden');
}

// 地域名を取得
function getRegionName(region) {
    const regionMap = {
        'tokyo': '東京',
        'sf': 'SF',
        'nyc': 'NYC',
        'london': 'ロンドン',
        'singapore': 'シンガポール',
        'other': 'その他'
    };
    return regionMap[region] || region;
}

// 設備名を取得
function getFacilityName(facility) {
    const facilityMap = {
        'wifi': 'High-speed WiFi',
        'workspace': 'Workspace',
        'kitchen': 'Kitchen',
        'meeting': 'Meeting Room',
        '24h': '24h Access',
        'mentoring': 'Mentoring'
    };
    return facilityMap[facility] || facility;
}

// ホームページの統計情報を更新
async function updateHomeStats() {
    try {
        if (typeof SupabaseDB !== 'undefined') {
            // Supabaseからデータを取得
            const [founders, houses] = await Promise.all([
                SupabaseDB.getFounders(),
                SupabaseDB.getHackerHouses()
            ]);
            
            const totalFounders = founders.length;
            const totalHouses = houses.length + hackerHouses.length; // サンプルデータも含める
            const activeRegions = new Set([...houses.map(h => h.region), ...hackerHouses.map(h => h.region)]).size;
            
            // ホームページの統計を更新
            const homeFoundersEl = document.getElementById('homeRegisteredFounders');
            const homeHousesEl = document.getElementById('homeRegisteredHouses');
            const homeRegionsEl = document.getElementById('homeActiveRegions');
            
            if (homeFoundersEl) homeFoundersEl.textContent = totalFounders;
            if (homeHousesEl) homeHousesEl.textContent = totalHouses;
            if (homeRegionsEl) homeRegionsEl.textContent = activeRegions;
            
        } else {
            // ローカルデータを使用
            const totalFounders = registeredFounders.length;
            const totalHouses = registeredHouses.length + hackerHouses.length;
            const activeRegions = new Set([...registeredHouses.map(h => h.region), ...hackerHouses.map(h => h.region)]).size;
            
            const homeFoundersEl = document.getElementById('homeRegisteredFounders');
            const homeHousesEl = document.getElementById('homeRegisteredHouses');
            const homeRegionsEl = document.getElementById('homeActiveRegions');
            
            if (homeFoundersEl) homeFoundersEl.textContent = totalFounders;
            if (homeHousesEl) homeHousesEl.textContent = totalHouses;
            if (homeRegionsEl) homeRegionsEl.textContent = activeRegions;
        }
    } catch (error) {
        console.error('統計情報の更新エラー:', error);
    }
}

// ハウス一覧表示をSupabase対応に更新
async function displayHouseList(houses = null) {
    try {
        let housesToShow;
        
        if (houses) {
            housesToShow = houses;
        } else if (typeof SupabaseDB !== 'undefined') {
            // Supabaseからデータを取得
            const dbHouses = await SupabaseDB.getHackerHouses();
            housesToShow = [...hackerHouses, ...dbHouses];
        } else {
            // ローカルデータを使用
            housesToShow = [...hackerHouses, ...registeredHouses];
        }
        
        const houseGrid = document.getElementById('houseGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!houseGrid) return; // ハウス一覧ページでない場合
        
        if (housesToShow.length === 0) {
            houseGrid.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        houseGrid.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        
        houseGrid.innerHTML = housesToShow.map(house => `
            <div class="simple-card p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <span class="text-3xl mr-3">${house.image}</span>
                        <div>
                            <h3 class="text-lg font-bold">${house.name}</h3>
                            <p class="text-sm">${house.location}</p>
                        </div>
                    </div>
                    <span class="border border-black px-2 py-1 text-xs font-mono">
                        ${getRegionName(house.region)}
                    </span>
                </div>
                
                <p class="text-sm mb-4">${house.description}</p>
                
                ${house.features ? `
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${house.features.slice(0, 3).map(feature => `
                            <span class="border border-black px-2 py-1 text-xs">${feature}</span>
                        `).join('')}
                        ${house.features.length > 3 ? `<span class="text-xs">+${house.features.length - 3} more</span>` : ''}
                    </div>
                ` : ''}
                
                ${house.facilities ? `
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${house.facilities.slice(0, 3).map(facility => `
                            <span class="border border-black px-2 py-1 text-xs">${getFacilityName(facility)}</span>
                        `).join('')}
                        ${house.facilities.length > 3 ? `<span class="text-xs">+${house.facilities.length - 3} more</span>` : ''}
                    </div>
                ` : ''}
                
                <div class="flex justify-between items-center">
                    <div class="text-sm">
                        ${house.capacity ? `Capacity: ${house.capacity}` : ''}
                    </div>
                    <button onclick="contactHouse('${house.name}')" class="simple-button px-4 py-2 text-sm font-mono">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
        
        updateStats(housesToShow);
        
    } catch (error) {
        console.error('ハウス一覧表示エラー:', error);
    }
}





// 年齢チェック機能
function checkAge() {
    const age = parseInt(document.getElementById('age').value);
    const parentalConsentSection = document.getElementById('parentalConsentSection');
    
    if (age && age < 18) {
        parentalConsentSection.classList.remove('hidden');
    } else {
        parentalConsentSection.classList.add('hidden');
    }
}

// ハウス編集機能
let currentEditingHouse = null;

// メール認証でハウス情報を取得
async function verifyHouseEmail() {
    const email = document.getElementById('verifyEmail').value.trim();
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    try {
        let house = null;
        
        // まずSupabaseから検索
        if (typeof SupabaseDB !== 'undefined') {
            const dbHouses = await SupabaseDB.getHackerHouses();
            house = dbHouses.find(h => h.email === email);
        }
        
        // Supabaseにない場合はローカル配列から検索
        if (!house) {
            house = hackerHouses.find(h => h.email === email);
        }
        
        if (!house) {
            alert('No house found with this email address. Please check your email or register your house first.');
            return;
        }
        
        // ハウス情報をフォームに読み込み
        currentEditingHouse = house;
        loadHouseForEdit(house);
        
        // UI切り替え
        document.getElementById('emailVerification').classList.add('hidden');
        document.getElementById('editHouseForm').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error verifying house email:', error);
        alert('Error loading house information. Please try again.');
    }
}

// ハウス情報をフォームに読み込み
function loadHouseForEdit(house) {
    document.getElementById('editHouseName').value = house.name || '';
    document.getElementById('editHouseLocation').value = house.location || '';
    document.getElementById('editHouseDescription').value = house.description || '';
    document.getElementById('editHouseCapacity').value = house.capacity || '';
}

// 編集キャンセル
function cancelEdit() {
    currentEditingHouse = null;
    document.getElementById('verifyEmail').value = '';
    document.getElementById('updateHouseForm').reset();
    document.getElementById('emailVerification').classList.remove('hidden');
    document.getElementById('editHouseForm').classList.add('hidden');
}

// ハウス更新フォームのハンドラー
document.getElementById('updateHouseForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentEditingHouse) {
        alert('No house selected for editing');
        return;
    }
    
    const updatedData = {
        name: document.getElementById('editHouseName').value,
        location: document.getElementById('editHouseLocation').value,
        description: document.getElementById('editHouseDescription').value,
        capacity: parseInt(document.getElementById('editHouseCapacity').value)
    };
    
    // バリデーション
    if (!updatedData.name || !updatedData.location || !updatedData.description || !updatedData.capacity) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        // Supabaseで更新
        if (typeof SupabaseDB !== 'undefined') {
            await SupabaseDB.updateHackerHouse(currentEditingHouse.email, updatedData);
        }
        
        // ローカル配列も更新
        const houseIndex = hackerHouses.findIndex(h => h.email === currentEditingHouse.email);
        if (houseIndex !== -1) {
            hackerHouses[houseIndex] = {
                ...hackerHouses[houseIndex],
                ...updatedData
            };
        }
        
        alert('House information updated successfully!');
        
        // フォームをリセット
        cancelEdit();
        
        // ハウス一覧を更新
        displayHouseList();
        
    } catch (error) {
        console.error('Error updating house:', error);
        alert('Error updating house information. Please try again.');
    }
});

    showPage('home');
    // Wrap await calls in an async IIFE
    (async () => {
        await updateHomeStats(); // 統計情報を更新
        await displayHouseList(); // ハウス一覧も初期化
    })();
    // 年齢フィールドにイベントリスナーを追加
    const ageField = document.getElementById('age');
    if (ageField) {
        ageField.addEventListener('input', checkAge);
        ageField.addEventListener('change', checkAge);
    }

    // ...

    showPage('home');
    // Wrap await calls in an async IIFE
    (async () => {
        await updateHomeStats(); // 統計情報を更新
        await displayHouseList(); // ハウス一覧も初期化
    })();

    // ...

// 成功通知を表示する関数
function showSuccessNotification(message) {
    const notification = document.getElementById('successNotification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    
    // 3秒後に通知を非表示にする
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// 保護者同意書フォームを作成する
function createParentalConsentForm() {
    const container = document.createElement('div');
    container.id = 'parentalConsentContainer';
    container.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    container.innerHTML = `
        <div class="bg-white p-8 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto simple-card">
            <h2 class="text-2xl font-bold mb-6">⚠️ Parental Consent Required</h2>
            <p class="mb-6 text-sm">Since you are under 18, parental consent is required. Please have your parent/guardian fill out the form below.</p>
            
            <form id="inlineConsentForm" class="space-y-4">
                <div class="border-2 border-gray-300 p-4 rounded">
                    <h3 class="font-bold mb-3">Minor Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-bold mb-1">Full Name</label>
                            <input type="text" id="inlineMinorName" readonly class="w-full px-2 py-1 simple-input bg-gray-100">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Age</label>
                            <input type="number" id="inlineMinorAge" readonly class="w-full px-2 py-1 simple-input bg-gray-100">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Email</label>
                            <input type="email" id="inlineMinorEmail" readonly class="w-full px-2 py-1 simple-input bg-gray-100">
                        </div>
                    </div>
                </div>
                
                <div class="border-2 border-gray-300 p-4 rounded">
                    <h3 class="font-bold mb-3">Parent/Guardian Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold mb-1">Parent/Guardian Full Name *</label>
                            <input type="text" id="inlineParentName" required class="w-full px-2 py-1 simple-input">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Parent/Guardian Email *</label>
                            <input type="email" id="inlineParentEmail" required class="w-full px-2 py-1 simple-input">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Phone Number *</label>
                            <input type="tel" id="inlineParentPhone" required class="w-full px-2 py-1 simple-input">
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Relationship *</label>
                            <select id="inlineRelationship" required class="w-full px-2 py-1 simple-input">
                                <option value="">Select relationship</option>
                                <option value="parent">Parent</option>
                                <option value="legal-guardian">Legal Guardian</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <label class="flex items-start space-x-2">
                        <input type="checkbox" id="inlineConsent1" required class="mt-1">
                        <span class="text-sm">I consent to the above minor using the Hacker House platform.</span>
                    </label>
                    <label class="flex items-start space-x-2">
                        <input type="checkbox" id="inlineConsent2" required class="mt-1">
                        <span class="text-sm">I understand the risks associated with using the platform and take full responsibility.</span>
                    </label>
                    <label class="flex items-start space-x-2">
                        <input type="checkbox" id="inlineConsent3" required class="mt-1">
                        <span class="text-sm">I take full responsibility for the minor's safety and welfare.</span>
                    </label>
                </div>
                
                <div>
                    <label class="block text-sm font-bold mb-1">Digital Signature *</label>
                    <input type="text" id="inlineDigitalSignature" required class="w-full px-2 py-1 simple-input" placeholder="Enter parent/guardian full name">
                    <p class="text-xs text-gray-600 mt-1">Please enter the same name as the parent/guardian name above</p>
                </div>
                
                <div class="flex space-x-4 pt-4">
                    <button type="button" onclick="hideParentalConsentForm()" class="flex-1 simple-button py-2 px-4">Cancel</button>
                    <button type="submit" class="flex-1 simple-button py-2 px-4 bg-blue-100">Consent & Continue</button>
                </div>
            </form>
        </div>
    `;
    
    return container;
}

// 保護者同意書フォームを表示する
function showParentalConsentForm(founderData, selectedHouses) {
    // Store data for later use
    window.pendingApplication = {
        founderData,
        selectedHouses
    };
    
    // Hide application form
    const appForm = document.getElementById('directApplicationForm');
    if (appForm) {
        appForm.classList.add('hidden');
    }
    
    // Show parental consent form
    let consentFormContainer = document.getElementById('parentalConsentContainer');
    if (!consentFormContainer) {
        consentFormContainer = createParentalConsentForm();
        document.body.appendChild(consentFormContainer);
    }
    
    // Pre-fill minor information
    document.getElementById('inlineMinorName').value = founderData.name;
    document.getElementById('inlineMinorEmail').value = founderData.email;
    document.getElementById('inlineMinorAge').value = founderData.age;
    
    consentFormContainer.classList.remove('hidden');
    
    // Add form submission handler
    document.getElementById('inlineConsentForm').addEventListener('submit', handleParentalConsentSubmission);
}

// 保護者同意書を非表示にする
function hideParentalConsentForm() {
    const container = document.getElementById('parentalConsentContainer');
    if (container) {
        container.classList.add('hidden');
    }
    
    // Show application form again
    const appForm = document.getElementById('directApplicationForm');
    if (appForm) {
        appForm.classList.remove('hidden');
    }
}

// 保護者同意書提出処理
async function handleParentalConsentSubmission(e) {
    e.preventDefault();
    
    // Validate digital signature
    const parentName = document.getElementById('inlineParentName').value;
    const signature = document.getElementById('inlineDigitalSignature').value;
    
    if (parentName.toLowerCase() !== signature.toLowerCase()) {
        alert('Digital signature must match the parent/guardian name exactly.');
        return;
    }
    
    try {
        // Create parental consent record
        const consentData = {
            minor_name: document.getElementById('inlineMinorName').value,
            minor_age: parseInt(document.getElementById('inlineMinorAge').value),
            minor_email: document.getElementById('inlineMinorEmail').value,
            parent_name: parentName,
            parent_email: document.getElementById('inlineParentEmail').value,
            parent_phone: document.getElementById('inlineParentPhone').value,
            relationship: document.getElementById('inlineRelationship').value,
            signature_date: new Date().toISOString().split('T')[0],
            consent_status: 'approved'
        };
        
        const consentRecord = await SupabaseDB.createOrUpdateParentalConsent(consentData);
        console.log('Parental consent created:', consentRecord);
        
        // Hide consent form
        hideParentalConsentForm();
        
        // Continue with application submission
        const { founderData, selectedHouses } = window.pendingApplication;
        await continueApplicationSubmission(founderData, selectedHouses, consentRecord.id);
        
    } catch (error) {
        console.error('Parental consent submission error:', error);
        alert('Failed to submit parental consent. Please try again.');
    }
}

// 保護者同意後の応募続行処理
async function continueApplicationSubmission(founderData, selectedHouses, parentalConsentId) {
    try {
        // Save founder to database
        const founderRecord = await SupabaseDB.createFounder(founderData);
        console.log('Founder created:', founderRecord);
        
        // Send email notifications to selected houses
        const emailService = new EmailService();
        for (const house of selectedHouses) {
            const houseData = {
                name: house.name,
                email: house.email
            };
            
            try {
                await emailService.sendApplicationEmail(founderData, houseData, parentalConsentId);
                console.log(`Email sent to ${house.name}`);
            } catch (emailError) {
                console.error(`Failed to send email to ${house.name}:`, emailError);
            }
        }
        
        // Show success message
        document.getElementById('applicationSuccess').classList.remove('hidden');
        
        // Hide forms
        const container = document.getElementById('parentalConsentContainer');
        if (container) {
            container.remove();
        }
        
        if (document.getElementById('directApplicationForm')) {
            document.getElementById('directApplicationForm').classList.add('hidden');
            document.getElementById('housesList').classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Application submission error:', error);
        alert('Failed to submit application. Please try again.');
    }
}

// 直接応募フォームを表示する
function showDirectApplicationForm(houseName, houseEmail) {
    // 選択されたハッカーハウス情報を保存
    window.selectedHouse = {
        name: houseName,
        email: houseEmail
    };
    
    // フォームタイトルを更新
    const titleElement = document.getElementById('selectedHouseName');
    if (titleElement) {
        titleElement.textContent = houseName;
    }
    
    // フォームを表示、ハウス一覧を非表示
    const formContainer = document.getElementById('directApplicationForm');
    const housesContainer = document.getElementById('housesList');
    
    if (formContainer && housesContainer) {
        formContainer.classList.remove('hidden');
        housesContainer.classList.add('hidden');
    }
}

// ハッカーハウス一覧を読み込む
async function loadHackerHousesList() {
    let houses = [];
    
    try {
        // Try to load from database first
        console.log('Attempting to load houses from database...');
        houses = await SupabaseDB.getAllHackerHouses();
        console.log('Loaded houses from database:', houses);
        console.log('Number of houses loaded:', houses.length);
        
        // Transform database data to match expected format
        houses = houses.map(house => {
            let features = [];
            if (house.facilities) {
                try {
                    // If facilities is JSON array, parse it
                    if (typeof house.facilities === 'string' && house.facilities.startsWith('[')) {
                        features = JSON.parse(house.facilities);
                    } else if (Array.isArray(house.facilities)) {
                        features = house.facilities;
                    } else {
                        // If it's a comma-separated string
                        features = house.facilities.split(',').map(f => f.trim());
                    }
                } catch (e) {
                    console.warn('Failed to parse facilities for house:', house.name, e);
                    features = [];
                }
            }
            
            return {
                name: house.name,
                location: house.location,
                email: house.email,
                description: house.description,
                capacity: house.capacity,
                features: features
            };
        });
        
    } catch (error) {
        console.error('Failed to load houses from database:', error);
        console.error('Error details:', error.message);
        console.error('Supabase client status:', supabaseClient ? 'Connected' : 'Not connected');
        // Fallback to hardcoded data
        houses = [
            {
                name: "Tokyo Tech House",
                location: "Tokyo, Japan",
                email: "hello@tokyotech.house",
                description: "AI/ML focused hacker house in Shibuya. Perfect for tech founders building innovative products.",
                capacity: 8,
                features: ["High-speed WiFi", "24/7 Access", "Mentorship", "Networking Events"]
            },
            {
                name: "SF Startup Hub",
                location: "San Francisco, CA",
                email: "apply@sfhub.co",
                description: "YC-style accelerator environment in the heart of Silicon Valley. Connect with investors and fellow founders.",
                capacity: 12,
                features: ["Investor Network", "Demo Days", "Legal Support", "Funding Prep"]
            },
            {
                name: "Berlin Builders",
                location: "Berlin, Germany", 
                email: "team@berlinbuilders.com",
                description: "European startup community focused on sustainable tech and social impact ventures.",
                capacity: 6,
                features: ["Sustainability Focus", "EU Market Access", "Co-working Space", "Community Events"]
            }
        ];
    }
    
    // Browse Houses ページの一覧
    const browseContainer = document.getElementById('housesList');
    if (browseContainer) {
        browseContainer.innerHTML = houses.map(house => `
            <div class="simple-card p-6">
                <h3 class="text-xl font-bold mb-2">${house.name}</h3>
                <p class="text-sm text-gray-600 mb-3">${house.location}</p>
                <p class="text-sm mb-4">${house.description}</p>
                <div class="mb-4">
                    <p class="text-xs font-bold mb-2">Features:</p>
                    <div class="flex flex-wrap gap-1">
                        ${house.features.map(feature => `
                            <span class="px-2 py-1 border border-gray-300 text-xs rounded">${feature}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-bold">Capacity: ${house.capacity} founders</span>
                    <button onclick="showDirectApplicationForm('${house.name}', '${house.email}')" class="simple-button px-4 py-2 text-sm">
                        Apply to This House
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Apply ページの選択リスト
    const applyContainer = document.getElementById('applyHousesList');
    if (applyContainer) {
        applyContainer.innerHTML = houses.map(house => `
            <div class="border-2 border-gray-300 p-4 rounded">
                <label class="flex items-start cursor-pointer">
                    <input type="checkbox" class="house-checkbox mt-1 mr-3" data-email="${house.email}" data-name="${house.name}">
                    <div>
                        <h3 class="font-bold">${house.name}</h3>
                        <p class="text-sm text-gray-600">${house.location}</p>
                        <p class="text-sm mt-1">${house.description}</p>
                    </div>
                </label>
            </div>
        `).join('');
    }
}

// Founder Application Submission Function
async function submitApplications() {
    // Get form data
    const formData = {
        name: document.getElementById('appName').value,
        email: document.getElementById('appEmail').value,
        age: parseInt(document.getElementById('appAge').value),
        location: document.getElementById('appLocation').value,
        project: document.getElementById('appProject').value,
        startDate: document.getElementById('appStartDate').value,
        endDate: document.getElementById('appEndDate').value,
        message: document.getElementById('appMessage').value
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.age || !formData.location || !formData.project || !formData.startDate || !formData.endDate) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Get selected houses
    let selectedHouses = Array.from(document.querySelectorAll('.house-checkbox:checked')).map(cb => ({
        name: cb.dataset.name,
        email: cb.dataset.email
    }));
    
    // If no houses are selected (direct application), use the selected house
    if (selectedHouses.length === 0 && window.selectedHouse) {
        selectedHouses = [window.selectedHouse];
    } else if (selectedHouses.length === 0) {
        alert('Please select at least one hacker house to apply to.');
        return;
    }
    
    try {
        // Create founder record in database
        const founderData = {
            name: formData.name,
            email: formData.email,
            age: formData.age,
            product: formData.project,
            startDate: formData.startDate,
            endDate: formData.endDate,
            region: 'other' // Default region, could be improved with a region selector
        };
        
        // Check if applicant is a minor and handle parental consent
        let parentalConsentId = null;
        
        if (formData.age < 18) {
            // Show parental consent form instead of sending email
            showParentalConsentForm(formData, selectedHouses);
            return;
        }
        
        // Save founder to database
        const founderRecord = await SupabaseDB.createFounder(founderData);
        console.log('Founder created:', founderRecord);
        
        // Send email notifications to selected houses
        const emailService = new EmailService();
        for (const house of selectedHouses) {
            // In a real implementation, you would retrieve the actual house data from the database
            const houseData = {
                name: house.name,
                email: house.email
            };
            
            try {
                await emailService.sendApplicationEmail(founderData, houseData, parentalConsentId);
                console.log(`Email sent to ${house.name}`);
            } catch (emailError) {
                console.error(`Failed to send email to ${house.name}:`, emailError);
            }
        }
        
        // Show success message
        document.getElementById('applicationSuccess').classList.remove('hidden');
        // Hide form if on apply page
        if (document.getElementById('applicationForm')) {
            document.getElementById('applicationForm').style.display = 'none';
            document.querySelector('#applyPage .simple-card:nth-child(3)').style.display = 'none';
            document.getElementById('submitApplications').style.display = 'none';
        }
        // Hide form if on browse houses page
        if (document.getElementById('directApplicationForm')) {
            document.getElementById('directApplicationForm').classList.add('hidden');
            document.getElementById('housesList').classList.remove('hidden');
            document.getElementById('toggleForm').textContent = 'Apply Directly';
        }
    } catch (error) {
        console.error('Application submission error:', error);
        alert('Error submitting application. Please try again.');
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // ハウス一覧を読み込む
    setTimeout(async () => {
        await loadHackerHousesList();
    }, 100);
    
    // 応募ボタンのイベントリスナー
    const submitBtn = document.getElementById('submitApplications');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitApplications();
        });
    }
    
    console.log('Initialization complete');
});



// Edit House Functions
function verifyHouseEmail() {
    const email = document.getElementById('verifyEmail').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    console.log('Verifying house email:', email);
    
    // サンプルハウスのメールアドレスをチェック
    const sampleHouses = [
        {
            email: 'contact@tokyotechhouse.com',
            name: 'Tokyo Tech House',
            location: 'Tokyo, Japan',
            description: 'A vibrant community of tech innovators in the heart of Tokyo',
            capacity: 20,
            rent: 800
        },
        {
            email: 'hello@sfstartuphub.com',
            name: 'SF Startup Hub',
            location: 'San Francisco, CA',
            description: 'Silicon Valley\'s premier hacker house for ambitious founders',
            capacity: 15,
            rent: 1200
        },
        {
            email: 'info@berlinbuilders.de',
            name: 'Berlin Builders',
            location: 'Berlin, Germany',
            description: 'European tech hub fostering innovation and collaboration',
            capacity: 18,
            rent: 600
        }
    ];
    
    const house = sampleHouses.find(h => h.email.toLowerCase() === email.toLowerCase());
    
    if (house) {
        // メール認証成功 - フォームを表示してデータを入力
        document.getElementById('emailVerification').style.display = 'none';
        document.getElementById('editHouseForm').style.display = 'block';
        
        // フォームにデータを入力
        document.getElementById('editHouseName').value = house.name;
        document.getElementById('editHouseLocation').value = house.location;
        document.getElementById('editHouseDescription').value = house.description;
        document.getElementById('editHouseCapacity').value = house.capacity;
        document.getElementById('editHouseRent').value = house.rent;
        
        console.log('House data loaded successfully');
    } else {
        alert('Email not found. Please make sure you entered the email address you used when registering your house.');
    }
}

function updateHouseInfo() {
    const formData = {
        name: document.getElementById('editHouseName').value,
        location: document.getElementById('editHouseLocation').value,
        description: document.getElementById('editHouseDescription').value,
        capacity: document.getElementById('editHouseCapacity').value,
        rent: document.getElementById('editHouseRent').value
    };
    
    console.log('Updating house info:', formData);
    
    // 成功メッセージを表示
    document.getElementById('editHouseForm').style.display = 'none';
    document.getElementById('verificationStatus').style.display = 'block';
    
    // 実際のアプリケーションでは、ここでデータベースを更新する
    console.log('House information updated successfully');
}

function cancelEdit() {
    // フォームをリセットして最初の状態に戻す
    document.getElementById('editHouseForm').style.display = 'none';
    document.getElementById('emailVerification').style.display = 'block';
    document.getElementById('verifyEmail').value = '';
    
    // または、ホームページに戻る
    showPage('home');
}

// Update House Form Submit Event Listener
document.addEventListener('DOMContentLoaded', function() {
    const updateForm = document.getElementById('updateHouseForm');
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateHouseInfo();
        });
    }
});
