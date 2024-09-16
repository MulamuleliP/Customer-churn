function loginForm() {
    return {
        email: '',
        password: '',
        handleSubmit() {
            // Handle login logic here
            console.log(`Email: ${this.email}, Password: ${this.password}`);
        },
        forgotPassword() {
            // Handle forgot password logic here
            alert('Forgot Password clicked!');
        }
    };
};

function toggleSubMenu() {
    const submenu = document.getElementById('submenu');
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
    } else {
        submenu.classList.add('hidden');
    }
};

function customerData() {
  return {
    customers: [],
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:3730/api/customers');
        this.customers = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  async function deleteCustomer(customerId) {
    try {
      await axios.post('http://localhost:3730/api/delete', { customerId });
      console.log('Customer deleted');
      // Optionally refresh the data or update the UI
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  }
};

//dashboard:
function dashboard() {
  return {
      async init() {
          const response = await fetch('/api/data');
          const data = await response.json();
          this.renderChurnChart(data);
          this.renderAgeChart(data);
          this.renderBranchChart(data);
      },

      renderChurnChart(data) {
          const churned = data.filter(item => item.customer_churn === 1).length;
          const notChurned = data.length - churned;

          new Chart(document.getElementById('churnChart'), {
              type: 'bar',
              data: {
                  labels: ['Churned', 'Not Churned'],
                  datasets: [{
                      label: 'Customer Churn',
                      data: [churned, notChurned],
                      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      },

      renderAgeChart(data) {
          const ageDistribution = data.reduce((acc, item) => {
              const ageGroup = item.age < 30 ? 'Under 30' : item.age < 50 ? '30-49' : '50 and above';
              acc[ageGroup] = (acc[ageGroup] || 0) + 1;
              return acc;
          }, {});

          new Chart(document.getElementById('ageChart'), {
              type: 'pie',
              data: {
                  labels: Object.keys(ageDistribution),
                  datasets: [{
                      label: 'Age Distribution',
                      data: Object.values(ageDistribution),
                      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                      borderWidth: 1
                  }]
              }
          });
      },

      renderBranchChart(data) {
          const churnByBranch = data.reduce((acc, item) => {
              if (!acc[item.branch]) {
                  acc[item.branch] = { churned: 0, notChurned: 0 };
              }
              if (item.customer_churn === 1) {
                  acc[item.branch].churned += 1;
              } else {
                  acc[item.branch].notChurned += 1;
              }
              return acc;
          }, {});

          new Chart(document.getElementById('branchChart'), {
              type: 'doughnut',
              data: {
                  labels: Object.keys(churnByBranch),
                  datasets: [{
                      label: 'Churned Customers by Branch',
                      data: Object.values(churnByBranch).map(branch => branch.churned),
                      backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 205, 86, 0.2)'],
                      borderColor: ['rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'],
                      borderWidth: 1
                  }]
              }
          });
      }
  };
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Get the response as text
    })
    .then(text => {
      try {
        const data = JSON.parse(text); // Manually parse the text
        const container = document.getElementById('data-container');
        container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});





