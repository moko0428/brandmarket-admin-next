'use client';

import { useState, useEffect } from 'react';
import Height from '@/common/components/height';
import { Hero } from '@/common/components/hero';
import { Button } from '@/common/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/common/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/common/components/ui/dialog';
import { Badge } from '@/common/components/ui/badge';
import { Tables } from '@/database.types';
import {
  getAllMembers,
  banMember,
  getStores,
  assignManagerToStore,
  unassignManagerFromStore,
  getManagerStores,
  updateMemberRole,
} from '../../action';
import { toast } from 'sonner';
import { Ban, Store } from 'lucide-react';
import Image from 'next/image';

interface ManagerStoreAssignment {
  store_id: string;
  stores: {
    store_id: string;
    branch: string;
    address: string;
  };
}

type Profile = Tables<'profiles'>;
type Store = Tables<'stores'>;

export default function MemberManageSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [members, setMembers] = useState<Profile[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<Profile | null>(null);
  // 상태 타입 변경
  const [managerStores, setManagerStores] = useState<ManagerStoreAssignment[]>(
    []
  );

  // 회원 목록 로드
  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getAllMembers();
      setMembers(data || []);
    } catch (error) {
      console.error('회원 목록 로드 에러:', error);
      toast.error('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 매장 목록 로드
  const loadStores = async () => {
    try {
      console.log('매장 목록 로딩 시작...'); // 디버깅용
      const data = await getStores();
      console.log('로드된 매장 데이터:', data); // 디버깅용
      console.log('매장 데이터 타입:', typeof data, Array.isArray(data)); // 디버깅용

      setStores(data || []);
      console.log('상태에 설정된 매장 수:', (data || []).length); // 디버깅용
    } catch (error) {
      console.error('매장 목록 로드 에러:', error);
      toast.error('매장 목록을 불러오는데 실패했습니다.');
    }
  };

  // 매니저의 할당된 매장 로드
  const loadManagerStores = async (managerId: string) => {
    try {
      const data = await getManagerStores(managerId);
      // null이나 undefined 체크 추가
      setManagerStores(
        Array.isArray(data) ? (data as unknown as ManagerStoreAssignment[]) : []
      );
    } catch (error) {
      console.error('매니저 매장 로드 에러:', error);
      setManagerStores([]); // 에러 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    if (open) {
      loadMembers();
      loadStores();
    }
  }, [open]);

  // 벤 처리
  const handleBanMember = async (profileId: string, isBanned: boolean) => {
    setUpdating(profileId);
    try {
      const result = await banMember(profileId, isBanned);

      if (result.error) {
        throw new Error(result.error);
      }

      // 로컬 상태 업데이트
      setMembers((prev) =>
        prev.map((member) =>
          member.profile_id === profileId
            ? { ...member, is_banned: isBanned }
            : member
        )
      );

      toast.success(
        isBanned ? '회원이 벤 처리되었습니다.' : '회원의 벤이 해제되었습니다.'
      );
    } catch (error) {
      console.error('벤 처리 에러:', error);
      toast.error(
        `벤 처리 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    } finally {
      setUpdating(null);
    }
  };

  // 매니저-매장 연결
  const handleAssignStore = async (managerId: string, storeId: string) => {
    try {
      const result = await assignManagerToStore(managerId, storeId);

      if (result.error) {
        throw new Error(result.error);
      }

      // 매니저 매장 목록 새로고침
      if (selectedManager) {
        await loadManagerStores(selectedManager.profile_id);
      }

      toast.success('매장이 할당되었습니다.');
    } catch (error) {
      console.error('매장 할당 에러:', error);
      toast.error(
        `매장 할당 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    }
  };

  // 매니저-매장 연결 해제
  const handleUnassignStore = async (managerId: string, storeId: string) => {
    try {
      const result = await unassignManagerFromStore(managerId, storeId);

      if (result.error) {
        throw new Error(result.error);
      }

      // 매니저 매장 목록 새로고침
      if (selectedManager) {
        await loadManagerStores(selectedManager.profile_id);
      }

      toast.success('매장 할당이 해제되었습니다.');
    } catch (error) {
      console.error('매장 할당 해제 에러:', error);
      toast.error(
        `매장 할당 해제 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'manager':
        return '매니저';
      case 'user':
        return '사용자';
      default:
        return role;
    }
  };
  const handleChangeRole = async (profileId: string, newRole: string) => {
    setUpdating(profileId);
    try {
      const { error } = await updateMemberRole(profileId, newRole);
      if (error) throw new Error(error);

      setMembers((prev) =>
        prev.map((m) =>
          m.profile_id === profileId
            ? { ...m, role: newRole as 'admin' | 'manager' | 'user' }
            : m
        )
      );
      toast.success('역할이 변경되었습니다.');
    } catch (error) {
      toast.error(
        `역할 변경 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    } finally {
      setUpdating(null);
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-4xl mx-auto px-10 py-10">
        <SheetHeader className="hidden">
          <SheetTitle>회원 관리</SheetTitle>
        </SheetHeader>
        <Hero title="회원 관리" subtitle="회원을 관리할 수 있습니다." />
        <Height height={20} />

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div>회원 목록을 불러오는 중...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                회원 리스트 ({members.length}명)
              </h2>
              <Button onClick={loadMembers} variant="outline" size="sm">
                새로고침
              </Button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.profile_id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    member.is_banned ? 'bg-red-50 border-red-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.location_name}
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                          unoptimized // Supabase 스토리지 이미지의 경우 최적화 비활성화
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">이미지</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {member.location_name || '이름 없음'}
                        </p>
                        {member.is_banned && (
                          <Badge variant="destructive" className="text-xs">
                            벤됨
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        ID: {member.profile_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 역할 선택 */}
                    <Select
                      value={member.role}
                      onValueChange={(newRole) =>
                        handleChangeRole(member.profile_id, newRole)
                      }
                      disabled={updating === member.profile_id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          {updating === member.profile_id
                            ? '업데이트 중...'
                            : getRoleLabel(member.role)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">사용자</SelectItem>
                        <SelectItem value="manager">매니저</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 벤 처리 버튼 */}
                    <Button
                      variant={member.is_banned ? 'outline' : 'destructive'}
                      size="sm"
                      onClick={() =>
                        handleBanMember(member.profile_id, !member.is_banned)
                      }
                      disabled={updating === member.profile_id}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>

                    {/* 매니저인 경우 매장 관리 버튼 */}
                    {member.role === 'manager' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedManager(member);
                              loadManagerStores(member.profile_id);
                            }}
                          >
                            <Store className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {member.location_name}의 매장 관리
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* 할당된 매장 목록 */}
                            <div>
                              <h3 className="font-medium mb-2">할당된 매장</h3>
                              <div className="space-y-2">
                                {(managerStores || []).map((assignment) => (
                                  <div
                                    key={assignment.store_id}
                                    className="flex items-center justify-between p-2 border rounded"
                                  >
                                    <span>
                                      {assignment.stores?.branch ||
                                        '매장명 없음'}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUnassignStore(
                                          member.profile_id,
                                          assignment.store_id
                                        )
                                      }
                                    >
                                      해제
                                    </Button>
                                  </div>
                                ))}
                                {(!managerStores ||
                                  managerStores.length === 0) && (
                                  <p className="text-gray-500 text-sm">
                                    할당된 매장이 없습니다.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* 매장 할당 */}
                            <div>
                              <h3 className="font-medium mb-2">매장 할당</h3>
                              <Select
                                onValueChange={(storeId) =>
                                  handleAssignStore(member.profile_id, storeId)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="매장을 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  {stores.length === 0 ? (
                                    <SelectItem value="" disabled>
                                      등록된 매장이 없습니다
                                    </SelectItem>
                                  ) : (
                                    stores.map((store) => (
                                      <SelectItem
                                        key={store.store_id}
                                        value={store.store_id}
                                      >
                                        {store.branch}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              {stores.length === 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  매장을 먼저 등록해주세요.
                                </p>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {members.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                등록된 회원이 없습니다.
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
