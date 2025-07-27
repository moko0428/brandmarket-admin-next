'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card';
import { Separator } from '@/common/components/ui/separator';
import { X, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { createUserPost, createAdminPost, getStoresForPost } from '../action';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/common/components/ui/textarea';

interface Store {
  store_id: string;
  branch: string;
  address: string;
}

interface CreatePostFormProps {
  userRole: 'admin' | 'manager' | 'user';
  onSuccess?: () => void;
}

export function CreatePostForm({ userRole, onSuccess }: CreatePostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // URL 파라미터에 따른 게시물 타입 설정
  const [forcedPostType, setForcedPostType] = useState<
    'photo' | 'product' | null
  >(null);

  // 공통 필드
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // 어드민 전용 필드
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [availableStores, setAvailableStores] = useState<string[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const canCreateProduct = isAdmin || isManager;

  // URL 파라미터 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'photo') {
      setForcedPostType('photo');
    } else if (type === 'product' && canCreateProduct) {
      setForcedPostType('product');
    }
  }, [canCreateProduct]);

  // 실제 표시할 게시물 타입 결정
  const getDisplayPostType = () => {
    if (forcedPostType === 'photo') return 'photo';
    if (forcedPostType === 'product' && canCreateProduct) return 'product';
    if (canCreateProduct) return 'product'; // 기본적으로 admin/manager는 상품 게시물
    return 'photo'; // 일반 사용자는 사진 게시물
  };

  const displayPostType = getDisplayPostType();
  const isProductPost = displayPostType === 'product';

  // 매장 목록 로드 (상품 게시물일 때만)
  const loadStores = useCallback(async () => {
    if (!isProductPost) return;

    console.log('매장 목록 로딩 시작...');
    setLoadingStores(true);

    try {
      const result = await getStoresForPost();
      console.log('매장 로드 결과:', result);

      if (result.success) {
        setStores(result.data || []);
        console.log('로드된 매장 수:', result.data?.length || 0);
      } else {
        console.error('매장 로드 실패:', result.error);
        toast.error('매장 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('매장 로드 에러:', error);
      toast.error('매장 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoadingStores(false);
    }
  }, [isProductPost]);

  // 컴포넌트 마운트 시 매장 목록 로드
  useEffect(() => {
    loadStores();
  }, [loadStores]);

  // 이미지 업로드
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      // 최대 5개 이미지 제한
      if (images.length + files.length > 5) {
        toast.error('최대 5개의 이미지만 업로드할 수 있습니다.');
        return;
      }

      setUploadingImages(true);

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append(
          'postType',
          isProductPost ? 'admin_product' : 'user_photo'
        );

        const response = await fetch('/api/posts/images', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '이미지 업로드 실패');
        }

        setImages((prev) => [...prev, ...data.urls]);
        toast.success(`${files.length}개의 이미지가 업로드되었습니다.`);
      } catch (error) {
        console.error('이미지 업로드 에러:', error);
        toast.error(
          error instanceof Error ? error.message : '이미지 업로드 실패'
        );
      } finally {
        setUploadingImages(false);
        e.target.value = ''; // 파일 입력 초기화
      }
    },
    [images.length, isProductPost]
  );

  // 이미지 제거
  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 매장 선택 토글
  const toggleStore = useCallback((storeId: string) => {
    setAvailableStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  }, []);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (images.length === 0) {
      toast.error('최소 1개의 이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isProductPost) {
        // 상품 게시물 유효성 검사
        if (!productName.trim()) {
          toast.error('상품명을 입력해주세요.');
          return;
        }
        if (!price || isNaN(Number(price))) {
          toast.error('올바른 가격을 입력해주세요.');
          return;
        }
        if (!size.trim()) {
          toast.error('사이즈를 입력해주세요.');
          return;
        }
        if (!color.trim()) {
          toast.error('컬러를 입력해주세요.');
          return;
        }
        if (availableStores.length === 0) {
          toast.error('최소 1개의 매장을 선택해주세요.');
          return;
        }

        result = await createAdminPost({
          title: title.trim(),
          content: content.trim() || undefined,
          images,
          product_name: productName.trim(),
          price: Number(price),
          size: size.trim(),
          color: color.trim(),
          available_stores: availableStores,
        });
      } else {
        // 사진 게시물
        result = await createUserPost({
          title: title.trim(),
          content: content.trim() || undefined,
          images,
        });
      }

      if (result.success) {
        toast.success('게시물이 성공적으로 작성되었습니다.');
        onSuccess?.();
        router.push('/profile');
      } else {
        toast.error(result.error || '게시물 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시물 작성 에러:', error);
      toast.error('게시물 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {isProductPost ? '상품 게시물 작성' : '사진 게시물 작성'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이미지 업로드 */}
          <div className="space-y-3">
            <Label>이미지 ({images.length}/5)</Label>

            {/* 업로드된 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`업로드된 이미지 ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 파일 업로드 버튼 */}
            <div className="relative">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages || images.length >= 5}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingImages || images.length >= 5}
                className="w-full pointer-events-none"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingImages ? '업로드 중...' : '이미지 업로드'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP 형식, 최대 10MB, 최대 5개
            </p>
          </div>

          <Separator />

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시물 제목을 입력하세요"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="게시물 내용을 입력하세요"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* 상품 정보 - 상품 게시물일 때만 표시 */}
          {isProductPost && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">상품 정보</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">상품명 *</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="상품명을 입력하세요"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">가격 *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="가격을 입력하세요"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">사이즈 *</Label>
                    <Input
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="사이즈를 입력하세요 (예: S, M, L)"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">컬러 *</Label>
                    <Input
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="컬러를 입력하세요"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* 매장 선택 - 개선된 버전 */}
                <div className="space-y-2">
                  <Label>판매 매장 * ({availableStores.length}개 선택됨)</Label>

                  {loadingStores ? (
                    <div className="flex items-center justify-center p-4 border rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      <span className="ml-2">매장 목록 로딩 중...</span>
                    </div>
                  ) : stores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {stores.map((store) => (
                        <div
                          key={store.store_id}
                          onClick={() => toggleStore(store.store_id)}
                          className={`p-2 rounded cursor-pointer transition-colors ${
                            availableStores.includes(store.store_id)
                              ? 'bg-blue-100 border-blue-300'
                              : 'bg-gray-50 hover:bg-gray-100'
                          } border`}
                        >
                          <div className="font-medium text-sm">
                            {store.branch}
                          </div>
                          <div className="text-xs text-gray-600">
                            {store.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                      <p>매장 정보가 없습니다.</p>
                      <p className="text-xs mt-1">매장을 먼저 등록해주세요.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                images.length === 0 ||
                (isProductPost && loadingStores)
              }
              className="flex-1"
            >
              {isSubmitting ? '작성 중...' : '게시물 작성'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
