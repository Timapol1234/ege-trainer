-- РўР°Р±Р»РёС†Р° РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- РўР°Р±Р»РёС†Р° РїСЂРѕС„РёР»РµР№ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    target_score INTEGER DEFAULT 80,
    deadline DATE,
    preferred_intensity TEXT DEFAULT 'medium',
    grade INTEGER DEFAULT 11,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- РўР°Р±Р»РёС†Р° РїСЂРµРґРјРµС‚РѕРІ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
CREATE TABLE IF NOT EXISTS user_subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, subject_name)
);

-- РўР°Р±Р»РёС†Р° РєРѕРґРѕРІ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ
CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER NOT NULL, -- в секундах
    test_data TEXT NOT NULL, -- JSON с деталями теста
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_subject ON test_results(subject);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);