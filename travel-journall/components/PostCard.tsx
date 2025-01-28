"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface StrapiPost {
  id: number;
  Title: string;
  Country: string;
  State: string;
  City: string;
  Description: string;
  Photos: string[];
}

interface PostCardProps {
  post: StrapiPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const strapiBaseUrl = "http://localhost:1337"; // Replace with your Strapi backend URL
  
  // Map Photos array to correct full URLs
  const photos = post.Photos.map((photo) => `${strapiBaseUrl}${photo}`);

  return (
    <div className="border rounded-lg shadow p-4">
      <h2 className="text-lg font-bold">{post.Title}</h2>
      <p className="text-sm text-gray-500">
        {post.City}, {post.State}, {post.Country}
      </p>
      <p className="mt-2 text-gray-700">{post.Description}</p>
      {photos.length > 0 && (
        <img
          src={photos[0]} // Assuming the first photo is the main one to display
          alt={post.Title}
          className="mt-4 rounded-lg w-full h-48 object-cover"
        />
      )}
    </div>
  );
};

const PostCardContainer: React.FC = () => {
  const [posts, setPosts] = useState<StrapiPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:1337/api/posts"); // Replace with your Strapi API URL
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const json = await response.json();
        // Map the data to match StrapiPost structure if needed
        const mappedPosts = json.data.map((post: any) => ({
          id: post.id,
          Title: post.attributes.Title,
          Country: post.attributes.Country,
          State: post.attributes.State,
          City: post.attributes.City,
          Description: post.attributes.Description,
          Photos: post.attributes.Photos || [],
        }));
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-4 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <AlertCircle className="inline-block mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostCardContainer;
