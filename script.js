// 登録されたハッカーハウスのデータ
let registeredHouses = [];

// 登録された創設者のデータ
let registeredFounders = [];

// Sample hacker house data
const hackerHouses = [
    {
        name: "LocalHost Japan House",
        location: "Yotsuya, Shinjuku",
        description: "Hi",
        image: "🏠",
        region: "tokyo",
        country: "japan",
        email: "contact@localhost-japan.com",
        sns: "https://x.com/localhostjapan"
    },
    {
        name: "SF Tech House",
        location: "SOMA, San Francisco",
        description: "Premier tech house in the heart of Silicon Valley",
        image: "🌉",
        region: "sf",
        country: "usa",
        email: "contact@sftechhouse.com",
        sns: "https://twitter.com/sftechhouse"
    },
    {
        name: "NYC Creative Collective",
        location: "Brooklyn, New York",
        description: "Where creative founders gather to build the future",
        image: "🗽",
        region: "nyc",
        country: "usa",
        email: "contact@nyccreative.com",
        sns: "https://instagram.com/nyccreative"
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
                sns: document.getElementById('houseSNS').value,
                country: document.getElementById('houseCountry').value,
                description: document.getElementById('houseDescription').value
            };
            
            if (!formData.name || !formData.location || !formData.email || !formData.sns || !formData.country || !formData.description) {
                alert('Please fill in all required fields');
                return;
            }
            
            try {
                // Test Supabase connection first
                console.log('Testing Supabase connection...');
                if (typeof SupabaseDB !== 'undefined') {
                    console.log('✅ SupabaseDB is available');
                    console.log('Supabase URL:', CONFIG?.SUPABASE_URL);
                    console.log('Supabase Key exists:', !!CONFIG?.SUPABASE_ANON_KEY);
                } else {
                    console.log('❌ SupabaseDB is not available');
                }
                
                // ハッカーハウスを登録
                await registerHackerHouse(formData);
            } catch (error) {
                console.error('Error registering house:', error);
                alert(`Registration failed: ${error.message}`);
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
    
    try {
        // Check if Supabase is available
        if (typeof SupabaseDB !== 'undefined') {
            console.log('SupabaseDB is available, creating house...');
            
            // Map country to region for backward compatibility
            const countryToRegion = {
                'japan': 'tokyo',
                'usa': 'sf',
                'uk': 'london',
                'singapore': 'singapore',
                'canada': 'other',
                'australia': 'other',
                'germany': 'other',
                'france': 'other',
                'netherlands': 'other',
                'other': 'other'
            };
            
            // Ensure region is never null
            const mappedRegion = countryToRegion[formData.country] || 'other';
            console.log(`🗺️ Country "${formData.country}" mapped to region "${mappedRegion}"`);
            
            const houseData = {
                ...formData,
                image: getRegionEmoji(mappedRegion), // Use the mapped region for emoji
                region: mappedRegion // Ensure region is set
            };
            
            // Final validation - ensure region is never null/undefined
            if (!houseData.region) {
                houseData.region = 'other';
                console.log('⚠️ Region was null, defaulted to "other"');
            }
            
            console.log('🏠 House data to be saved:', houseData);
            console.log('🏠 House data fields:', Object.keys(houseData));
            console.log('🔍 DEBUG: SNS field in houseData:', houseData.sns);
            
            // Create house in database
            const newHouse = await SupabaseDB.createHackerHouse(houseData);
            console.log('✅ House created successfully:', newHouse);
            
            // Show success message
            document.getElementById('houseForm').style.display = 'none';
            document.getElementById('houseSuccess').style.display = 'block';
            
        } else {
            console.log('SupabaseDB not available, using fallback');
            
            // Map country to region for backward compatibility
            const countryToRegion = {
                'japan': 'tokyo',
                'usa': 'sf',
                'uk': 'london',
                'singapore': 'singapore',
                'canada': 'other',
                'australia': 'other',
                'germany': 'other',
                'france': 'other',
                'netherlands': 'other',
                'other': 'other'
            };
            
            const region = countryToRegion[formData.country] || 'other';
            
            const houseWithRegion = {
                ...formData,
                region: region,
                country: formData.country, // Ensure country is preserved
                image: getRegionEmoji(region)
            };

            registeredHouses.push(houseWithRegion);
            console.log('House registered locally:', houseWithRegion);
            console.log('House registered locally:', newHouse);
            
            // Show success message
            document.getElementById('houseForm').style.display = 'none';
            document.getElementById('houseSuccess').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error registering house:', error);
        
        let errorMessage = 'Failed to register house. ';
        if (error.message.includes('Database connection failed')) {
            errorMessage += 'Please check your internet connection and try again.';
        } else if (error.message.includes('API key')) {
            errorMessage += 'API configuration issue. Please contact support.';
        } else if (error.message.includes('Supabase')) {
            errorMessage += 'Database service temporarily unavailable. Your data has been saved locally.';
        } else {
            errorMessage += 'Please try again. If the problem persists, contact support.';
        }
        
        alert(errorMessage);
        throw error;
    }
}

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
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

                </div>
            </div>
            <p class="text-sm mb-4">${house.description}</p>
            <div class="flex justify-between items-center">

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
            console.log('🔍 DEBUG: SNS field in houseWithImage:', houseWithImage.sns);
            const newHouse = await SupabaseDB.createHackerHouse(houseWithImage);
            console.log('✅ Created house result:', newHouse);
            
            // Update local stats only
            await updateHomeStats();
            
            console.log('House registered successfully, no need to reload list');
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
            if (document.getElementById('housesList')) {
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
        
        // Provide specific error messages for different scenarios
        let errorMessage = 'Registration failed. ';
        if (error.message.includes('Database connection failed')) {
            errorMessage += 'Please check your internet connection and try again.';
        } else if (error.message.includes('API key')) {
            errorMessage += 'API configuration issue. Please contact support.';
        } else if (error.message.includes('Supabase')) {
            errorMessage += 'Database service temporarily unavailable. Your data has been saved locally.';
        } else {
            errorMessage += 'Please try again. If the problem persists, contact support.';
        }
        
        alert(errorMessage);
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
async function displayHouseList(houses = null) {
    let housesToShow;
    
    // Load houses from Supabase if not provided
    if (!houses) {
        try {
            const supabaseHouses = await SupabaseDB.getHackerHouses();
            housesToShow = supabaseHouses || [];
            console.log('🏠 Loaded houses from Supabase:', housesToShow.length);
            
            // Transform and ensure country field exists
            housesToShow = housesToShow.map(house => {
                // Map region to country for backward compatibility if country is missing
                const regionToCountry = {
                    'tokyo': 'japan',
                    'sf': 'usa',
                    'london': 'uk',
                    'singapore': 'singapore',
                    'other': 'other'
                };
                
                return {
                    ...house,
                    country: house.country || regionToCountry[house.region] || 'other'
                };
            });
            
            console.log('🏠 Houses after transformation:', housesToShow.map(h => ({name: h.name, country: h.country})));
            
        } catch (error) {
            console.error('❌ Failed to load houses from Supabase:', error);
            housesToShow = [...hackerHouses, ...registeredHouses];
        }
    } else {
        housesToShow = houses;
    }
    
    // Apply country filter if set
    const filterValue = window.selectedCountry || '';
    
    if (filterValue && filterValue !== '' && filterValue !== 'all') {
        console.log(`🌍 Filtering by country: "${filterValue}"`);
        const originalCount = housesToShow.length;
        housesToShow = housesToShow.filter(house => {
            const houseCountry = house.country || 'other';
            return houseCountry === filterValue;
        });
        console.log(`🌍 Filtered from ${originalCount} to ${housesToShow.length} houses`);
    } else {
        console.log(`🌍 No country filter applied, showing all ${housesToShow.length} houses`);
    }
    
    const housesList = document.getElementById('housesList');
    const emptyState = document.getElementById('emptyState');
    
    if (!housesList) {
        console.error('❌ housesList element not found');
        return;
    }
    
    if (housesToShow.length === 0) {
        housesList.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    housesList.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    
    housesList.innerHTML = housesToShow.map(house => `
        <div class="simple-card p-6">
            ${house.photos && Array.isArray(house.photos) && house.photos.length > 0 ? `
                <div class="mb-4">
                    <img src="${house.photos[0]}" alt="${house.name}" class="w-full h-48 object-cover border border-black" onerror="this.style.display='none'">
                    ${house.photos.length > 1 ? `<p class="text-xs text-gray-600 mt-1">+${house.photos.length - 1} more photos</p>` : ''}
                </div>
            ` : ''}
            
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <span class="text-3xl mr-3">${house.image}</span>
                    <div>
                        <h3 class="text-lg font-bold">${house.name}</h3>
                        <p class="text-sm">${house.location}</p>
                    </div>
                </div>
                <span class="border border-black px-2 py-1 text-xs font-mono">
                    ${getCountryName(house.country)}
                </span>
            </div>
            
            <p class="text-sm mb-4">${house.description}</p>
            
            <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                    <div>
                        <!-- Capacity info removed -->
                    </div>
                    <div class="font-mono">
                        <!-- Availability status removed -->
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
    const countryFilter = document.getElementById('countryFilter').value;
    const capacityFilter = document.getElementById('filterCapacity').value;
    const facilityFilter = document.getElementById('filterFacility').value;
    
    let filteredHouses = [...hackerHouses, ...registeredHouses];
    
    if (countryFilter) {
        filteredHouses = filteredHouses.filter(house => house.country === countryFilter);
    }
    
    if (capacityFilter) {
        filteredHouses = filteredHouses.filter(house => house.capacity === parseInt(capacityFilter));
    }
    

    
    displayHouseList(filteredHouses);
}

// フィルターをクリア
function clearFilters() {
    document.getElementById('countryFilter').value = '';
    document.getElementById('filterCapacity').value = '';
    document.getElementById('filterFacility').value = '';
    displayHouseList();
}

// Country filterをクリア
function clearCountryFilter() {
    window.selectedCountry = '';
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter) {
        countryFilter.value = '';
    }
    loadHackerHousesList();
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

    
    const modalContent = `
        <div class="space-y-6">
            <div class="flex items-center space-x-4">
                <span class="text-4xl">${house.image}</span>
                <div>
                    <h3 class="text-xl font-bold">${house.name}</h3>
                    <p class="text-sm">${house.location}</p>
                    <span class="border border-black px-2 py-1 text-xs font-mono">${getCountryName(house.country)}</span>
                </div>
            </div>
            
            <div>
                <h4 class="font-bold mb-2">Description</h4>
                <p class="text-sm">${house.description}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">

                <div>
                    <h4 class="font-bold mb-2">Contact</h4>
                    <p class="text-sm">${house.email || 'Email not provided'}</p>
                </div>
            </div>
            

            
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

// Get country display name
function getCountryName(country) {
    const countryMap = {
        'japan': 'Japan',
        'usa': 'USA',
        'uk': 'UK',
        'singapore': 'Singapore',
        'canada': 'Canada',
        'australia': 'Australia',
        'germany': 'Germany',
        'france': 'France',
        'netherlands': 'Netherlands',
        'other': 'Other'
    };
    return countryMap[country] || country;
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
            const homeHousesEl = document.getElementById('homeRegisteredHouses');
            const homeRegionsEl = document.getElementById('homeActiveRegions');
            
            if (homeHousesEl) homeHousesEl.textContent = totalHouses;
            if (homeRegionsEl) homeRegionsEl.textContent = activeRegions;
            
        } else {
            // ローカルデータを使用
            const totalFounders = registeredFounders.length;
            const totalHouses = registeredHouses.length + hackerHouses.length;
            const activeRegions = new Set([...registeredHouses.map(h => h.region), ...hackerHouses.map(h => h.region)]).size;
            
            const homeHousesEl = document.getElementById('homeRegisteredHouses');
            const homeRegionsEl = document.getElementById('homeActiveRegions');
            
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
        
        const housesList = document.getElementById('housesList');
        const emptyState = document.getElementById('emptyState');
        
        if (!housesList) return; // ハウス一覧ページでない場合
        
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
        
        // Filter houses by selected country
        if (window.selectedCountry) {
            housesToShow = housesToShow.filter(house => house.country === window.selectedCountry);
        }
        
        // Filter houses by selected capacity
        if (window.selectedCapacity) {
            housesToShow = housesToShow.filter(house => house.capacity === parseInt(window.selectedCapacity));
        }
        
        // Filter houses by selected facility
        if (window.selectedFacility) {
            housesToShow = housesToShow.filter(house => 
                house.features && house.features.includes(window.selectedFacility)
            );
        }
        
        if (housesToShow.length === 0) {
            housesList.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        housesList.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        
        housesList.innerHTML = housesToShow.map(house => `
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
                        ${getCountryName(house.country)}
                    </span>
                </div>
                
                <p class="text-sm mb-4">${house.description}</p>
                
                ${house.sns ? `
                <div class="mb-4">
                    <a href="${house.sns}" target="_blank" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline">
                        🔗 Visit SNS/Website
                    </a>
                </div>
                ` : `<div class="mb-4 text-xs text-gray-400">DEBUG: No SNS field for ${house.name}</div>`}
                
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-sm">
                        <div>
                            <!-- Capacity info removed -->
                        </div>
                        <div class="font-mono">
                            <!-- Availability status removed -->
                        </div>
                    </div>
                    <button onclick="contactHouse('${house.name}')" class="w-full simple-button px-4 py-2 text-sm font-mono">
                        Apply to This House
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
    document.getElementById('editHouseSNS').value = house.sns || '';
    document.getElementById('editHouseCountry').value = house.country || '';
    document.getElementById('editHouseDescription').value = house.description || '';
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
    
    const updatedCountry = document.getElementById('editHouseCountry').value;
    
    // Map country to region for backward compatibility
    const countryToRegion = {
        'japan': 'tokyo',
        'usa': 'sf',
        'uk': 'london',
        'singapore': 'singapore',
        'canada': 'other',
        'australia': 'other',
        'germany': 'other',
        'france': 'other',
        'netherlands': 'other',
        'other': 'other'
    };
    
    const updatedRegion = countryToRegion[updatedCountry] || 'other';
    
    const updatedData = {
        name: document.getElementById('editHouseName').value,
        location: document.getElementById('editHouseLocation').value,
        sns: document.getElementById('editHouseSNS').value,
        country: updatedCountry,
        region: updatedRegion, // Ensure region is also updated
        description: document.getElementById('editHouseDescription').value
    };
    
    // バリデーション
    if (!updatedData.name || !updatedData.location || !updatedData.sns || !updatedData.country || !updatedData.description) {
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
    
    // Add country filter event listener
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter) {
        console.log('✅ Country filter element found, adding event listener');
        countryFilter.addEventListener('change', function() {
            console.log('🌍 Country filter changed to:', this.value);
            displayHouseList();
        });
    } else {
        console.log('❌ Country filter element not found');
    }
    
    // Also add immediate setup for when page loads
    document.addEventListener('DOMContentLoaded', function() {
        const filter = document.getElementById('countryFilter');
        if (filter && !filter.hasAttribute('data-listener-added')) {
            console.log('🔄 Adding country filter listener on DOMContentLoaded');
            filter.addEventListener('change', function() {
                console.log('🌍 Country filter changed to:', this.value);
                loadHackerHousesList();
            });
            filter.setAttribute('data-listener-added', 'true');
        }
    });

// Global function for inline onchange event
function filterByCountry(value) {
    console.log('🌍 Filter by country called with value:', value);
    
    // Store the filter value globally
    window.selectedCountry = value;
    
    // Load houses with the new filter
    loadHackerHousesList();
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
        
        // Generate unique consent ID
        const consentId = `PC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const consentRecord = { ...consentData, id: consentId };
        
        // Try to save to Supabase if available, but don't fail if it doesn't work
        try {
            if (typeof SupabaseDB !== 'undefined' && SupabaseDB.createOrUpdateParentalConsent) {
                const dbRecord = await SupabaseDB.createOrUpdateParentalConsent(consentData);
                console.log('✅ Parental consent saved to database:', dbRecord);
                consentRecord.id = dbRecord.id;
            } else {
                console.log('ℹ️ SupabaseDB not available or method missing, using local consent ID');
            }
        } catch (dbError) {
            console.log('⚠️ Database save failed for parental consent, continuing with local ID:', dbError.message);
            // Continue with local consent ID
        }
        
        console.log('✅ Parental consent processed:', consentRecord);
        
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
        // For minors with parental consent, proceed directly to email sending
        // No database save needed - email contains all necessary information
        console.log('📧 Proceeding directly to email sending for minor with parental consent');
        
        // Save locally for reference only (optional)
        const applicationRecord = {
            ...founderData,
            id: Date.now(),
            selectedHouses: selectedHouses.map(h => h.name),
            parentalConsentId: parentalConsentId,
            created_at: new Date().toISOString(),
            type: 'parental_consent_application'
        };
        
        // Store in localStorage for user's reference
        const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        existingApplications.push(applicationRecord);
        localStorage.setItem('applications', JSON.stringify(existingApplications));
        console.log('💾 Application saved locally for reference:', applicationRecord);
        
        // Use mailto approach for parental consent applications
        sendViaMailtoWithParentalConsent(founderData, selectedHouses, parentalConsentId);
        
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
        // This should not happen with mailto approach
        console.log('Unexpected error in parental consent flow:', error);
    }
}

// Send application via mailto (opens user's email client)
function sendViaMailto(formData, selectedHouses) {
    console.log('📬 sendViaMailto called with:', { formData, selectedHouses });
    
    if (selectedHouses.length === 0) {
        console.log('❌ No houses provided to sendViaMailto');
        alert('Please select at least one house to apply to.');
        return;
    }
    
    console.log('✅ Houses validation passed, proceeding with mailto...');

    // Generate perfect application email content
    const generateEmailContent = (house) => {
        const subject = `🏠 New Founder Application: ${formData.name} - ${formData.project}`;
        
        const body = `Dear ${house.name} team,%0D%0A%0D%0AI am writing to apply for accommodation at ${house.name} through the Homeless Founders platform.%0D%0A%0D%0AABOUT ME:%0D%0A- Name: ${formData.name}%0D%0A- Age: ${formData.age}%0D%0A- Email: ${formData.email}%0D%0A- Current Location: ${formData.location}%0D%0A- Portfolio/SNS: ${formData.portfolio}%0D%0A%0D%0AMY PROJECT:%0D%0A${formData.project}%0D%0A%0D%0AACCOMMODATION DETAILS:%0D%0A- Preferred Start Date: ${formData.startDate}%0D%0A- Preferred End Date: ${formData.endDate}%0D%0A- Duration: ${calculateDuration(formData.startDate, formData.endDate)}%0D%0A%0D%0AADDITIONAL INFORMATION:%0D%0A${formData.message || 'I am excited about the opportunity to join your community and contribute to the vibrant ecosystem of founders and entrepreneurs.'}%0D%0A%0D%0AThank you for considering my application. I look forward to hearing from you.%0D%0A%0D%0A📧 REPLY OPTIONS:%0D%0AYou can reply to this email directly, or contact me at: ${formData.email}%0D%0ABoth options work perfectly for further communication.%0D%0A%0D%0ABest regards,%0D%0A${formData.name}%0D%0A${formData.email}%0D%0A%0D%0A---%0D%0AApplied via Homeless Founders Platform%0D%0APlatform: https://homelessfounders.com`;

        return { subject, body };
    };

    // Open email client for each selected house
    let emailsOpened = 0;
    
    selectedHouses.forEach((house, index) => {
        setTimeout(() => {
            console.log(`📧 Processing house ${index + 1}/${selectedHouses.length}:`, house);
            
            const { subject, body } = generateEmailContent(house);
            const mailtoLink = `mailto:${house.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            console.log(`📬 Generated mailto link for ${house.name}:`, mailtoLink.substring(0, 100) + '...');
            console.log(`🚀 Opening email client for ${house.name}...`);
            
            // Skip mailto entirely - directly show email options for reliability
            console.log(`📧 Opening email options for ${house.name}...`);
            showEmailOptions(house, subject, body);
            emailsOpened++;
            
            // Show completion message after all emails are processed
            if (emailsOpened === selectedHouses.length) {
                setTimeout(() => {
                    const houseNames = selectedHouses.map(h => h.name).join(', ');
                    console.log(`✅ All email options shown for: ${houseNames}`);
                }, 100);
            }
        }, index * 1000); // Delay each email by 1 second to avoid overwhelming
    });
}

// Universal email opening function with multiple fallback methods
function tryOpenEmail(mailtoLink, house, subject, body) {
    console.log(`🔄 Trying multiple email opening methods for ${house.name}...`);
    console.log(`📧 Mailto link: ${mailtoLink.substring(0, 150)}...`);
    console.log(`🌐 User agent: ${navigator.userAgent}`);
    console.log(`🔗 Current URL: ${window.location.href}`);
    
    let methodResults = [];
    
    // Method 1: Try window.location.href (works in most browsers)
    try {
        console.log(`🔄 Attempting Method 1: window.location.href`);
        window.location.href = mailtoLink;
        console.log(`✅ Method 1 (location.href) executed for ${house.name}`);
        methodResults.push('Method 1: Executed (location.href)');
        
        // Give it a moment to work, then check if we're still on the same page
        setTimeout(() => {
            if (window.location.href.includes('browse-houses.html')) {
                console.log(`⚠️ Method 1 may have failed - still on same page`);
            } else {
                console.log(`✅ Method 1 likely succeeded - page changed`);
            }
        }, 1000);
        
        return true; // Assume success since no error was thrown
    } catch (e) {
        console.log(`❌ Method 1 failed: ${e.message}`);
        methodResults.push(`Method 1: Failed - ${e.message}`);
    }
    
    // Method 2: Try window.open (works in some browsers)
    try {
        console.log(`🔄 Attempting Method 2: window.open`);
        const opened = window.open(mailtoLink);
        console.log(`📊 window.open result:`, opened);
        
        if (opened) {
            console.log(`✅ Method 2 (window.open) succeeded for ${house.name}`);
            methodResults.push('Method 2: Succeeded (window.open)');
            return true;
        } else {
            console.log(`⚠️ Method 2: window.open returned null/undefined`);
            methodResults.push('Method 2: Failed - returned null');
        }
    } catch (e) {
        console.log(`❌ Method 2 failed: ${e.message}`);
        methodResults.push(`Method 2: Failed - ${e.message}`);
    }
    
    // Method 3: Try creating a temporary link and clicking it
    try {
        console.log(`🔄 Attempting Method 3: temporary link click`);
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.style.display = 'none';
        link.target = '_blank';
        document.body.appendChild(link);
        
        console.log(`📊 Created link element:`, link);
        console.log(`📊 Link href:`, link.href);
        
        link.click();
        document.body.removeChild(link);
        
        console.log(`✅ Method 3 (temporary link) executed for ${house.name}`);
        methodResults.push('Method 3: Executed (temporary link)');
        return true;
    } catch (e) {
        console.log(`❌ Method 3 failed: ${e.message}`);
        methodResults.push(`Method 3: Failed - ${e.message}`);
    }
    
    console.log(`❌ All email opening methods failed for ${house.name}`);
    console.log(`📊 Method results:`, methodResults);
    
    // Show detailed debug info to user
    alert(`🔍 Debug Info for ${house.name}:\n\n${methodResults.join('\n')}\n\nBrowser: ${navigator.userAgent.split(' ')[0]}\n\nWill now show email options...`);
    
    return false;
}

// Show email options - the reliable solution for all browsers
function showEmailOptions(house, subject, body) {
    const decodedBody = decodeURIComponent(body.replace(/%0D%0A/g, '\n'));
    
    // Remove any existing modals first
    const existingModals = document.querySelectorAll('.email-modal');
    existingModals.forEach(modal => modal.remove());
    
    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create a modal with website-consistent design
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
        font-family: 'Space Mono', monospace;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; 
        border: 2px solid black; 
        max-width: 500px; 
        width: 100%; 
        max-height: 90vh; 
        overflow-y: auto;
        font-family: 'Space Mono', monospace;
    `;
    
    modalContent.innerHTML = `
        <div style="background: black; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px; font-weight: normal;">Send Application to ${house.name}</h2>
        </div>
        
        <div style="padding: 30px;">
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 20px; font-size: 12px; font-family: 'Space Mono', monospace;">
                <strong>⚠️ Note:</strong> Choose your preferred email service below. Your browser may show a security warning - please click "Continue" or "Allow" to proceed.
            </div>
            
            <div style="margin-bottom: 30px;">
                <button id="gmail-btn" 
                        style="display: block; width: 100%; padding: 15px; background: black; color: white; border: none; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; margin-bottom: 10px; transition: background-color 0.2s;">
                    📧 Open in Gmail
                </button>
                
                <button id="outlook-btn" 
                        style="display: block; width: 100%; padding: 15px; background: white; color: black; border: 2px solid black; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; margin-bottom: 10px; transition: all 0.2s;">
                    📨 Open in Outlook
                </button>
                
                <button id="mailto-btn" 
                        style="display: block; width: 100%; padding: 15px; background: white; color: black; border: 2px solid black; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; margin-bottom: 15px; transition: all 0.2s;">
                    ${isMobile ? '📱 Default Email App' : '💻 Default Email App'}
                </button>
                
                <button id="copy-btn" 
                        style="display: block; width: 100%; padding: 15px; background: white; color: black; border: 2px solid black; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; transition: all 0.2s;">
                    📋 Copy Email Content
                </button>
            </div>
            
            <div style="border-top: 1px solid #ccc; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <strong style="font-size: 14px;">Email Details:</strong>
                    <button id="close-btn" 
                            style="background: white; color: black; border: 1px solid black; padding: 8px 12px; cursor: pointer; font-size: 12px; font-family: 'Space Mono', monospace;">
                        ✕ Close
                    </button>
                </div>
                <div style="font-size: 12px; margin-bottom: 15px;">
                    <strong>To:</strong> ${house.email}<br>
                    <strong>Subject:</strong> ${subject}
                </div>
                <details>
                    <summary style="cursor: pointer; font-size: 12px; margin-bottom: 10px;">📄 Preview Email Content</summary>
                    <div style="white-space: pre-wrap; font-size: 11px; background: #f5f5f5; padding: 15px; border: 1px solid #ddd; max-height: 200px; overflow-y: auto; font-family: 'JetBrains Mono', monospace;">${decodedBody}</div>
                </details>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    
    // Add event listeners after DOM is created
    setTimeout(() => {
        const primaryEmailBtn = modal.querySelector('#primary-email-btn');
        const copyBtn = modal.querySelector('#copy-btn');
        const closeBtn = modal.querySelector('#close-btn');
        
        const gmailBtn = modal.querySelector('#gmail-btn');
        const outlookBtn = modal.querySelector('#outlook-btn');
        const mailtoBtn = modal.querySelector('#mailto-btn');
        
        if (gmailBtn) {
            gmailBtn.addEventListener('click', () => {
                console.log('Gmail button clicked');
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${house.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(decodedBody)}`;
                window.open(gmailUrl, '_blank');
                modal.remove();
            });
        }
        
        if (outlookBtn) {
            outlookBtn.addEventListener('click', () => {
                console.log('Outlook button clicked');
                const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${house.email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(decodedBody)}`;
                window.open(outlookUrl, '_blank');
                modal.remove();
            });
        }
        
        if (mailtoBtn) {
            mailtoBtn.addEventListener('click', () => {
                console.log('Default email app button clicked');
                const mailtoLink = `mailto:${house.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(decodedBody)}`;
                window.location.href = mailtoLink;
                modal.remove();
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                console.log('Copy button clicked');
                const content = `To: ${house.email}\nSubject: ${subject}\n\n${decodedBody}`;
                navigator.clipboard.writeText(content).then(() => {
                    // Show success message in website style
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: black; color: white; padding: 20px; 
                        font-family: 'Space Mono', monospace; font-size: 14px;
                        z-index: 10001; border: 2px solid white;
                    `;
                    successDiv.textContent = '📋 Email content copied to clipboard!';
                    document.body.appendChild(successDiv);
                    setTimeout(() => successDiv.remove(), 2000);
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = content;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: black; color: white; padding: 20px; 
                        font-family: 'Space Mono', monospace; font-size: 14px;
                        z-index: 10001; border: 2px solid white;
                    `;
                    successDiv.textContent = '📋 Email content copied to clipboard!';
                    document.body.appendChild(successDiv);
                    setTimeout(() => successDiv.remove(), 2000);
                });
                modal.remove();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Close button clicked');
                modal.remove();
            });
        }
        
        // Add hover effects
        primaryEmailBtn.addEventListener('mouseenter', () => {
            primaryEmailBtn.style.background = '#333';
        });
        primaryEmailBtn.addEventListener('mouseleave', () => {
            primaryEmailBtn.style.background = 'black';
        });
        
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = 'black';
            copyBtn.style.color = 'white';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = 'white';
            copyBtn.style.color = 'black';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }, 10);
    
    document.body.appendChild(modal);
}

// Show email options for parental consent applications
function showParentalConsentEmailOptions(house, subject, body) {
    // Remove any existing modals first
    const existingModals = document.querySelectorAll('.email-modal');
    existingModals.forEach(modal => modal.remove());
    
    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create a modal with website-consistent design
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
        font-family: 'Space Mono', monospace;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; 
        border: 2px solid black; 
        max-width: 500px; 
        width: 100%; 
        max-height: 90vh; 
        overflow-y: auto;
        font-family: 'Space Mono', monospace;
    `;
    
    modalContent.innerHTML = `
        <div style="background: black; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px; font-weight: normal;">Send Parental Consent Application to ${house.name}</h2>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #ffeb3b;">⚠️ This application includes parental consent information</p>
        </div>
        
        <div style="padding: 30px;">
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 20px; font-size: 12px; font-family: 'Space Mono', monospace;">
                <strong>⚠️ Note:</strong> Choose your preferred email service below. Your browser may show a security warning - please click "Continue" or "Allow" to proceed.
            </div>
            
            <div style="margin-bottom: 30px;">
                <button id="gmail-btn" 
                        style="display: block; width: 100%; padding: 15px; background: black; color: white; border: none; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; margin-bottom: 10px; transition: background-color 0.2s;">
                    📧 Open in Gmail
                </button>
                
                <button id="outlook-btn" 
                        style="display: block; width: 100%; padding: 15px; background: white; color: black; border: 2px solid black; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; margin-bottom: 10px; transition: all 0.2s;">
                    📨 Open in Outlook
                </button>
                
                <button id="mailto-btn" 
                        style="display: block; width: 100%; padding: 15px; background: white; color: black; border: 2px solid black; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; margin-bottom: 15px; transition: all 0.2s;">
                    ${isMobile ? '📱 Default Email App' : '💻 Default Email App'}
                </button>
                
                <button id="copy-btn" 
                        style="display: block; width: 100%; padding: 15px; background: white; color: black; border: 2px solid black; cursor: pointer; font-size: 16px; font-family: 'Space Mono', monospace; transition: all 0.2s;">
                    📋 Copy Email Content
                </button>
            </div>
            
            <div style="border-top: 1px solid #ccc; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <strong style="font-size: 14px; color: #ff9800;">⚠️ Parental Consent Application</strong>
                    <button id="close-btn" 
                            style="background: white; color: black; border: 1px solid black; padding: 8px 12px; cursor: pointer; font-size: 12px; font-family: 'Space Mono', monospace;">
                        ✕ Close
                    </button>
                </div>
                <div style="font-size: 12px; margin-bottom: 15px;">
                    <strong>To:</strong> ${house.email}<br>
                    <strong>Subject:</strong> ${subject}
                </div>
                <details>
                    <summary style="cursor: pointer; font-size: 12px; margin-bottom: 10px;">📄 Preview Email Content</summary>
                    <div style="white-space: pre-wrap; font-size: 11px; background: #f5f5f5; padding: 15px; border: 1px solid #ddd; max-height: 200px; overflow-y: auto; font-family: 'JetBrains Mono', monospace;">${body}</div>
                </details>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    
    // Add event listeners after DOM is created
    setTimeout(() => {
        const primaryEmailBtn = modal.querySelector('#primary-email-btn');
        const copyBtn = modal.querySelector('#copy-btn');
        const closeBtn = modal.querySelector('#close-btn');
        
        const gmailBtn = modal.querySelector('#gmail-btn');
        const outlookBtn = modal.querySelector('#outlook-btn');
        const mailtoBtn = modal.querySelector('#mailto-btn');
        
        if (gmailBtn) {
            gmailBtn.addEventListener('click', () => {
                console.log('Gmail button clicked (parental consent)');
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${house.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailUrl, '_blank');
                modal.remove();
            });
        }
        
        if (outlookBtn) {
            outlookBtn.addEventListener('click', () => {
                console.log('Outlook button clicked (parental consent)');
                const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${house.email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(outlookUrl, '_blank');
                modal.remove();
            });
        }
        
        if (mailtoBtn) {
            mailtoBtn.addEventListener('click', () => {
                console.log('Default email app button clicked (parental consent)');
                const mailtoLink = `mailto:${house.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoLink;
                modal.remove();
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                console.log('Copy button clicked (parental consent)');
                const content = `To: ${house.email}\nSubject: ${subject}\n\n${body}`;
                navigator.clipboard.writeText(content).then(() => {
                    // Show success message in website style
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: black; color: white; padding: 20px; 
                        font-family: 'Space Mono', monospace; font-size: 14px;
                        z-index: 10001; border: 2px solid white;
                    `;
                    successDiv.textContent = '📋 Email content copied to clipboard!';
                    document.body.appendChild(successDiv);
                    setTimeout(() => successDiv.remove(), 2000);
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = content;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    const successDiv = document.createElement('div');
                    successDiv.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: black; color: white; padding: 20px; 
                        font-family: 'Space Mono', monospace; font-size: 14px;
                        z-index: 10001; border: 2px solid white;
                    `;
                    successDiv.textContent = '📋 Email content copied to clipboard!';
                    document.body.appendChild(successDiv);
                    setTimeout(() => successDiv.remove(), 2000);
                });
                modal.remove();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Close button clicked (parental consent)');
                modal.remove();
            });
        }
        
        // Add hover effects
        primaryEmailBtn.addEventListener('mouseenter', () => {
            primaryEmailBtn.style.background = '#333';
        });
        primaryEmailBtn.addEventListener('mouseleave', () => {
            primaryEmailBtn.style.background = 'black';
        });
        
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = 'black';
            copyBtn.style.color = 'white';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = 'white';
            copyBtn.style.color = 'black';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }, 10);
    
    document.body.appendChild(modal);
}

// Global functions for email options
window.openGmail = function(email, subject, body) {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
};

window.openOutlook = function(email, subject, body) {
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}&body=${body}`;
    window.open(outlookUrl, '_blank');
};

window.tryNativeMailto = function(email, subject, body) {
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    try {
        window.location.href = mailtoLink;
        console.log('✅ Native mailto attempted');
    } catch (e) {
        alert('❌ Could not open default email app. Please use one of the other options.');
        console.error('Native mailto failed:', e);
    }
};

window.copyEmailContent = function(email, subject, body) {
    const content = `To: ${email}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(content).then(() => {
        alert('📋 Email content copied to clipboard!\n\nYou can now paste it into any email client.');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('📋 Email content copied to clipboard!');
    });
};

// Send application via mailto with parental consent
function sendViaMailtoWithParentalConsent(formData, selectedHouses, parentalConsentId) {
    if (selectedHouses.length === 0) {
        alert('Please select at least one house to apply to.');
        return;
    }

    // Generate perfect application email content with parental consent
    const generateEmailContent = (house) => {
        const subject = `🏠 Founder Application (Minor with Parental Consent): ${formData.name} - ${formData.project}`;
        
        // Get parent information from the consent form
        const parentName = document.getElementById('inlineParentName')?.value || 'Not provided';
        const parentEmail = document.getElementById('inlineParentEmail')?.value || 'Not provided';
        const parentPhone = document.getElementById('inlineParentPhone')?.value || 'Not provided';
        const relationship = document.getElementById('inlineRelationship')?.value || 'Not provided';
        
        const body = `Dear ${house.name} team,%0D%0A%0D%0AI hope this email finds you well. I am writing to apply for accommodation at ${house.name} through the Homeless Founders platform.%0D%0A%0D%0A⚠️ IMPORTANT: This application is for a minor (under 18) with verified parental consent.%0D%0A%0D%0AMINOR INFORMATION:%0D%0A- Name: ${formData.name}%0D%0A- Age: ${formData.age} (Minor - under 18)%0D%0A- Email: ${formData.email}%0D%0A- Current Location: ${formData.location}%0D%0A%0D%0APARENT/GUARDIAN CONTACT INFORMATION:%0D%0A- Parent/Guardian Name: ${parentName}%0D%0A- Relationship: ${relationship}%0D%0A- Email: ${parentEmail}%0D%0A- Phone: ${parentPhone}%0D%0A- Consent Date: ${new Date().toLocaleDateString()}%0D%0A- Consent ID: ${parentalConsentId}%0D%0A%0D%0AMY PROJECT:%0D%0A${formData.project}%0D%0A%0D%0AACCOMMODATION DETAILS:%0D%0A- Preferred Start Date: ${formData.startDate}%0D%0A- Preferred End Date: ${formData.endDate}%0D%0A- Duration: ${calculateDuration(formData.startDate, formData.endDate)}%0D%0A%0D%0ALEGAL COMPLIANCE NOTICE:%0D%0A- Parental consent has been obtained and digitally signed%0D%0A- Parent/Guardian has acknowledged all risks and responsibilities%0D%0A- Parent/Guardian takes full responsibility for minor's safety and welfare%0D%0A- All legal requirements for minor accommodation have been addressed%0D%0A- Parent/Guardian contact information provided above for direct communication%0D%0A%0D%0AADDITIONAL INFORMATION:%0D%0A${formData.message || 'I am excited about the opportunity to join your community and contribute to the vibrant ecosystem of founders and entrepreneurs, with full parental support.'}%0D%0A%0D%0AI believe ${house.name} would be the perfect environment for me to develop my project while connecting with like-minded individuals. My parents/guardians fully support this opportunity and I am committed to being a positive and contributing member of your community.%0D%0A%0D%0APlease feel free to contact my parent/guardian directly at ${parentEmail} or ${parentPhone} for any questions or verification.%0D%0A%0D%0AThank you for considering my application. I look forward to hearing from you.%0D%0A%0D%0A📧 REPLY OPTIONS:%0D%0AYou can reply to this email directly, or contact me at: ${formData.email}%0D%0AIf you need to contact my parent/guardian (optional): ${parentEmail}%0D%0AAll communication methods work perfectly.%0D%0A%0D%0ABest regards,%0D%0A${formData.name}%0D%0A${formData.email}%0D%0A%0D%0AParent/Guardian: ${parentName} (${parentEmail})%0D%0A%0D%0A---%0D%0AApplied via Homeless Founders Platform%0D%0APlatform: https://homelessfounders.com%0D%0AParental Consent ID: ${parentalConsentId}`;

        return { subject, body };
    };

    // Open email client for each selected house
    let emailsOpened = 0;
    
    selectedHouses.forEach((house, index) => {
        setTimeout(() => {
            const { subject, body } = generateEmailContent(house);
            const decodedBody = decodeURIComponent(body.replace(/%0D%0A/g, '\n'));
            
            console.log(`📧 Opening parental consent email options for ${house.name}...`);
            showParentalConsentEmailOptions(house, subject, decodedBody);
            emailsOpened++;
            
            // Show completion message after all emails are processed
            if (emailsOpened === selectedHouses.length) {
                setTimeout(() => {
                    const houseNames = selectedHouses.map(h => h.name).join(', ');
                    console.log(`✅ All parental consent email options shown for: ${houseNames}`);
                }, 100);
            }
        }, index * 1000); // Delay each email by 1 second to avoid overwhelming
    });
}

// Calculate duration between two dates
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week(s)`;
    return `${Math.ceil(diffDays / 30)} month(s)`;
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
        
        // Check if SupabaseDB is available
        if (typeof SupabaseDB === 'undefined') {
            console.error('SupabaseDB is not defined. Using fallback data.');
            throw new Error('SupabaseDB not available');
        }
        
        houses = await SupabaseDB.getAllHackerHouses();
        console.log('Loaded houses from database:', houses);
        console.log('Number of houses loaded:', houses.length);
        console.log('🔍 DEBUG: First house sns field:', houses[0]?.sns);
        console.log('🔍 DEBUG: All houses with sns:', houses.map(h => ({ name: h.name, sns: h.sns })));
        
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
            
            // Map region to country for backward compatibility if country is missing
            const regionToCountry = {
                'tokyo': 'japan',
                'sf': 'usa',
                'london': 'uk',
                'singapore': 'singapore',
                'other': 'other'
            };
            
            return {
                ...house,
                image: getRegionEmoji(house.region),
                description: house.description,
                capacity: house.capacity,
                features: features,
                photos: house.photos || [],
                country: house.country || regionToCountry[house.region] || 'other', // Add country mapping
                sns: house.sns // Ensure sns field is preserved
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
                country: "japan"
            },
            {
                name: "SF Startup Hub",
                location: "San Francisco, CA",
                email: "apply@sfhub.co",
                description: "YC-style accelerator environment in the heart of Silicon Valley. Connect with investors and fellow founders.",
                capacity: 12,
                country: "usa"
            },
            {
                name: "Berlin Builders",
                location: "Berlin, Germany", 
                email: "team@berlinbuilders.com",
                description: "European startup community focused on sustainable tech and social impact ventures.",
                capacity: 6,
                country: "germany"
            }
        ];
    }
    
    // Apply country filter if set
    const filterValue = window.selectedCountry || '';
    
    if (filterValue && filterValue !== '' && filterValue !== 'all') {
        console.log(`🌍 Filtering by country: "${filterValue}"`);
        const originalCount = houses.length;
        houses = houses.filter(house => {
            const houseCountry = house.country || 'other';
            return houseCountry === filterValue;
        });
        console.log(`🌍 Filtered from ${originalCount} to ${houses.length} houses`);
    } else {
        console.log(`🌍 No country filter applied, showing all ${houses.length} houses`);
    }
    
    // Browse Houses ページの一覧
    const browseContainer = document.getElementById('housesList');
    const emptyState = document.getElementById('emptyState');
    
    if (!browseContainer) return;
    
    if (houses.length === 0) {
        browseContainer.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    browseContainer.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    
    browseContainer.innerHTML = houses.map(house => `
        <div class="simple-card p-6">
            ${house.photos && Array.isArray(house.photos) && house.photos.length > 0 ? `
                <div class="mb-4">
                    <img src="${house.photos[0]}" alt="${house.name}" class="w-full h-48 object-cover border border-black" onerror="this.style.display='none'">
                    ${house.photos.length > 1 ? `<p class="text-xs text-gray-600 mt-1">+${house.photos.length - 1} more photos</p>` : ''}
                </div>
            ` : ''}
            
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                    <span class="text-3xl mr-3">${house.image}</span>
                    <div>
                        <h3 class="text-lg font-bold">${house.name}</h3>
                        <p class="text-sm">${house.location}</p>
                    </div>
                </div>
                <span class="border border-black px-2 py-1 text-xs font-mono">
                    ${getCountryName(house.country)}
                </span>
            </div>
            
            <p class="text-sm mb-4">${house.description}</p>
            
            <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                    <div>
                        <!-- Capacity info removed -->
                    </div>
                    <div class="font-mono">
                        <!-- Availability status removed -->
                    </div>
                </div>
                <button onclick="showDirectApplicationForm('${house.name}', '${house.email}')" class="w-full simple-button px-4 py-2 text-sm font-mono">
                    Apply to This House
                </button>
            </div>
        </div>
    `).join('');
    
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
    console.log('🚀 Starting application submission...');
    
    // Get form data
    const formData = {
        name: document.getElementById('appName').value,
        email: document.getElementById('appEmail').value,
        age: parseInt(document.getElementById('appAge').value),
        project: document.getElementById('appProject').value,
        startDate: document.getElementById('appStartDate').value,
        endDate: document.getElementById('appEndDate').value,
        portfolio: document.getElementById('appPortfolio').value,
        message: document.getElementById('appMessage').value
    };

    console.log('📝 Form data collected:', formData);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.age || !formData.project || !formData.startDate || !formData.endDate || !formData.portfolio) {
        console.log('❌ Validation failed - missing required fields');
        alert('Please fill in all required fields');
        return;
    }
    
    console.log('✅ Form validation passed');

    // Get selected houses
    const selectedHouses = [];
    const checkboxes = document.querySelectorAll('.house-checkbox:checked');
    
    console.log('🏠 Checking selected houses...');
    console.log('Checkboxes found:', checkboxes.length);
    console.log('Window.selectedHouse:', window.selectedHouse);
    
    if (checkboxes.length === 0) {
        // Check if this is a direct application to a single house
        if (window.selectedHouse) {
            selectedHouses.push(window.selectedHouse);
            console.log('✅ Using direct application house:', window.selectedHouse);
        } else {
            console.log('❌ No houses selected');
            alert('Please select at least one house to apply to');
            return;
        }
    } else {
        checkboxes.forEach(checkbox => {
            const house = {
                name: checkbox.dataset.name,
                email: checkbox.dataset.email
            };
            selectedHouses.push(house);
            console.log('✅ Added house:', house);
        });
    }
    
    console.log('📋 Final selected houses:', selectedHouses);

    try {
        // Check if applicant is a minor
        if (formData.age < 18) {
            // Show parental consent form
            showParentalConsentForm(formData, selectedHouses);
            return;
        }

        // For adults, proceed with application
        try {
            if (typeof SupabaseDB !== 'undefined') {
                // Proceed directly to email sending - no database save needed
                // Email contains all necessary information for house owners
                console.log('📧 Proceeding directly to email sending for regular application');
                
                // Save locally for user's reference only (optional)
                const applicationRecord = {
                    ...formData,
                    id: Date.now(),
                    selectedHouses: selectedHouses.map(h => h.name),
                    created_at: new Date().toISOString(),
                    type: 'regular_application'
                };
                
                // Store in localStorage for user's reference
                const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
                existingApplications.push(applicationRecord);
                localStorage.setItem('applications', JSON.stringify(existingApplications));
                console.log('💾 Application saved locally for reference:', applicationRecord);

                // Use mailto approach - opens user's email client with pre-filled content
                console.log('📧 Calling sendViaMailto with:', { formData, selectedHouses });
                sendViaMailto(formData, selectedHouses);
                console.log('✅ sendViaMailto completed');
            } else {
                console.log('ℹ️ SupabaseDB not available, skipping database save');
            }
        } catch (dbError) {
            console.log('⚠️ Database save failed, continuing with email sending:', dbError.message);
            // Don't throw error - continue with email sending
        }
        
        // Hide application form and show houses list
        if (document.getElementById('applicationForm')) {
            document.getElementById('applicationForm').style.display = 'none';
            document.getElementById('applicationSuccess').style.display = 'block';
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
        // This should not happen with mailto approach
        console.log('Unexpected error in main application flow:', error);
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
async function verifyHouseEmail() {
    const email = document.getElementById('verifyEmail').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    console.log('Finding houses for email:', email);
    
    try {
        let allHouses = [];
        
        // Debug: Check if SupabaseDB is available
        console.log('🔧 Debug - SupabaseDB available:', typeof SupabaseDB !== 'undefined');
        console.log('🔧 Debug - supabaseClient available:', typeof supabaseClient !== 'undefined');
        
        // Get houses from Supabase database
        if (typeof SupabaseDB !== 'undefined') {
            console.log('🔍 Searching for houses in Supabase database...');
            try {
                const dbHouses = await SupabaseDB.getHackerHouses();
                console.log('🔧 Debug - Raw database response:', dbHouses);
                console.log('🔧 Debug - Database houses count:', dbHouses ? dbHouses.length : 0);
                
                if (dbHouses && dbHouses.length > 0) {
                    console.log('🔧 Debug - Sample house emails:', dbHouses.slice(0, 3).map(h => h.email));
                }
                
                const userHouses = dbHouses.filter(h => h.email && h.email.toLowerCase() === email.toLowerCase());
                allHouses = allHouses.concat(userHouses);
                console.log(`✅ Found ${userHouses.length} houses in database for email: ${email}`);
            } catch (dbError) {
                console.log('⚠️ Database query failed:', dbError.message);
                console.error('🔧 Debug - Full database error:', dbError);
            }
        } else {
            console.log('⚠️ SupabaseDB not available - using localStorage only');
        }
        
        // Get houses from localStorage
        const localHouses = JSON.parse(localStorage.getItem('registeredHouses') || '[]');
        const userLocalHouses = localHouses.filter(h => h.email && h.email.toLowerCase() === email.toLowerCase());
        allHouses = allHouses.concat(userLocalHouses);
        console.log(`✅ Found ${userLocalHouses.length} houses in local storage`);
        
        // Remove duplicates based on name and location
        const uniqueHouses = allHouses.filter((house, index, self) => 
            index === self.findIndex(h => h.name === house.name && h.location === house.location)
        );
        
        console.log(`✅ Total unique houses found: ${uniqueHouses.length}`);
        
        if (uniqueHouses.length === 0) {
            alert('No houses found for this email address.\n\nPlease make sure you entered the correct email address you used when registering your house(s).');
            return;
        }
        
        if (uniqueHouses.length === 1) {
            // Only one house - proceed directly to editing
            selectHouseForEditing(uniqueHouses[0]);
        } else {
            // Multiple houses - show selection screen
            showHouseSelectionScreen(uniqueHouses);
        }
        
    } catch (error) {
        console.error('❌ Error finding houses:', error);
        alert('Error searching for houses. Please try again or check your internet connection.');
    }
}

// Show house selection screen when multiple houses are found
function showHouseSelectionScreen(houses) {
    document.getElementById('emailVerification').style.display = 'none';
    
    // Create house selection screen
    const selectionHtml = `
        <div id="houseSelection" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Select House to Edit</h2>
            <p>We found ${houses.length} houses registered with this email. Please select which one you'd like to edit:</p>
            
            <div style="display: grid; gap: 15px; margin: 20px 0;">
                ${houses.map((house, index) => `
                    <div onclick="selectHouseForEditing(window.foundHouses[${index}])" 
                         style="border: 2px solid #ddd; border-radius: 8px; padding: 20px; cursor: pointer; transition: all 0.2s; background: white;"
                         onmouseover="this.style.borderColor='#007bff'; this.style.backgroundColor='#f8f9fa';"
                         onmouseout="this.style.borderColor='#ddd'; this.style.backgroundColor='white';">
                        <h3 style="margin: 0 0 10px 0; color: #333;">${house.name || 'Unnamed House'}</h3>
                        <p style="margin: 5px 0; color: #666;"><strong>📍 Location:</strong> ${house.location || 'Not specified'}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>🌍 Region:</strong> ${house.region || 'Not specified'}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>📧 Contact:</strong> ${house.email || 'Not specified'}</p>
                        ${house.description ? `<p style="margin: 10px 0 0 0; color: #888; font-size: 14px;">${house.description.substring(0, 100)}${house.description.length > 100 ? '...' : ''}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            
            <button onclick="goBackToEmailVerification()" 
                    style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px;">
                ← Back to Email Entry
            </button>
        </div>
    `;
    
    // Store houses globally for selection
    window.foundHouses = houses;
    
    // Insert selection screen
    const container = document.querySelector('.container') || document.body;
    const selectionDiv = document.createElement('div');
    selectionDiv.innerHTML = selectionHtml;
    container.appendChild(selectionDiv);
}

// Select a specific house for editing
function selectHouseForEditing(house) {
    console.log('✅ Selected house for editing:', house);
    
    // Store current house for editing
    window.currentEditingHouse = house;
    
    // Hide selection screen if it exists
    const selectionScreen = document.getElementById('houseSelection');
    if (selectionScreen) {
        selectionScreen.remove();
    }
    
    // Show edit form
    document.getElementById('emailVerification').style.display = 'none';
    document.getElementById('editHouseForm').style.display = 'block';
    
    // Fill form with house data
    document.getElementById('editHouseName').value = house.name || '';
    document.getElementById('editHouseLocation').value = house.location || '';
    document.getElementById('editHouseDescription').value = house.description || '';
    // Note: capacity and rent fields don't exist in the actual form
    
    console.log('✅ House data loaded successfully for editing');
}

// Go back to email verification
function goBackToEmailVerification() {
    const selectionScreen = document.getElementById('houseSelection');
    if (selectionScreen) {
        selectionScreen.remove();
    }
    document.getElementById('emailVerification').style.display = 'block';
    document.getElementById('verifyEmail').value = '';
}

async function updateHouseInfo() {
    const formData = {
        name: document.getElementById('editHouseName').value,
        location: document.getElementById('editHouseLocation').value,
        description: document.getElementById('editHouseDescription').value
        // Note: Only updating fields that actually exist in the form
    };
    
    console.log('Updating house info:', formData);
    
    if (!window.currentEditingHouse) {
        alert('Error: No house selected for editing');
        return;
    }
    
    try {
        let updateSuccess = false;
        
        // Try to update in Supabase database
        if (typeof SupabaseDB !== 'undefined') {
            console.log('🔄 Updating house in Supabase database...');
            try {
                const updatedHouse = await SupabaseDB.updateHackerHouse(window.currentEditingHouse.id, formData);
                console.log('✅ House updated in database:', updatedHouse);
                updateSuccess = true;
            } catch (dbError) {
                console.log('⚠️ Database update failed, updating local storage:', dbError.message);
            }
        }
        
        // Update in localStorage as fallback or backup
        const localHouses = JSON.parse(localStorage.getItem('registeredHouses') || '[]');
        const houseIndex = localHouses.findIndex(h => h.email === window.currentEditingHouse.email);
        
        if (houseIndex !== -1) {
            localHouses[houseIndex] = { ...localHouses[houseIndex], ...formData };
            localStorage.setItem('registeredHouses', JSON.stringify(localHouses));
            console.log('✅ House updated in local storage');
            updateSuccess = true;
        }
        
        if (updateSuccess) {
            // 成功メッセージを表示
            document.getElementById('editHouseForm').style.display = 'none';
            document.getElementById('verificationStatus').style.display = 'block';
            document.getElementById('verificationStatus').innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #28a745;">✅ House Updated Successfully!</h3>
                    <p>Your house information has been updated and will be reflected on the platform.</p>
                    <button onclick="location.reload()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        Edit Another House
                    </button>
                </div>
            `;
            console.log('✅ House information updated successfully');
        } else {
            alert('Failed to update house information. Please try again.');
        }
        
    } catch (error) {
        console.error('❌ Error updating house info:', error);
        alert('Error updating house information. Please try again.');
    }
}

// Delete house function
async function deleteHouse() {
    if (!window.currentEditingHouse) {
        alert('Error: No house selected for deletion');
        return;
    }
    
    const houseName = window.currentEditingHouse.name || 'this house';
    const confirmMessage = `Are you absolutely sure you want to delete "${houseName}"?\n\nThis action cannot be undone and will:\n- Remove your house from the platform\n- Stop all future applications\n- Delete all house data permanently\n\nType "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    
    if (userInput !== 'DELETE') {
        alert('House deletion cancelled.');
        return;
    }
    
    try {
        let deleteSuccess = false;
        
        // Try to delete from Supabase database
        if (typeof SupabaseDB !== 'undefined' && window.currentEditingHouse.id) {
            console.log('🗑️ Deleting house from Supabase database...');
            try {
                await SupabaseDB.deleteHackerHouse(window.currentEditingHouse.id);
                console.log('✅ House deleted from database');
                deleteSuccess = true;
            } catch (dbError) {
                console.log('⚠️ Database deletion failed:', dbError.message);
            }
        }
        
        // Delete from localStorage as well
        const localHouses = JSON.parse(localStorage.getItem('registeredHouses') || '[]');
        const filteredHouses = localHouses.filter(h => 
            !(h.email === window.currentEditingHouse.email && h.name === window.currentEditingHouse.name)
        );
        
        if (filteredHouses.length < localHouses.length) {
            localStorage.setItem('registeredHouses', JSON.stringify(filteredHouses));
            console.log('✅ House deleted from local storage');
            deleteSuccess = true;
        }
        
        if (deleteSuccess) {
            // Show success message
            document.getElementById('editHouseForm').style.display = 'none';
            document.getElementById('verificationStatus').style.display = 'block';
            document.getElementById('verificationStatus').innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #dc3545;">🗑️ House Deleted Successfully</h3>
                    <p>Your house "${houseName}" has been permanently deleted from the platform.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 10px;">Thank you for being part of the Homeless Founders community.</p>
                    <button onclick="location.href='/index.html'" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                        Return to Home
                    </button>
                </div>
            `;
            console.log('✅ House deleted successfully');
        } else {
            alert('Failed to delete house. Please try again or contact support.');
        }
        
    } catch (error) {
        console.error('❌ Error deleting house:', error);
        alert('Error deleting house. Please try again.');
    }
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
