const createExpense = async (expenseData) => {
  try {
    const token = localStorage.getItem('token'); // or however you store your token
    console.log('Token being sent:', token); // Debug log
    
    const response = await axios.post('/api/expenses', expenseData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}; 