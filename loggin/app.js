function app() {
  return {
      data: [],
      loading: true,
      chart: null,

      fetchData() {
          fetch('http://localhost:3730/api/data')
              .then(response => response.json())
              .then(data => {
                  this.data = data.map(customer => ({ ...customer, churn: undefined }));
                  this.loading = false;
                  this.updateChart();
              })
              .catch(error => {
                  console.error('Error fetching data:', error);
                  this.loading = false;
              });
      },

      predictChurn(customer) {
          fetch('http://localhost:3730/api/predict', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(customer)
          })
          .then(response => response.json())
          .then(result => {
              customer.churn = result.churn;
              this.updateChart();  // Update chart after prediction
          })
          .catch(error => console.error('Error predicting churn:', error));
      },

      updateChart() {
          const churnCount = this.data.filter(customer => customer.churn === 1).length;
          const notChurnCount = this.data.length - churnCount;

          const ctx = document.getElementById('churnChart').getContext('2d');

          if (this.chart) {
              this.chart.destroy();
          }

          this.chart = new Chart(ctx, {
              type: 'pie',
              data: {
                  labels: ['Churn', 'Not Churn'],
                  datasets: [{
                      label: 'Churn Prediction',
                      data: [churnCount, notChurnCount],
                      backgroundColor: ['#ff6384', '#36a2eb'],
                      borderColor: '#fff',
                      borderWidth: 1
                  }]
              },
              options: {
                  responsive: true,
                  plugins: {
                      legend: {
                          position: 'top',
                      },
                      tooltip: {
                          callbacks: {
                              label: function(context) {
                                  let label = context.label || '';
                                  if (label) {
                                      label += ': ' + context.raw;
                                  }
                                  return label;
                              }
                          }
                      }
                  }
              }
          });
      }
  };
}

document.addEventListener('alpine:init', () => {
  Alpine.data('app', app);
});
