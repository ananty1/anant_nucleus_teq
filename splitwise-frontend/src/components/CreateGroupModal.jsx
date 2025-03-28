import { useState } from 'react';

const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberEmails: ['']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEmails = formData.memberEmails.filter(email => email.trim() !== '');
    onSubmit({ ...formData, memberEmails: validEmails });
    setFormData({ name: '', description: '', memberEmails: [''] });
  };

  const addMemberField = () => {
    setFormData({
      ...formData,
      memberEmails: [...formData.memberEmails, '']
    });
  };

  const removeMemberField = (index) => {
    setFormData({
      ...formData,
      memberEmails: formData.memberEmails.filter((_, i) => i !== index)
    });
  };

  const updateMemberEmail = (index, value) => {
    const updatedEmails = [...formData.memberEmails];
    updatedEmails[index] = value;
    setFormData({
      ...formData,
      memberEmails: updatedEmails
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Group</h3>
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
              Group Name *
            </label>
            <input
              type="text"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Members *
            </label>
            {formData.memberEmails.map((email, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="email"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => updateMemberEmail(index, e.target.value)}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMemberField(index)}
                    className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMemberField}
              className="text-emerald-600 text-sm mt-2 hover:text-emerald-700"
            >
              + Add Member
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal; 