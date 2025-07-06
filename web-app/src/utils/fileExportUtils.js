import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

// Function to generate and download an Excel file
export const exportToExcel = (data, fileName, sheetName = 'Sheet1') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
        // Add header row
        worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));

        // Add data rows
        data.forEach(item => worksheet.addRow(item));
    } else {
        worksheet.addRow(['No data available']);
    }

    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    }).catch(err => console.error('Error writing Excel file:', err));
};

// Function to generate and download a CSV file
export const exportToCSV = (data, fileName) => {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
};
