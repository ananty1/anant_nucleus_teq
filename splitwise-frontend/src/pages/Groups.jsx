import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreateGroupModal from '../components/CreateGroupModal';

const Groups = () => {
  const { token, user } = useAuth();
  const { groupId } = useParams();
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    memberEmails: ['']
  });

  useEffect(() => {
    fetchGroups();
  }, [token]);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails(groupId);
    }
  }, [groupId]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/api/groups", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetails = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to fetch group details");
      const data = await res.json();
      setSelectedGroup(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const res = await fetch('http://localhost:8080/api/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...groupData,
          memberEmails: [...groupData.memberEmails, user.email] // Include current user
        })
      });

      if (!res.ok) throw new Error('Failed to create group');
      
      const createdGroup = await res.json();
      setGroups(prevGroups => [...prevGroups, createdGroup]);
      setShowModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchGroups}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <button
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          onClick={() => setShowModal(true)}
        >
          Create New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No groups yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{group.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                {group.members?.length || 0} members
              </p>
              {group.totalBalance !== 0 && (
                <p className={`text-sm font-medium ${
                  group.totalBalance > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Balance: {formatCurrency(group.totalBalance)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateGroup}
      />

      {selectedGroup && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{selectedGroup.name}</h2>
          <p className="text-gray-600 mb-4">{selectedGroup.description}</p>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Members:</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedGroup.members?.map((member) => (
                <div key={member.id} className="text-gray-600">
                  {member.name} ({member.email})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
