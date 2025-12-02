import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface CategoryCardProps {
  category: {
    _id: string;
    title: string;
    description: string;
    image: string;
    slug: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export default function CategoryCard({ category, className = '', style }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl aspect-[4/3] hover-lift ${className}`}
      style={style}
    >
      {/* Image */}
      <Image
        src={category.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
        alt={category.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
        <h3 className="font-display text-lg sm:text-xl font-semibold mb-1 group-hover:text-teal-400 transition-colors duration-300">
          {category.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-1 hidden sm:block">
          {category.description}
        </p>
      </div>

      {/* Hover Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-400/50 transition-colors duration-300" />
    </Link>
  );
}
