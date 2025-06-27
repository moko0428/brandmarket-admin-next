'use client';

import { Hero } from '@/common/components/hero';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Separator } from '@/common/components/ui/separator';
import { useState, useEffect } from 'react';
import { getStores, updateStore, deleteStore, addStore } from './action';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { browserClient } from '@/lib/supabase/client';
import { StoreImageUploader } from './components/upload';

// Supabase stores 테이블 타입
interface Store {
  store_id: string;
  branch: string;
  address: string;
  open_time: string;
  close_time: string;
  latitude: string;
  longitude: string;
  location: string;
  description: string;
  store_image: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
  directions: string[];
}

export default function StorePage() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [editedStores, setEditedStores] = useState<Store[]>([]);
  const [addBranch, setAddBranch] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [directionInputs, setDirectionInputs] = useState<string[]>([]);
  const [editingDirectionIndex, setEditingDirectionIndex] = useState<
    number | null
  >(null);

  // 초기 데이터 로드
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await getStores();
        setEditedStores(storesData);
        if (storesData.length > 0) {
          setSelectedStore(storesData[0].store_id);
        }
      } catch (error) {
        console.error('매장 데이터 로드 에러:', error);
        toast.error('매장 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = browserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const selectedStoreData = editedStores.find(
    (store) => store.store_id === selectedStore
  );

  // 선택된 매장이 변경될 때 direction 입력 필드 초기화
  useEffect(() => {
    if (selectedStoreData) {
      const directions = selectedStoreData.directions || [];
      setDirectionInputs(directions.length > 0 ? directions : ['']);
    }
  }, [selectedStoreData]);

  const handleStoreUpdate = (
    storeId: string,
    field: string,
    value: string | string[]
  ) => {
    setEditedStores((prev) =>
      prev.map((store) =>
        store.store_id === storeId ? { ...store, [field]: value } : store
      )
    );
  };

  const handleSaveStore = async (storeId: string) => {
    const storeToUpdate = editedStores.find((s) => s.store_id === storeId);
    if (!storeToUpdate) return;

    try {
      const result = await updateStore(storeId, {
        branch: storeToUpdate.branch,
        address: storeToUpdate.address,
        open_time: storeToUpdate.open_time,
        close_time: storeToUpdate.close_time,
        latitude: storeToUpdate.latitude,
        longitude: storeToUpdate.longitude,
        location: storeToUpdate.location,
        description: storeToUpdate.description,
        store_image: storeToUpdate.store_image,
        directions: directionInputs,
      });

      if (result.error) {
        toast.error(`저장 실패: ${result.error}`);
      } else {
        toast.success('매장 정보가 저장되었습니다.');
        // 서버에서 최신 데이터 다시 로드
        const updatedStores = await getStores();
        setEditedStores(updatedStores);
      }
    } catch {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!confirm('정말로 이 매장을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await deleteStore(storeId);

      if (result.error) {
        toast.error(`삭제 실패: ${result.error}`);
      } else {
        toast.success('매장이 삭제되었습니다.');

        // 로컬 상태 업데이트
        setEditedStores((prev) =>
          prev.filter((store) => store.store_id !== storeId)
        );

        // 선택된 매장이 삭제된 경우 다른 매장 선택
        if (selectedStore === storeId) {
          const remainingStores = editedStores.filter(
            (store) => store.store_id !== storeId
          );
          if (remainingStores.length > 0) {
            setSelectedStore(remainingStores[0].store_id);
          } else {
            setSelectedStore(null);
          }
        }
      }
    } catch {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleAddStore = async () => {
    if (!newStoreName.trim() || !currentUserId) return;

    try {
      const formData = new FormData();
      formData.append('branch', newStoreName);
      formData.append('address', '');
      formData.append('open_time', '10:00');
      formData.append('close_time', '22:00');
      formData.append('latitude', '0');
      formData.append('longitude', '0');
      formData.append('location', '');
      formData.append('description', '');
      formData.append('store_image', '/brandmarket_logo.png');
      formData.append('profile_id', currentUserId);
      formData.append('directions', JSON.stringify([]));

      const result = await addStore({ error: null, data: null }, formData);

      if (result.error) {
        toast.error(`매장 추가 실패: ${result.error}`);
      } else {
        toast.success('매장이 추가되었습니다.');

        const updatedStores = await getStores();
        setEditedStores(updatedStores);

        if (result.data) {
          setSelectedStore(result.data.store_id);
        }

        setNewStoreName('');
        setAddBranch(false);
      }
    } catch (error) {
      toast.error('매장 추가 중 오류가 발생했습니다.');
      console.log(error);
    }
  };

  const handleAddDirection = () => {
    setDirectionInputs((prev) => [...prev, '']);
  };

  const handleUpdateDirection = (index: number, value: string) => {
    setDirectionInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = value;
      return newInputs;
    });
  };

  const handleSaveDirection = () => {
    if (selectedStoreData) {
      handleStoreUpdate(
        selectedStoreData.store_id,
        'directions',
        directionInputs
      );
      setEditingDirectionIndex(null);
    }
  };

  const handleDeleteDirection = (index: number) => {
    setDirectionInputs((prev) => prev.filter((_, i) => i !== index));
    if (selectedStoreData) {
      const remainingDirections = directionInputs.filter((_, i) => i !== index);
      handleStoreUpdate(
        selectedStoreData.store_id,
        'directions',
        remainingDirections
      );
    }
  };

  const handleEditDirection = (index: number) => {
    setEditingDirectionIndex(index);
  };

  // 사용자 ID가 로드되지 않았을 때 로딩 표시
  if (!currentUserId) {
    return (
      <div className="px-10 h-[calc(100vh-100px)] flex items-center justify-center">
        <div>사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-10 h-[calc(100vh-100px)] flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="px-5 h-[calc(100vh-100px)] flex flex-col pb-10">
      <Hero title="매장 정보 관리" subtitle="매장 정보를 관리할 수 있습니다." />
      <aside className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2 col-span-1">
          <div className="flex justify-between items-center">
            <h2>매장 리스트</h2>
            <Button
              variant="outline"
              className="border-green-500"
              onClick={() => setAddBranch(true)}
            >
              매장 추가
            </Button>
          </div>

          <Separator />
          <div className="flex-1 overflow-y-auto space-y-2">
            {addBranch && (
              <div className="flex flex-col gap-2 p-2 border rounded-md bg-gray-50">
                <Input
                  type="text"
                  placeholder="매장 이름"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStore();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-green-500 flex-1"
                    onClick={handleAddStore}
                    disabled={!newStoreName.trim()}
                  >
                    추가
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-500 flex-1"
                    onClick={() => {
                      setNewStoreName('');
                      setAddBranch(false);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}
            {editedStores.map((store) => (
              <div
                key={store.store_id}
                className="flex w-full gap-2 items-center group"
              >
                <Button
                  variant={
                    selectedStore === store.store_id ? 'default' : 'outline'
                  }
                  className="flex-1 justify-start"
                  onClick={() => setSelectedStore(store.store_id)}
                >
                  {store.branch}
                </Button>
                <Button
                  variant="outline"
                  className={`border-red-500 transition-opacity ${
                    selectedStore === store.store_id
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  onClick={() => handleDeleteStore(store.store_id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 overflow-y-auto space-y-4">
          <div>
            <h2>매장 정보</h2>
            <Separator />
          </div>

          {selectedStoreData ? (
            <div className="space-y-4 pb-4">
              <div className="grid grid-cols-3 gap-4">
                <StoreImageUploader
                  storeId={selectedStoreData.store_id}
                  currentImageUrl={selectedStoreData.store_image}
                  onImageUploaded={(imageUrl) => {
                    handleStoreUpdate(
                      selectedStoreData.store_id,
                      'store_image',
                      imageUrl
                    );
                  }}
                  disabled={!selectedStoreData}
                />

                <div className="flex flex-col gap-2 col-span-2">
                  <div className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor="name">지점 이름</Label>
                    </div>
                    <Input
                      id="name"
                      placeholder="지점 이름 ex) 홍대 1호점, 강남점, 성수점"
                      value={selectedStoreData.branch}
                      onChange={(e) =>
                        handleStoreUpdate(
                          selectedStoreData.store_id,
                          'branch',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor="address">매장 주소</Label>
                    </div>
                    <Input
                      id="address"
                      placeholder="도로명 주소를 입력해주세요."
                      value={selectedStoreData.address}
                      onChange={(e) =>
                        handleStoreUpdate(
                          selectedStoreData.store_id,
                          'address',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Input
                      id="location"
                      placeholder="지번을 입력해주세요."
                      value={selectedStoreData.location}
                      onChange={(e) =>
                        handleStoreUpdate(
                          selectedStoreData.store_id,
                          'location',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor="description">매장 설명</Label>
                    </div>
                    <Input
                      id="description"
                      placeholder="매장에 대한 설명을 입력해주세요"
                      value={selectedStoreData.description}
                      onChange={(e) =>
                        handleStoreUpdate(
                          selectedStoreData.store_id,
                          'description',
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor="openTime">영업시간</Label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="openTime"
                        placeholder="10:00"
                        value={selectedStoreData.open_time}
                        onChange={(e) =>
                          handleStoreUpdate(
                            selectedStoreData.store_id,
                            'open_time',
                            e.target.value
                          )
                        }
                      />
                      <span>-</span>
                      <Input
                        id="closeTime"
                        placeholder="22:00"
                        value={selectedStoreData.close_time}
                        onChange={(e) =>
                          handleStoreUpdate(
                            selectedStoreData.store_id,
                            'close_time',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div>
                      <Label htmlFor="lat">매장 좌표</Label>
                      <small className="text-muted-foreground">
                        위도, 경도 값으로 입력해주세요.
                      </small>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="lat"
                        placeholder="위도"
                        value={selectedStoreData.latitude}
                        onChange={(e) =>
                          handleStoreUpdate(
                            selectedStoreData.store_id,
                            'latitude',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        id="lng"
                        placeholder="경도"
                        value={selectedStoreData.longitude}
                        onChange={(e) =>
                          handleStoreUpdate(
                            selectedStoreData.store_id,
                            'longitude',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label>오시는 길</Label>
                        <small className="text-muted-foreground">
                          오시는 길을 입력해주세요.
                        </small>
                      </div>
                      <Button
                        variant="outline"
                        className="border-green-500"
                        type="button"
                        onClick={handleAddDirection}
                      >
                        설명 추가 +
                      </Button>
                    </div>

                    {directionInputs.map((direction, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="교통 정보"
                          value={direction}
                          onChange={(e) =>
                            handleUpdateDirection(index, e.target.value)
                          }
                          disabled={
                            editingDirectionIndex !== index &&
                            editingDirectionIndex !== null
                          }
                        />
                        {editingDirectionIndex === index ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveDirection()}
                              className="border-green-500"
                            >
                              저장
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingDirectionIndex(null)}
                              className="border-gray-500"
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDirection(index)}
                              className="border-blue-500"
                            >
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDirection(index)}
                              className="border-red-500"
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="default"
                className="w-full"
                onClick={() => handleSaveStore(selectedStoreData.store_id)}
              >
                저장
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              매장을 선택해주세요
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
