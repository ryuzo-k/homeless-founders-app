// ページ切り替え機能
function showPage(pageId) {
    // すべてのページを非表示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // 指定されたページを表示
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // ナビゲーションのアクティブ状態を更新
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-blue-100', 'text-blue-800');
        btn.classList.add('text-blue-600');
    });
    
    // 現在のページボタンをアクティブに
    const activeBtn = document.querySelector(`nav button[onclick="showPage('${pageId}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-blue-600');
        activeBtn.classList.add('bg-blue-100', 'text-blue-800');
    }
}

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
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    // 今日の日付を最小値として設定
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;
    
    // 開始日が変更されたら終了日の最小値を更新
    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
        updateDurationDisplay();
    });
    
    endDateInput.addEventListener('change', updateDurationDisplay);
});

// フォーム送信処理
document.getElementById('founderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    

    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Date validation
    if (!updateDurationDisplay()) {
        alert('Please select a valid stay duration');
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value),
        product: document.getElementById('product').value,
        startDate: startDate,
        endDate: endDate,
        region: document.getElementById('region').value
    };
    
    // Validation
    if (!formData.name || !formData.email || !formData.age || !formData.product || !formData.startDate || !formData.endDate || !formData.region) {
        alert('Please fill in all required fields');
        return;
    }
    
    // 利用規約同意チェック
    if (!document.getElementById('termsAgreement').checked) {
        alert('Please agree to the Terms of Service to continue.');
        return;
    }
    
    // 未成年者チェックと親権者同意書処理
    let parentalConsentId = null;
    if (formData.age < 18) {
        // 親権者同意書のバリデーション
        const parentName = document.getElementById('parentName').value;
        const parentEmail = document.getElementById('parentEmail').value;
        const parentPhone = document.getElementById('parentPhone').value;
        const relationship = document.getElementById('relationship').value;
        const emergencyName = document.getElementById('emergencyName').value;
        const emergencyPhone = document.getElementById('emergencyPhone').value;
        const digitalSignature = document.getElementById('digitalSignature').value;
        
        // 必須フィールドのチェック
        if (!parentName || !parentEmail || !parentPhone || !relationship || !emergencyName || !emergencyPhone || !digitalSignature) {
            alert('Please complete all parental consent fields.');
            return;
        }
        
        // デジタル署名のチェック
        if (parentName.toLowerCase() !== digitalSignature.toLowerCase()) {
            alert('Digital signature must match the parent/guardian name exactly.');
            return;
        }
        
        // 同意チェックボックスのチェック
        const consentBoxes = ['consent1', 'consent2', 'consent3', 'consent4'];
        for (const boxId of consentBoxes) {
            if (!document.getElementById(boxId).checked) {
                alert('Please check all parental consent boxes.');
                return;
            }
        }
        
        try {
            // 親権者同意書をSupabaseに保存
            if (typeof SupabaseDB !== 'undefined') {
                const consentData = {
                    minor_name: formData.name,
                    minor_age: formData.age,
                    minor_email: formData.email,
                    parent_name: parentName,
                    parent_email: parentEmail,
                    parent_phone: parentPhone,
                    relationship,
                    emergency_name: emergencyName,
                    emergency_phone: emergencyPhone,
                    signature_date: new Date().toISOString().split('T')[0]
                };
                
                const consentRecord = await SupabaseDB.createParentalConsent(consentData);
                parentalConsentId = consentRecord.id;
                
                // 親に確認メールを送信（エラーが出ても処理を続行）
                try {
                    if (typeof EmailService !== 'undefined') {
                        const emailService = new EmailService();
                        await emailService.sendParentalConsentConfirmation(parentEmail, formData.name);
                        alert('Parental consent saved successfully! A confirmation email has been sent to the parent.');
                    } else {
                        alert('Parental consent saved successfully!');
                    }
                } catch (emailError) {
                    console.error('Email sending failed:', emailError);
                    alert('Parental consent saved successfully! (Email notification failed, but data is saved)');
                }
            }
        } catch (error) {
            console.error('Error saving parental consent:', error);
            alert('Error saving parental consent. Please try again.');
            return;
        }
    }
    
    // 創設者を登録（親権者同意書IDを含む）
    const founderDataWithConsent = { ...formData, parentalConsentId };
    await registerFounder(founderDataWithConsent);
    
    // マッチング実行 - 直接実行
    showMatchingResults(founderDataWithConsent);
});

// ハッカーハウス一覧を表示
function showMatchingResults(formData) {
    // 結果ページを表示
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById('results').classList.remove('hidden');
    
    // 登録済みハッカーハウスを全部表示
    const allHouses = window.hackerHouses || [];
    
    // ハウスがない場合はサンプルを表示
    const housesToShow = allHouses.length > 0 ? allHouses : [
        {
            name: "Sample House",
            location: "Tokyo, Japan",
            description: "Please register a hacker house first",
            capacity: 5,
            email: "sample@example.com"
        }
    ];
    
    // マッチ結果を表示
    const resultsContainer = document.getElementById('matchResults');
    
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
                <button onclick="applyToHouse('${house.name}', '${JSON.stringify(formData).replace(/'/g, "\\'")}')"
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
        // Check if Supabase is available
        if (typeof SupabaseDB !== 'undefined') {
            const houseWithImage = {
                ...houseData,
                image: getRegionEmoji(houseData.region)
            };
            
            const newHouse = await SupabaseDB.createHackerHouse(houseWithImage);
            console.log('新しいハッカーハウスがデータベースに登録されました:', newHouse);
            
            // Update local stats and house list
            await updateHomeStats();
            if (document.getElementById('houseGrid')) {
                await displayHouseList();
            }
        } else {
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
        document.getElementById('houseSuccess').classList.remove('hidden');
        document.getElementById('houseSuccess').scrollIntoView({ behavior: 'smooth' });
        
        // フォームをリセット
        document.getElementById('houseForm').reset();
        
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

// 初期化：ホームページを表示
document.addEventListener('DOMContentLoaded', async function() {
    showPage('home');
    await updateHomeStats(); // 統計情報を更新
    await displayHouseList(); // ハウス一覧も初期化
    
    // 年齢フィールドにイベントリスナーを追加
    const ageField = document.getElementById('age');
    if (ageField) {
        ageField.addEventListener('input', checkAge);
        ageField.addEventListener('change', checkAge);
    }
    

});
