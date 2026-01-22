import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportGenerator = ({ expenses, totalBalance }) => {
  
  // Amount ko saaf-saaf dikhane ke liye function
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(num || 0));
  };

  const generatePDF = () => {
    console.log("PDF button clicked. Processing...");

    try {
      // 1. Initialize PDF
      const doc = new jsPDF();

      // 2. Header
      doc.setFontSize(22);
      doc.setTextColor(41, 128, 185); // Blue color
      doc.text('Monthly Budget Report', 14, 20);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 25, 196, 25);

      // 3. Summary Info
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
      
      // Balance Display (Colors based on Positive/Negative)
      doc.setFont("helvetica", "bold");
      doc.text(`Final Balance:`, 14, 42);
      
      const isPositive = totalBalance >= 0;
      doc.setTextColor(isPositive ? 46 : 231, isPositive ? 204 : 76, isPositive ? 113 : 60);
      doc.text(`INR ${formatNumber(totalBalance)}`, 50, 42);

      // 4. Data for Table
      const tableColumn = ["Date", "Description", "Category", "Amount (INR)"];
      const tableRows = (expenses || []).map(exp => [
        exp.date || '-',
        exp.description || '-',
        exp.category || '-',
        `${exp.amount >= 0 ? '+' : '-'} ${formatNumber(exp.amount)}`
      ]);

      // 5. Generate Table using direct function call (Guaranteed to work)
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 11 },
        columnStyles: { 
          3: { fontStyle: 'bold', halign: 'right' } 
        },
        // Row colors based on Income/Expense
        didParseCell: (data) => {
          if (data.column.index === 3 && data.cell.section === 'body') {
            const txt = data.cell.text[0] || '';
            if (txt.includes('+')) data.cell.styles.textColor = [39, 174, 96]; // Green
            if (txt.includes('-')) data.cell.styles.textColor = [192, 57, 43]; // Red
          }
        }
      });

      // 6. Final Save
      const fileName = `Budget_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      console.log("PDF successfully downloaded!");

    } catch (error) {
      console.error("PDF Critical Error:", error);
      alert("Error generating PDF. Please check the console (F12).");
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <button 
        onClick={generatePDF} 
        style={styles.button}
        onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
      >
        📥 Download PDF Report
      </button>
    </div>
  );
};

// Button styling
const styles = {
  button: {
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: '0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};

export default ReportGenerator;