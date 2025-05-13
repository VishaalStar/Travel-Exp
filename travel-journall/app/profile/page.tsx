  "use client";

  import { useEffect, useState } from "react";
  import { auth, db } from "@/lib/firebase";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { FaHeart, FaTimes, FaComment, FaEdit } from "react-icons/fa";
  import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

  // Sample posts with comments
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
        { url: "https://images.pexels.com/photos/739987/pexels-photo-739987.jpeg?cs=srgb&dl=pexels-vivek-chugh-157138-739987.jpg&fm=jpg" }
      ],
      likes: 2000,
      comments: [
        { id: 1, text: "Beautiful city!", author: "John", timestamp: "2024-01-30 10:00" }
      ],
    },
    {
      id: 2,
      title: "Mountain Adventure",
      country: "Nepal",
      state: "Bagmati",
      city: "Kathmandu",
      description:
        "A thrilling trek to the Himalayan mountains. This journey includes climbing, camping under the stars, and visiting some of the most remote villages in Nepal. It will take you to new heights of adventure and wonder. The views are breathtaking, and the experience is unforgettable.",
      photos: [
        { url: "https://cdn.kimkim.com/files/a/images/4953d217876a02cf0f7d7299f2363dad36606ee1/big-a03997e39a2ceffc2ff018975907d3bc.jpg" },
        { url: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Mount_Everest_as_seen_from_Drukair2.jpg" },
        { url: "https://www.intrepidtravel.com/adventures/wp-content/uploads/2018/06/Intrepid-Travel-nepal_annapurna_himalaya_culture_buddhism_prayer-flags_mountains.jpg" }
      ],
      likes: 120,
      comments: [],
    },
    {
      id: 3,
      title: "City Exploration",
      country: "France",
      state: "Île-de-France",
      city: "Paris",
      description:
        "Exploring the history and beauty of Paris. From the Eiffel Tower to the Louvre, the city offers rich culture, amazing cuisine, and a chance to stroll along scenic streets. This experience is a must for any traveler.",
      photos: [
        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Notre-Dame_de_Paris_and_%C3%8Ele_de_la_Cit%C3%A9_at_dusk_140516_1.jpg/480px-Notre-Dame_de_Paris_and_%C3%8Ele_de_la_Cit%C3%A9_at_dusk_140516_1.jpg" },
        { url: "https://www.travelandleisure.com/thmb/SPUPzO88ZXq6P4Sm4mC5Xuinoik=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eiffel-tower-paris-france-EIFFEL0217-6ccc3553e98946f18c893018d5b42bde.jpg" },
        { url: "https://media.timeout.com/images/105237178/image.jpg" }
      ],
      likes: 85,
      comments: [],
    },
  ];

  const sampleBio = "🌍 Passionate traveler | 📸 Adventure photographer | ✈️ 25 countries and counting\n\nHey there! I'm a wanderlust-driven explorer with an insatiable appetite for discovering new places and cultures. From scaling peaks in Nepal to wandering through Parisian streets, every journey adds a new chapter to my story. When I'm not planning my next adventure, you'll find me editing travel photos or learning about local cuisines.\n\nFavorite quote: \"Not all who wander are lost\" - J.R.R. Tolkien";

  export default function ProfilePage() {
    const [user, loading] = useAuthState(auth);
    const [bio, setBio] = useState(sampleBio);
    const [isEditing, setIsEditing] = useState(false);
    const [posts, setPosts] = useState(samplePosts);
    const [expandedPost, setExpandedPost] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState({});

    const handleLike = (postId) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    };

    const toggleComments = (postId, e) => {
      e.stopPropagation();
      setShowComments(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    };

    const handleAddComment = (postId, e) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        author: user?.displayName || "Anonymous",
        timestamp: new Date().toLocaleString()
      };

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newCommentObj] }
            : post
        )
      );

      setNewComment("");
    };

    const toggleExpandPost = (post) => {
      if (expandedPost?.id === post.id) {
        setExpandedPost(null);
      } else {
        setExpandedPost(post);
      }
    };

    const openPhotoModal = (post, e) => {
      e.stopPropagation();
      setExpandedPost(post);
      setShowPhotoModal(true);
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!user) return <div className="p-8">Please log in to view your profile.</div>;

    return (
      <div className="max-w-7xl mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={user.photoURL || "https://via.placeholder.com/150"}
              alt="User profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{user.displayName || "Anonymous"}</h2>
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FaEdit /> Edit Bio
                  </Button>
                )}
              </div>
              <p className="text-gray-600">{user.email}</p>
              {isEditing ? (
                <div className="mt-4">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 border rounded-md h-32"
                    placeholder="Write something about yourself..."
                  />
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>
                      Save Bio
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 whitespace-pre-wrap">{bio}</div>
              )}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col transition-all"
              onClick={() => toggleExpandPost(post)}
            >
              {/* Thumbnail */}
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

              {/* Content */}
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-600">
                {post.city}, {post.state}, {post.country}
              </p>

              {expandedPost?.id === post.id && (
                <p className="text-sm text-gray-700 mt-2">{post.description}</p>
              )}

              {/* Actions */}
              <div className="mt-auto flex items-center justify-between">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  className="flex items-center gap-2 text-red-500 cursor-pointer"
                >
                  <FaHeart />
                  <span>{post.likes}</span>
                </div>
                
                <div
                  onClick={(e) => toggleComments(post.id, e)}
                  className="flex items-center gap-2 text-blue-500 cursor-pointer"
                >
                  <FaComment />
                  <span>{post.comments.length}</span>
                </div>
              </div>

              {/* Comments */}
              {showComments[post.id] && (
                <div className="mt-4 p-2 bg-gray-50 rounded-lg" onClick={e => e.stopPropagation()}>
                  <div className="max-h-40 overflow-y-auto mb-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="mb-2 p-2 bg-white rounded">
                        <p className="text-sm">{comment.text}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {comment.author} • {comment.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2">
                    <Input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      Post
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Photo Modal */}
        {showPhotoModal && expandedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <button
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                onClick={() => setShowPhotoModal(false)}
              >
                <FaTimes />
              </button>

              <Carousel className="w-full">
                <CarouselContent>
                  {expandedPost.photos.map((photo, index) => (
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

              <div className="text-white mt-4">
                <h2 className="text-xl font-bold">{expandedPost.title}</h2>
                <p className="text-sm">
                  {expandedPost.city}, {expandedPost.state}, {expandedPost.country}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } 