'use client';

import { Button } from '@/components/ui/button';
import qs from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';

interface CategoryItemProps {
  label: string;
  icon?: IconType;
  value?: string;
}

export const CategoryItem = ({
  label,
  icon: Icon,
  value,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');
  const isSelected = currentCategory === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Button
      className="rounded-full"
      onClick={onClick}
      variant={isSelected ? 'primary' : 'outline'}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </Button>
  );
};
