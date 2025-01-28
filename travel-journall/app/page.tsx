"use client";

import { useState, useEffect } from "react";
import { JournalEntry } from "@/components/journal/journal-entry";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getJournals } from "@/lib/journalService";
import { useAuth } from "@/contexts/auth-context";
import type { JournalEntry as JournalEntryType } from "@/types/journal";
import useEmblaCarousel from 'embla-carousel-react';

// Mock slides data
const slides = [
  {
    image: "COORG.jpg",
    title: "Coorg, Karnataka",
    subtitle: "Scotland of India",
  },
  {
    image: "DARJEELING.jpg",
    title: "Darjeeling, West Bengal",
    subtitle: "Queen of Hills",
  },
  {
    image: "GANGTOK.jpg",
    title: "Gangtok, Sikkim",
    subtitle: "City of Monasteries",
  },
  {
    image: "SHILLONG.jpg",
    title: "Shillong, Meghalaya",
    subtitle: "Scotland of East",
  },
];

export default function Home() {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const { user } = useAuth();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  // Set up auto-sliding
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Handle slide change
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const journalEntries = await getJournals(user.id);
          setEntries(journalEntries);
        } catch (error) {
          console.error("Error fetching journal entries:", error);
        }
      }
    };

    fetchEntries();
  }, [user]);

  // Sample posts (Replace with actual data later)
  const samplePosts = [
    {
      title: "Taj Mahal, Agra",
      description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.",
      image: "/TAJ_MAHAL.jpg",
    },
    {
      title: "Andaman Islands",
      description: "The Andaman Islands are a group of islands in the Bay of Bengal, known for their white sandy beaches and clear waters.",
      image: "/ANDAMAN.jpg",
    },
    {
      title: "Leh, Ladakh",
      description: "Leh is the largest town in the region of Ladakh, known for its beautiful landscapes and Buddhist monasteries.",
      image: "/LEH_LADAKH.jpg",
    },
  ];

  return (
    <div className="space-y-12 bg-transparent text-black">
      {/* Carousel Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center text-black">Discover Stunning Destinations</h2>
        <Carousel 
          className="w-full max-w-4xl mx-auto"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[16/9]">
                  <div
                    className="w-full h-full bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(/${slide.image})` }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                      <h2 className="text-lg font-bold">{slide.title}</h2>
                      <p className="text-sm">{slide.subtitle}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Rest of the component remains the same */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-black">Welcome to Travel Journal</h1>
        <p className="text-lg max-w-3xl mx-auto text-white">
          Travel Journal is your personal space to document and share your travel adventures. 
          Explore scenic destinations, capture memories with photos, and let the world discover the beauty of your journeys.
        </p>
        <p className="text-sm text-white">
          Note: All content is user-generated. Images are sourced from personal uploads or public galleries.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center text-black">Featured Travel Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <div
                className="w-full h-40 bg-cover bg-center rounded-lg mb-4"
                style={{
                  backgroundImage: `url(${post.image})`,
                }}
              ></div>
              <h3 className="font-bold text-xl text-black">{post.title}</h3>
              <p className="text-sm text-gray-700 text-center">{post.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 bg-transparent">
        <div className="container mx-auto text-center space-y-4">
          <h3 className="text-lg font-semibold text-white">About the Website</h3>
          <p className="max-w-3xl mx-auto text-white">
            Travel Journal is an interactive platform designed to help you record and relive your travel experiences.
            Our goal is to create a space where memories come alive, whether through personal journals or stunning photo galleries.
          </p>
          <p className="text-sm text-white">
            All images and content are shared under Creative Commons or user-specific licensing.
          </p>
        </div>
      </footer>
    </div>
  );
}