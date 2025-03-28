import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AddExpenseModal from '../components/AddExpenseModal';

const GroupDetails = () => {
  const { groupId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupExpenses();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch group details');
      const data = await res.json();
      setGroup(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchGroupExpenses = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/expenses/group/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch group expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      // Find the user email from the paidBy id
      const paidByUser = group.members.find(member => member.id === expenseData.paidBy);
      if (!paidByUser) {
        throw new Error('Paying user not found');
      }

      // Convert splits from user IDs to emails
      let convertedSplits = {};
      if (expenseData.splitType === 'EXACT') {
        for (const [userId, amount] of Object.entries(expenseData.splits)) {
          const user = group.members.find(member => member.id === parseInt(userId));
          if (user) {
            convertedSplits[user.email] = amount;
          }
        }
      }

      const requestBody = {
        description: expenseData.description,
        amount: expenseData.amount,
        groupId: parseInt(groupId),
        paidByEmail: paidByUser.email,  // Changed from paidBy to paidByEmail
        splitType: expenseData.splitType,
        splits: expenseData.splitType === 'EXACT' ? convertedSplits : {}
      };

      console.log('Expense Request:', requestBody);

      const res = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add expense');
      }
      
      const newExpense = await res.json();
      setExpenses(prev => [...prev, newExpense]);
      setShowAddExpenseModal(false);
    } catch (error) {
      setError(error.message);
      console.error('Error adding expense:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Group Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{group?.name}</h1>
            <p className="text-gray-600 mb-4">{group?.description}</p>
            <p className="text-sm text-gray-500">
              Created by {group?.createdBy?.name} • {formatDate(group?.createdAt)}
            </p>
          </div>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Add Expense
          </button>
        </div>

        {/* Members List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Members</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {group?.members?.map(member => (
              <div key={member.id} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {expenses.map(expense => (
              <div key={expense.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <p className="text-sm text-gray-500">
                      Paid by {expense.paidBy.name} • {formatDate(expense.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-600">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {expense.splitType} split
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddExpenseModal && (
        <AddExpenseModal
          isOpen={showAddExpenseModal}
          onClose={() => setShowAddExpenseModal(false)}
          onSubmit={handleAddExpense}
          groupMembers={group?.members || []}
        />
      )}
    </div>
  );
};

export default GroupDetails;
