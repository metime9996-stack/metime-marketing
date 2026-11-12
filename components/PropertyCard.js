import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const PropertyCard = ({ property }) => {
  const auth = useAuth();
  const user = auth ? auth.user : null;

  // الحالة اللي بتشيل مسار الصورة
  const [imgSrc, setImgSrc] = useState('/placeholder.jpg');

  // فنكشن تنضيف المسار وتحويله لسمول
  const getImageUrl = () => {
    if (property.images && property.images.length > 0 && property.images[0]) {
      const firstImage = property.images[0];
      if (typeof firstImage === 'string') {
        const lowerCaseImage = firstImage.toLowerCase().trim();
        return lowerCaseImage.startsWith('/') ? lowerCaseImage : `/${lowerCaseImage}`;
      }
      return firstImage;
    }
    // دي اللي بتشغل ملف الـ placeholder بتاعك
    return '/placeholder.jpg';
  };

  // أول ما الـ property تتغير، بنحدث الصورة
  useEffect(() => {
    setImgSrc(getImageUrl());
  }, [property]);

  const isFavorited = user?.favorites?.some(fav => fav?._id === property?._id) || false;

  const toggleFavorite = async () => {
    if (!user) return toast.error('Please login first!');
    try {
      await axios.patch(`/api/properties/${property._id}/favorite`);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="relative h-64">
        <Image
          src={imgSrc}
          alt={property.title || 'Property'}
          fill
          unoptimized // دي حركة صايعة عشان نتخطى أي كاش رخم
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          // لو المسار اللي جي من الداتا طلع غلط، ارمي الـ placeholder فوراً
          onError={() => {
            if (imgSrc !== '/placeholder.jpg') {
              setImgSrc('/placeholder.jpg');
            }
          }}
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
        >
          {isFavorited ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-600 text-xl" />
          )}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {property.type || 'Real Estate'}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            ${property.price ? property.price.toLocaleString() : '0'}
          </span>
        </div>

        <h3 className="font-bold text-xl mb-2 line-clamp-1">{property.title || 'Untitled Property'}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{property.description || 'No description available.'}</p>

        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4">
          <div>{property.bedrooms || 0} Beds</div>
          <div>{property.bathrooms || 0} Baths</div>
          <div>{property.area || 0} sqft</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;