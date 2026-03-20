// Export to CSV/Excel
export const exportToExcel = (transactions) => {
  const headers = ['Title', 'Amount', 'Type', 'Category', 'Date', 'Note'];
  const rows = transactions.map((t) => [
    t.title,
    t.amount,
    t.type,
    t.category,
    new Date(t.date).toLocaleDateString(),
    t.note || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export to PDF (using print)
export const exportToPDF = (transactions) => {
  const totalIncome = transactions.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const rows = transactions.map((t) => `
    <tr>
      <td>${t.title}</td>
      <td style="color:${t.type === 'Income' ? '#10b981' : '#ef4444'}">
        ${t.type === 'Income' ? '+' : '-'}$${t.amount.toFixed(2)}
      </td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${new Date(t.date).toLocaleDateString()}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FinTrack Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
        h1 { color: #6366f1; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .summary-card { padding: 12px 20px; border-radius: 8px; flex: 1; }
        .income { background: #d1fae5; color: #065f46; }
        .expense { background: #fee2e2; color: #991b1b; }
        .balance { background: #e0e7ff; color: #3730a3; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #6366f1; color: white; padding: 10px; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        .label { font-size: 12px; margin-bottom: 4px; }
        .value { font-size: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>💰 FinTrack — Financial Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <div class="summary">
        <div class="summary-card income">
          <div class="label">Total Income</div>
          <div class="value">$${totalIncome.toFixed(2)}</div>
        </div>
        <div class="summary-card expense">
          <div class="label">Total Expense</div>
          <div class="value">$${totalExpense.toFixed(2)}</div>
        </div>
        <div class="summary-card balance">
          <div class="label">Net Balance</div>
          <div class="value">$${balance.toFixed(2)}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Amount</th><th>Type</th><th>Category</th><th>Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.print();
};