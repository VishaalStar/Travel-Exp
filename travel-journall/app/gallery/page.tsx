"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaTimes } from "react-icons/fa"; 
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Sample posts with multiple photos for each
const samplePosts = [
  {
    id: 1,
    title: "Silicon City",
    country: "India",
    state: "Karnataka",
    city: "Bengaluru",
    description:
      "The center of India's high-tech industry, the city is also known for its parks and nightlife",
    photos: [
      { url: "https://images.pexels.com/photos/30415153/pexels-photo-30415153/free-photo-of-tranquil-nyc-skyline-at-twilight.jpeg?auto=compress&cs=tinysrgb&w=600" },
      { url: "https://www.birlatrimayaa.in/images/birla/about-bangalore.webp" },
      { url: "https://images.pexels.com/photos/739987/pexels-photo-739987.jpeg?cs=srgb&dl=pexels-vivek-chugh-157138-739987.jpg&fm=jpg" } ],
    likes: 2000,
  },
  {
    id: 2,
    title: "Mountain Adventure",
    country: "Nepal",
    state: "Bagmati",
    city: "Kathmandu",
    description:
      "A thrilling trek to the Himalayan mountains. This journey includes climbing, camping under the stars, and visiting some of the most remote villages in Nepal. It will take you to new heights of adventure and wonder. The views are breathtaking, and the experience is unforgettable. It's a must-do for any adventure enthusiast.",
      photos: [
        { url: "https://cdn.kimkim.com/files/a/images/4953d217876a02cf0f7d7299f2363dad36606ee1/big-a03997e39a2ceffc2ff018975907d3bc.jpg" },
        { url: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Mount_Everest_as_seen_from_Drukair2.jpg" },
        { url: "https://www.intrepidtravel.com/adventures/wp-content/uploads/2018/06/Intrepid-Travel-nepal_annapurna_himalaya_culture_buddhism_prayer-flags_mountains.jpg" }
      ],
      likes: 120,
  },
  {
    id: 3,
    title: "City Exploration",
    country: "France",
    state: "Île-de-France",
    city: "Paris",
    description:
      "Exploring the history and beauty of Paris. From the Eiffel Tower to the Louvre, the city offers rich culture, amazing cuisine, and a chance to stroll along scenic streets. This experience is a must for any traveler. The vibrant life and iconic landmarks make Paris a unique and exciting city to visit. Spend a day wandering around its streets and enjoy the charm of its cafes.",
    photos: [
      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Notre-Dame_de_Paris_and_%C3%8Ele_de_la_Cit%C3%A9_at_dusk_140516_1.jpg/480px-Notre-Dame_de_Paris_and_%C3%8Ele_de_la_Cit%C3%A9_at_dusk_140516_1.jpg" },
      { url: "https://www.travelandleisure.com/thmb/SPUPzO88ZXq6P4Sm4mC5Xuinoik=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eiffel-tower-paris-france-EIFFEL0217-6ccc3553e98946f18c893018d5b42bde.jpg" },
      { url: "https://media.timeout.com/images/105237178/image.jpg" }
    ],
    likes: 85,
  },
  {
    id: 4,
    title: "Desert Safari",
    country: "United Arab Emirates",
    state: "Dubai",
    city: "Dubai",
    description:
      "Experience the vastness and beauty of the desert in Dubai. From thrilling dune bashing rides to a relaxing camel trek, this desert safari offers a chance to connect with nature in a way that's both adventurous and serene. After sunset, enjoy a delicious meal under the stars in a traditional Bedouin camp.",
    photos: [
      { url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/7a/20/74/desert-safari-with-quad.jpg?w=700&h=-1&s=1" },
      { url: "https://www.dubaidesertsafarigroup.com/blog/wp-content/uploads/2022/12/Morning-Desert-Safari-Dubai.jpg" },
      { url: "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/3d/9f/2c.jpg" }
    ],
    likes: 95,
  },
  {
    id: 5,
    title: "Tropical Beach Getaway",
    country: "Thailand",
    state: "Krabi",
    city: "Ao Nang",
    description:
      "Escape to the tropical paradise of Ao Nang in Thailand. White sandy beaches, crystal-clear waters, and lush landscapes await you. Whether you're swimming, snorkeling, or just relaxing by the shore, Ao Nang offers the ultimate beach experience for those looking to unwind and enjoy nature's beauty.",
    photos: [
      { url: "https://imageio.forbes.com/blogs-images/annabel/files/2014/10/1030_FL-tropical-beach-vacation-Le-Tahaa_2000x1125-1940x1091.jpg?format=jpg&height=900&width=1600&fit=bounds" },
      { url: "https://a.cdn-hotels.com/gdcs/production172/d459/3af9262b-3d8b-40c6-b61d-e37ae1aa90aa.jpg" },
      { url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Krabi_Ao_Nang_Beach.jpg" }
    ],
    likes: 150,
  },
];

export default function Gallery() {
  const [posts, setPosts] = useState<any[]>([]); 
  const [expandedPost, setExpandedPost] = useState<any | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const token = process.env.NEXT_PUBLIC_API_TOKEN;

  useEffect(() => {
    setPosts(samplePosts);

    if (token) {
      fetch("http://localhost:1337/api/your-endpoint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [token]);

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );

    fetch(`http://localhost:1337/api/posts/${postId}/like`, {
      method: "POST",
    }).catch((error) => console.error("Error updating like:", error));
  };

  const toggleExpandPost = (post: any) => {
    if (expandedPost?.id === post.id) {
      setExpandedPost(null);
    } else {
      setExpandedPost(post);
    }
  };

  const openPhotoModal = (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPost(post);
    setShowPhotoModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bg-white rounded-lg shadow-md p-4 flex flex-col transition-all ${
              expandedPost?.id === post.id ? "h-auto" : "h-64"
            }`}
            onClick={() => toggleExpandPost(post)}
          >
            {/* Thumbnail Image with View Photos button */}
            <div className="relative w-full h-48 mb-4">
              <div
                className="w-full h-full bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url(${post.photos[0]?.url || "/placeholder.jpg"})`,
                }}
              />
              <button
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-70 transition-all"
                onClick={(e) => openPhotoModal(post, e)}
              >
                View Photos ({post.photos.length})
              </button>
            </div>

            {/* Title and Location */}
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-sm text-gray-600">
              {post.city}, {post.state}, {post.country}
            </p>

            {/* Description when expanded */}
            {expandedPost?.id === post.id && (
              <p className="text-sm text-gray-700 mt-2">{post.description}</p>
            )}

            {/* Likes */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleLike(post.id);
              }}
              className="mt-auto flex items-center gap-2 text-red-500 cursor-pointer"
            >
              <FaHeart />
              <span>{post.likes} Likes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {showPhotoModal && expandedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              onClick={() => setShowPhotoModal(false)}
            >
              <FaTimes />
            </button>

            {/* Photo Carousel */}
            <Carousel className="w-full">
              <CarouselContent>
                {expandedPost.photos.map((photo: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <img
                        src={photo.url}
                        alt={`${expandedPost.title} - Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-white" />
              <CarouselNext className="text-white" />
            </Carousel>

            {/* Photo Info */}
            <div className="text-white mt-4">
              <h2 className="text-xl font-bold">{expandedPost.title}</h2>
              <p className="text-sm">
                {expandedPost.city}, {expandedPost.state}, {expandedPost.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}