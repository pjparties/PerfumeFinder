'use client'

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

const ScaleCircle = ({ value, label, color }: { value: string; label: string; color: string }) => {
  const percentage = parseInt(value); // Assuming value is 1-100
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-md">{label}</span>
      </div>
    </div>
  );
};

export default function Product(): JSX.Element {
  const key = Number(usePathname()?.split("/")[2]);
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/get_perfume_by_key?key=${key}`);
        if (!response.ok) throw new Error('Network response was not ok');
        setPerfume(await response.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [key]);

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (!perfume) return <div className="text-center p-8">No perfume data found.</div>;

  return (
    <div className="grow py-12 px-8">
      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2 flex items-center lg:justify-center lg:px-12 transition-all">
            <Image
              src={perfume.image_url}
              width={375}
              height={500}
              alt={`${perfume.brand} ${perfume.perfume}`}
              className=" rounded-lg shadow-xl "
              priority
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-7xl font-extrabold text-primaryMuted mt-6">{perfume.perfume}</h2>
            <h1 className="text-3xl font-extrabold text-primary ">{perfume.brand}</h1>
            {/* main accords and notes */}
            <div className="space-y-8">
              <div className="mainaccords">
                <h3 className="text-xl font-semibold text-primary mb-3">Main Accords:</h3>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {perfume.main_accords.split(',').map((accord, index) => (
                    <li key={index} className="bg-earthYellow rounded-full px-3 py-3 text-center capitalize font-bold text-sm text-primary flex items-center justify-center">
                      {accord.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="notesdiv">
                <h3 className="text-xl font-semibold text-primary mb-3">Notes:</h3>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {perfume.notes.split(',').map((note, index) => (
                    <li key={index} className="bg-teaRose rounded-full px-3 py-3 capitalize text-sm font-bold text-primary text-center flex items-center justify-center">
                      {note.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              {/* sillage and longevity */}
              <div className="flex space-x-8 py-8 lg:py-12 justify-center">
                <ScaleCircle value={Math.round(parseFloat(perfume.sillage)).toString()} label="Sillage" color="#525C70" />
                <ScaleCircle value={Math.round(parseFloat(perfume.longevity)).toString()} label="Longevity" color="#574141" />
              </div>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">No. of Reviews:</span> {perfume.reviews}
              </p>
            </div>

            <Link
              href={`https://www.jomashop.com/search?q=${encodeURIComponent(`${perfume.brand} ${perfume.perfume}`)}`}
              className="mt-6 inline-block bg-black text-white px-16 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}