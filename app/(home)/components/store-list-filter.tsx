import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';

export const StoreListFilter = ({
  sortType,
  setSortType,
  items,
}: {
  sortType: 'distance' | 'status' | 'none';
  setSortType: (value: 'distance' | 'status' | 'none') => void;
  items: { label: string; value: string }[];
}) => (
  <Select
    value={sortType}
    onValueChange={(value: 'distance' | 'status' | 'none') =>
      setSortType(value)
    }
  >
    <SelectTrigger className="w-[120px] bg-white">
      <SelectValue placeholder="정렬 기준" />
    </SelectTrigger>
    <SelectContent>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
