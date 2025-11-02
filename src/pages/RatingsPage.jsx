import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function RatingsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("from") || "product"; // "orders" or "product"
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // recent, highest, lowest
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasAlreadyRated, setHasAlreadyRated] = useState(false);
  const [step, setStep] = useState(1); // 1: rating, 2: media, 3: review, 4: view
  const [uploadedMedia, setUploadedMedia] = useState([]); // Array of {type: 'image'|'video', url}

  useEffect(() => {
    // Get logged in user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // TODO: Fetch product, ratings, and check purchase history from API
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/products/${productId}/ratings`);
    //     const data = await response.json();
    //     setRatings(data.ratings);
    //     setProduct(data.product);
    //
    //     // Check if user has purchased this product
    //     if (storedUser) {
    //       const purchaseResponse = await fetch(`/api/users/purchase-history/${productId}`);
    //       const purchaseData = await purchaseResponse.json();
    //       setHasPurchased(purchaseData.hasPurchased);
    //       setHasAlreadyRated(purchaseData.hasAlreadyRated);
    //     }
    //   } catch (error) {
    //     toast.error("Failed to load ratings");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data for demo
    setTimeout(() => {
      setRatings([
        // {
        //   id: 1,
        //   userName: "Priya Singh",
        //   rating: 5,
        //   review: "Excellent quality! The product is exactly as described. Highly recommend!",
        //   date: "2025-11-01",
        //   helpful: 45,
        //   verified: true
        // },
        // {
        //   id: 2,
        //   userName: "Raj Kumar",
        //   rating: 4,
        //   review: "Good product, delivery could have been faster but overall satisfied.",
        //   date: "2025-10-28",
        //   helpful: 23,
        //   verified: true
        // },
        // {
        //   id: 3,
        //   userName: "Anjali Patel",
        //   rating: 5,
        //   review: "Love it! Perfect for my home. Amazing value for money.",
        //   date: "2025-10-25",
        //   helpful: 67,
        //   verified: true
        // },
        // {
        //   id: 4,
        //   userName: "Vikram Gupta",
        //   rating: 3,
        //   review: "Average product. Expected better quality for this price.",
        //   date: "2025-10-20",
        //   helpful: 12,
        //   verified: true
        // }
      ]);
      setProduct({
        id: productId,
        title: "Royal Thread Hand Crafted Kilim",
        price: 2899,
        image: "/placeholder.jpg",
        avgRating: 4.25,
        totalRatings: 128
      });

      // Mock: Set as purchased for demo
      setHasPurchased(true);
      setHasAlreadyRated(false);

      setLoading(false);
    }, 500);
  }, [productId]);

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Submit rating to API
      // await fetch(`/api/products/${productId}/ratings`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rating: userRating, review: userReview })
      // });

      const newRating = {
        id: ratings.length + 1,
        userName: "You",
        rating: userRating,
        review: userReview,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: true
      };

      setRatings([newRating, ...ratings]);
      setUserRating(0);
      setUserReview("");
      toast.success("Rating submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.date) - new Date(a.date);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Loading ratings...</p>
        </div>
      </div>
    );
  }

  // Render different views based on source
  if (source === "orders") {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-4 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Rate This Product</h1>
          </div>

          {/* Product Info */}
          {product && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border border-gray-200">
              <div className="flex gap-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">{product.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rating Form Only */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Experience</h3>

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Please log in</span> to share your experience with this product.
                </p>
                <button
                  onClick={() => navigate('/account')}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login Now
                </button>
              </div>
            )}

            {user && !hasPurchased && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">You must purchase this product to leave a review</p>
                    <p className="text-sm text-amber-800 mt-1">Buy this product first, then come back to share your experience.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
                >
                  Go Back to Order
                </button>
              </div>
            )}

            {user && hasPurchased && hasAlreadyRated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Thank you for your review!</p>
                    <p className="text-sm text-green-800 mt-1">You've already shared your experience with this product.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Multi-Step Rating Form */}
            {user && hasPurchased && !hasAlreadyRated && (
              <>
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          step >= s
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {s === 1 && "⭐"}
                        {s === 2 && "📸"}
                        {s === 3 && "✍️"}
                      </div>
                      <p className="text-xs sm:text-sm font-medium mt-2 text-gray-700 text-center">
                        {s === 1 && "Rating"}
                        {s === 2 && "Media"}
                        {s === 3 && "Review"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Step 1: Rating */}
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">How would you rate this product?</label>
                    <div className="flex gap-3 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className="transition-transform hover:scale-125"
                        >
                          <svg
                            className={`w-12 h-12 ${
                              star <= userRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold text-xl">{userRating}</span> out of 5 stars
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => setStep(2)}
                      disabled={userRating === 0}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Next: Add Photos/Videos
                    </button>
                  </div>
                )}

                {/* Step 2: Media Upload */}
                {step === 2 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">Add photos or videos (Optional)</label>
                    <div className="mb-6">
                      <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm font-medium text-gray-700">Click to upload image or video</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, MP4 up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => {
                              const type = file.type.startsWith('video') ? 'video' : 'image';
                              const url = URL.createObjectURL(file);
                              setUploadedMedia([...uploadedMedia, { type, url, name: file.name }]);
                            });
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Uploaded Media Preview */}
                    {uploadedMedia.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-3">Uploaded ({uploadedMedia.length})</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                          {uploadedMedia.map((media, idx) => (
                            <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                              {media.type === 'image' ? (
                                <img src={media.url} alt="preview" className="w-full h-full object-cover" />
                              ) : (
                                <video src={media.url} className="w-full h-full object-cover" controls />
                              )}
                              <button
                                onClick={() => setUploadedMedia(uploadedMedia.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                              >
                                ✕
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {media.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Next: Write Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Write your review (Optional)</label>
                    <textarea
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      placeholder="Share your honest opinion about this product with other customers..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2 mb-6">
                      <p className="text-xs text-gray-500">{userReview.length}/500 characters</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        disabled={userRating === 0 || submitting}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // From ProductDetailPage - Show reviews list only
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-4 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Product Ratings & Reviews</h1>
        </div>

        {/* Product Info */}
        {product && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border border-gray-200">
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{product.title}</h2>
                <p className="text-sm text-gray-600 mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {product.avgRating.toFixed(1)} ({product.totalRatings} ratings)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rating Summary</h3>

              {/* Rating Distribution */}
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratings.filter(r => r.rating === stars).length;
                  const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 min-w-fit">{stars} ★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-fit">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Submit Rating Button */}
              <button
                onClick={() => document.getElementById('rating-form').scrollIntoView({ behavior: 'smooth' })}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Right: Reviews List Only */}
          <div className="lg:col-span-2 space-y-6">

            {/* Sort Options */}
            {/* <div className="flex gap-2"> */}
              {/* <label className="text-sm font-semibold text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select> */}
            {/* </div> */}

            {/* Reviews List */}
            <div className="space-y-4">
              {sortedRatings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
                  <p className="text-gray-600">No ratings yet. Be the first to review!</p>
                </div>
              ) : (
                sortedRatings.map((rating) => (
                  <div key={rating.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{rating.userName}</h4>
                          {rating.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{rating.date}</p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-sm mb-4">{rating.review}</p>

                    {/* Helpful */}
                    <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H9m0 0H5.268a2 2 0 01-1.897-2.63l3.285-7.113A2 2 0 018.268 9h4m0 0v6m0-6v6" />
                      </svg>
                      Helpful ({rating.helpful})
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
