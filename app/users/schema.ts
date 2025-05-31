import {
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';

const users = pgSchema('auth').table('users', {
  id: uuid().primaryKey(),
});

// 역할 enum
export const roles = pgEnum('role', ['admin', 'manager', 'user']);

// 역할 변경 타입
export const roleChangeTypes = pgEnum('role_change_type', [
  'promotion', // 승격
  'demotion', // 강등
  'initial', // 초기 설정
]);

// 기존 profiles 테이블
export const profiles = pgTable('profiles', {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  avatar: text(),
  name: text().notNull(),
  storename: text().notNull(),
  role: roles('role').default('user').notNull(),
  is_active: boolean().default(true).notNull(), // 계정 활성화 상태
  last_login: timestamp(), // 마지막 로그인 시간
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// 역할 변경 이력 테이블 (단순화)
export const roleChangeLogs = pgTable('role_change_logs', {
  id: uuid().primaryKey().defaultRandom(),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  changed_by: uuid() // 변경을 수행한 관리자
    .notNull()
    .references(() => profiles.profile_id),
  previous_role: roles('role').notNull(),
  new_role: roles('role').notNull(),
  change_type: roleChangeTypes('role_change_type').notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

// 매니저 권한 정보 테이블
export const managerPermissions = pgTable('manager_permissions', {
  profile_id: uuid()
    .primaryKey()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  can_edit_products: boolean().default(true).notNull(),
  can_view_reports: boolean().default(true).notNull(),
  can_manage_inventory: boolean().default(true).notNull(),
  assigned_stores: text().array(), // 담당 스토어 목록
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
