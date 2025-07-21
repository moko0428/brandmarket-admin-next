-- profiles 테이블에 is_banned 컬럼 추가
ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;

-- 매니저-매장 연결 테이블 생성
CREATE TABLE manager_store_assignments (
  id SERIAL PRIMARY KEY,
  manager_id UUID REFERENCES profiles(profile_id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(store_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manager_id, store_id)
);

-- stores 테이블 (예시)
CREATE TABLE stores (
  store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);