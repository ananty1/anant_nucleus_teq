import { useState, useEffect } from "react";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/friends");
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data = await res.json();
      setFriends(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/friends/pending");
      if (!res.ok) throw new Error("Failed to fetch pending requests");
      const data = await res.json();
      setPendingRequests(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail }),
      });
      
      if (!res.ok) throw new Error("Failed to send friend request");
      
      setSearchEmail("");
      fetchPendingRequests();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRequestResponse = async (requestId, accept) => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/request/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });

      if (!res.ok) throw new Error("Failed to respond to friend request");

      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Friends</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Friend</h3>
        <form onSubmit={handleAddFriend} className="flex gap-4">
          <input
            type="email"
            placeholder="Enter friend's email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="input-primary flex-1"
            required
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Send Request
          </button>
        </form>
      </div>

      {pendingRequests.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{request.from.name}</p>
                  <p className="text-sm text-gray-500">{request.from.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequestResponse(request.id, true)}
                    className="btn-primary"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestResponse(request.id, false)}
                    className="btn-secondary"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Your Friends</h3>
        {friends.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No friends yet. Add friends to start splitting expenses!
          </p>
        ) : (
          <div className="space-y-4">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
                <div className="text-right">
                  {friend.balance !== 0 && (
                    <p className={`font-medium ${friend.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {friend.balance > 0 ? 'owes you' : 'you owe'} ₹{Math.abs(friend.balance)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends; 