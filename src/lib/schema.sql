-- Voркута Уголь — схема базы данных

-- Сотрудники
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  section TEXT NOT NULL,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Лента молний
CREATE TABLE IF NOT EXISTS lightning_feed (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('micro', 'injury', 'accident', 'fatal')),
  section TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  read_count INTEGER DEFAULT 0
);

-- Подтверждения ознакомления с молниями
CREATE TABLE IF NOT EXISTS lightning_acknowledgments (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  lightning_id INTEGER REFERENCES lightning_feed(id),
  acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, lightning_id)
);

-- Новости
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('company', 'section')),
  section TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Тесты
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('initial', 'repeat', 'unplanned')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Вопросы тестов
CREATE TABLE IF NOT EXISTS test_questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES tests(id),
  type TEXT NOT NULL CHECK (type IN ('question', 'slide')),
  text TEXT NOT NULL,
  image_url TEXT,
  options JSONB,
  correct_answers JSONB,
  explanation TEXT,
  slide_duration INTEGER DEFAULT 5,
  order_index INTEGER NOT NULL
);

-- Результаты тестов
CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  test_id INTEGER REFERENCES tests(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- База знаний
CREATE TABLE IF NOT EXISTS knowledge_base (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  position TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('text', 'pdf', 'video', 'scheme')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- РАЦ-предложения
CREATE TABLE IF NOT EXISTS rac_proposals (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  expected_effect TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'accepted', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Наряды-допуски
CREATE TABLE IF NOT EXISTS work_permits (
  id SERIAL PRIMARY KEY,
  work_type TEXT NOT NULL,
  location TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  brigade JSONB NOT NULL,
  safety_measures JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'closed')),
  created_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Зарплатные листы (квази-1С)
CREATE TABLE IF NOT EXISTS salary_slips (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  period TEXT NOT NULL,
  gross_amount NUMERIC(10,2) NOT NULL,
  net_amount NUMERIC(10,2) NOT NULL,
  items JSONB NOT NULL,
  paid_at TIMESTAMPTZ
);

-- График смен
CREATE TABLE IF NOT EXISTS shift_schedule (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  shift_date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('day', 'night', 'day_off')),
  section TEXT NOT NULL
);

-- Кейсы (геймификация)
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'advanced', 'rare')),
  cost_points INTEGER NOT NULL,
  rewards JSONB NOT NULL
);

-- Открытые кейсы
CREATE TABLE IF NOT EXISTS case_openings (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  case_id INTEGER REFERENCES cases(id),
  reward JSONB NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW()
);
