'use client'
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"
import { SearchBar } from "@/components/SearchBar";

interface Perfume {
  key: number;
  brand: string;
  perfume: string;
  image_url: string;
  longevity: string;
  sillage: string;
  reviews: string;
  notes: string;
  main_accords: string;
  recommended_perfumes?: string;
}

interface CardProps {
  perfume: Perfume;
}

const Card: React.FC<CardProps> = ({ perfume }) => {
  return (
    <div className="bg-white border border-secondaryLight rounded-lg shadow-xl overflow-hidden p-2 md:p-4 lg:p-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <Link href={`/product/${perfume.key}`} className="block" prefetch={false}>
        <div className="pt-2 md:pt-4">
          <Image
            src={perfume.image_url}
            alt={`${perfume.brand} ${perfume.perfume}`}
            width={375}
            height={500}
            className="w-full h-48 md:h-64 object-cover rounded-t-2xl"
          />
        </div>
        <div className="pt-4 rounded-b-2xl">
          <h3 className="text-xl font-bold mb-2">{perfume.perfume}</h3>
          <p className="text-primary font-semibold text-lg mb-1">{perfume.brand}</p>
        </div>
      </Link>
    </div>
  );
};

export default function Recommendation() {
  const [searchedPerfume, setSearchedPerfume] = useState<Perfume | null>(null);
  const [recommendedPerfumes, setRecommendedPerfumes] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [no_of_recs, setNoOfRecs] = useState<number>(8);
  const key = Number(usePathname()?.split("/")[2]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // fetch searched perfume and recommended perfumes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/get_perfume_by_key?key=${key}&no_of_recs=${no_of_recs}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Perfume = await response.json();
        setSearchedPerfume(data);
        if (data.recommended_perfumes) {
          const recKeys = JSON.parse(data.recommended_perfumes) as number[];
          const recommendedData = await Promise.all(
            recKeys.slice(0, no_of_recs).map(async (recKey) => {
              const recResponse = await fetch(`${backendUrl}/api/get_perfume_by_key?key=${recKey}`);
              if (!recResponse.ok) throw new Error('Network response was not ok');
              return recResponse.json();
            })
          );
          setRecommendedPerfumes(recommendedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key,no_of_recs]);

  return (
    <>
      <div className="container grow mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <SearchBar />
        </div>
        
        {/* searched perfume card */}
        {searchedPerfume && (
          <div className="mb-6">
            <p className="flex items-center mb-2 text-primary font-bold text-xl">Recommendations based on:</p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-fit h-20 flex items-center px-4 mb-6 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl">
              <Link href={`/product/${key}`} className="searchedperfumecard flex items-center">
                <Image
                  src={searchedPerfume.image_url}
                  alt={`${searchedPerfume.brand} ${searchedPerfume.perfume}`}
                  width={80}
                  height={80}
                  className="w-16 h-16 object-cover mr-4 rounded-2xl"
                />
                <div className="flex flex-col">
                  <h3 className="text-sm md:text-lg font-medium">{searchedPerfume.brand}</h3>
                  <h3 className="text-sm md:text-lg font-medium">{searchedPerfume.perfume}</h3>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* recommended perfumes or loading screen */}
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading recommendedations. Please Wait...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {recommendedPerfumes.map((perfume) => (
              <Card key={perfume.key} perfume={perfume} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}