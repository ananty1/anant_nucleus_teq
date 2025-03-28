import { useState } from 'react';

const AddExpenseModal = ({ isOpen, onClose, onSubmit, groupMembers }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    splitType: 'EQUAL', // EQUAL, EXACT, PERCENTAGE
    paidBy: null,
    splits: {}
  });

  const [splitMode, setSplitMode] = useState('EQUAL');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    let splits = {};

    if (splitMode === 'EQUAL') {
      const splitAmount = amount / groupMembers.length;
      groupMembers.forEach(member => {
        splits[member.id] = splitAmount;
      });
    } else {
      splits = formData.splits;
    }

    onSubmit({
      ...formData,
      amount,
      splits
    });
    resetForm();
  };

  const handleSplitChange = (memberId, value) => {
    setFormData(prev => ({
      ...prev,
      splits: {
        ...prev.splits,
        [memberId]: parseFloat(value) || 0
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      splitType: 'EQUAL',
      paidBy: null,
      splits: {}
    });
    setSplitMode('EQUAL');
  };

  const calculateRemaining = () => {
    if (splitMode !== 'EXACT') return 0;
    const total = parseFloat(formData.amount) || 0;
    const currentTotal = Object.values(formData.splits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    return total - currentTotal;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[480px] shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Expense</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <input
              type="text"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Paid By *
            </label>
            <select
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.paidBy || ''}
              onChange={(e) => setFormData({...formData, paidBy: parseInt(e.target.value)})}
            >
              <option value="">Select who paid</option>
              {groupMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Split Type
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="splitType"
                  value="EQUAL"
                  checked={splitMode === 'EQUAL'}
                  onChange={(e) => setSplitMode(e.target.value)}
                />
                <span className="ml-2">Equal</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="splitType"
                  value="EXACT"
                  checked={splitMode === 'EXACT'}
                  onChange={(e) => setSplitMode(e.target.value)}
                />
                <span className="ml-2">Exact Amount</span>
              </label>
            </div>
          </div>

          {splitMode === 'EXACT' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Split Amount
              </label>
              <div className="space-y-2">
                {groupMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <span className="w-1/3">{member.name}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={formData.splits[member.id] || ''}
                      onChange={(e) => handleSplitChange(member.id, e.target.value)}
                    />
                  </div>
                ))}
                <div className="text-right text-sm">
                  Remaining: {calculateRemaining().toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
              disabled={splitMode === 'EXACT' && Math.abs(calculateRemaining()) > 0.01}
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal; 