export const positions = [
  {
    id: 1,
    title: '브랜드마켓-홍대1호점',
    latlng: { lat: 37.555588, lng: 126.923089 },
  },
  {
    id: 2,
    title: '브랜드마켓-성수',
    latlng: {
      lat: 37.54406975675041,
      lng: 127.05024699007517,
    },
  },
  {
    id: 3,
    title: '브랜드마켓-강남',
    latlng: {
      lat: 37.50093292254849,
      lng: 127.02667251879825,
    },
  },
  {
    id: 4,
    title: '브랜드마켓-홍대2호점',
    latlng: {
      lat: 37.55185463006174,
      lng: 126.92132000574637,
    },
  },
];

export const stores = [
  {
    id: 1,
    name: '브랜드마켓 홍대1호점',
    address: '서울 마포구 홍익로6길 27 (동교동)',
    openTime: '10:30 - 22:00',
    image: '/assets/images/홍대_매장사진.jpeg',
  },
  {
    id: 2,
    name: '브랜드마켓 성수점',
    address: '서울 성동구 연무장길 5 (성수동2가)',
    openTime: '10:30 - 21:30',
    image: '/assets/images/성수_매장사진.jpeg',
  },
  {
    id: 3,
    name: '브랜드마켓 강남점',
    address: '서울 강남구 강남대로 410 (역삼동)',
    openTime: '10:30 - 22:00',
    image: '/assets/images/강남_매장사진.jpeg',
  },
  {
    id: 4,
    name: '브랜드마켓 홍대2호점',
    address: '서울 마포구 어울림마당로 75 (서교동)',
    openTime: '11:30 - 22:30',
    image: '/assets/images/상상마당점_매장사진.jpeg',
  },
];

export const detailStoreList = [
  {
    id: 1,
    name: '브랜드마켓 홍대1호점',
    address: '서울 마포구 홍익로6길 27 (동교동)',
    openTime: '10:30 - 22:00',
    image: '/assets/images/홍대_매장사진.jpeg',
    place: ['2호선 홍대입구역 9번 출구로 나와서 218m 이동 (4분거리)'],
    copy: [
      {
        copy_road: '서울 마포구 홍익로6길 27',
        copy_street: '동교동 162-10',
      },
    ],
  },
  {
    id: 2,
    name: '브랜드마켓 성수점',
    address: '서울 성동구 연무장길 5 (성수동2가)',
    openTime: '10:30 - 21:30',
    image: '/assets/images/성수_매장사진.jpeg',
    place: [
      '수인분당선 서울숲역 1번 출구로 나와서 755m 이동 (12분거리)',
      '2호선 뚝섬역 5번 출구로 나와서 533m 이동 (9분거리)',
      '2호선 성수역 4번 출구로 나와서 673m 이동 (11분거리)',
    ],
    copy: [
      {
        copy_road: '서울 성동구 연무장길 5',
        copy_street: '성수동2가 301-64',
      },
    ],
  },
  {
    id: 3,
    name: '브랜드마켓 강남점',
    address: '서울 강남구 강남대로 410 (역삼동)',
    openTime: '10:30 - 22:00',
    image: '/assets/images/강남_매장사진.jpeg',
    place: [
      '2호선 강남역 11번 출구로 나와서 417m 이동 (7분거리)',
      '신분당선 신논현역 6번 출구로 나와서 381m 이동 (6분거리)',
    ],
    copy: [
      {
        copy_road: '서울 강남구 강남대로 410',
        copy_street: '역삼동 815-3',
      },
    ],
  },
  {
    id: 4,
    name: '브랜드마켓 홍대2호점',
    address: '서울 마포구 어울림마당로 75 (서교동)',
    openTime: '11:30 - 22:30',
    image: '/assets/images/상상마당점_매장사진.jpeg',
    place: [
      '2호선 합정역 3번 출구로 나와서 790m 이동 (13분거리)',
      '6호선 상수역 1번 출구로 나와서 658m 이동 (11분거리)',
    ],
    copy: [
      {
        copy_road: '서울 마포구 어울림마당로 75',
        copy_street: '서교동 366-19',
      },
    ],
  },
];

// detailStoreList와 positions를 연결하는 함수
export function getStoreWithPosition(storeId: number) {
  const store = detailStoreList.find((s) => s.id === storeId);
  const position = positions.find((p) => p.id === storeId);

  if (!store || !position) {
    throw new Error(`Store with id ${storeId} not found`);
  }

  return {
    ...store,
    latlng: position.latlng,
  };
}

// 모든 매장 정보를 좌표와 함께 가져오는 함수
export function getAllStoresWithPositions() {
  return detailStoreList.map((store) => {
    const position = positions.find((p) => p.id === store.id);
    return {
      ...store,
      latlng: position?.latlng || null,
    };
  });
}

// 특정 매장의 좌표만 가져오는 함수
export function getStorePosition(storeId: number) {
  const position = positions.find((p) => p.id === storeId);
  return position?.latlng || null;
}

// 특정 매장의 모든 정보와 좌표 가져오기
const storeWithPosition = getStoreWithPosition(1);
console.log(storeWithPosition);
// {
//   id: 1,
//   name: '브랜드마켓 홍대1호점',
//   address: '서울 마포구 홍익로6길 27 (동교동)',
//   openTime: '10:30 - 22:00',
//   image: '/assets/images/홍대_매장사진.jpeg',
//   place: ['2호선 홍대입구역 9번 출구로 나와서 218m 이동 (4분거리)'],
//   copy: [...],
//   latlng: { lat: 37.55566928369786, lng: 126.92311262723686 }
// }

// 모든 매장 정보와 좌표 가져오기
export const allStores = getAllStoresWithPositions();

// 특정 매장의 좌표만 가져오기
const position = getStorePosition(1);
console.log(position); // { lat: 37.55566928369786, lng: 126.92311262723686 }

export const openTimeOptions = [
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '12:00', label: '12:00' },
  { value: '12:30', label: '12:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
  { value: '17:00', label: '17:00' },
  { value: '17:30', label: '17:30' },
  { value: '18:00', label: '18:00' },
  { value: '18:30', label: '18:30' },
  { value: '19:00', label: '19:00' },
  { value: '19:30', label: '19:30' },
  { value: '20:00', label: '20:00' },
  { value: '20:30', label: '20:30' },
  { value: '21:00', label: '21:00' },
  { value: '21:30', label: '21:30' },
  { value: '22:00', label: '22:00' },
  { value: '22:30', label: '22:30' },
  { value: '23:00', label: '23:00' },
];
