import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * ExcelHelper utility class for generating Excel files
 */
class ExcelHelper {
    /**
     * Generate an Excel file from data
     * @param {Object} options - Configuration options
     * @param {string} options.fileName - Name of the Excel file (without extension)
     * @param {string} options.sheetName - Name of the worksheet
     * @param {Array} options.headers - Array of header objects
     * @param {Array} options.data - Array of data objects
     * @param {Object} [options.styles] - Optional styles configuration
     * @returns {Promise<Blob>} - Promise that resolves with the Excel file Blob
     */
    static async generateExcel({
        fileName,
        sheetName,
        headers,
        data,
        styles = {}
    }) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        // Add headers
        const headerRow = worksheet.addRow(headers.map(header => header.name));
        
        // Apply header styles
        if (styles.header) {
            headerRow.eachCell((cell, index) => {
                Object.assign(cell, styles.header);
            });
        }

        // Add data rows
        data.forEach(row => {
            const dataRow = worksheet.addRow(headers.map(header => {
                const value = row[header.key];
                return this.formatValue(value, header.format);
            }));

            // Apply row styles
            if (styles.row) {
                dataRow.eachCell((cell, index) => {
                    Object.assign(cell, styles.row);
                });
            }
        });

        // Auto-size columns
        worksheet.columns.forEach(column => {
            column.width = 20; // Default width
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        return blob;
    }

    /**
     * Format cell value based on format type
     * @param {*} value - Value to format
     * @param {string} [format] - Format type (number, date, etc.)
     * @returns {*} - Formatted value
     */
    static formatValue(value, format, formatOptions = {}) {
        if (value === null || value === undefined) return '';
        
        switch (format) {
            case 'number':
                return Number(value);
            case 'currency':
                return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            case 'date':
                return new Date(value).toLocaleDateString();
            case 'datetime':
                // Get date object
                const date = new Date(value);
                
                // Determine if we should use UTC or local time
                const useUtc = formatOptions.useUtc !== false;
                
                // Get components based on UTC/local preference
                const day = String(useUtc ? date.getUTCDate() : date.getDate()).padStart(2, '0');
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const month = monthNames[useUtc ? date.getUTCMonth() : date.getMonth()];
                const year = useUtc ? date.getUTCFullYear() : date.getFullYear();
                const hours = String(useUtc ? date.getUTCHours() : date.getHours()).padStart(2, '0');
                const minutes = String(useUtc ? date.getUTCMinutes() : date.getMinutes()).padStart(2, '0');
                const seconds = String(useUtc ? date.getUTCSeconds() : date.getSeconds()).padStart(2, '0');
                const period = hours >= 12 ? 'PM' : 'AM';
                const hours12 = hours % 12 || 12;
                
                return `${day}-${month}-${year} ${hours12}:${minutes}:${seconds} ${period}`;
            default:
                return value.toString();
        }
    }

    /**
     * Download the generated Excel file
     * @param {Blob} blob - Excel file Blob
     * @param {string} fileName - Name of the file (without extension)
     */
    static downloadExcel(blob, fileName) {
        saveAs(blob, `${fileName}.xlsx`);
    }
}

export default ExcelHelper;

// Example usage:
// const headers = [
//     { name: 'ID', key: 'id' },
//     { name: 'Name', key: 'name' },
//     { name: 'Date', key: 'date', format: 'date' },
//     { name: 'Amount', key: 'amount', format: 'currency' }
// ];
// 
// const data = [
//     { id: 1, name: 'John Doe', date: '2025-01-01', amount: 1000 },
//     { id: 2, name: 'Jane Smith', date: '2025-01-02', amount: 2000 }
// ];
// 
// const styles = {
//     header: {
//         font: { bold: true },
//         fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } }
//     },
//     row: {
//         font: { size: 11 }
//     }
// };
// 
// ExcelHelper.generateExcel({
//     fileName: 'example',
//     sheetName: 'Data',
//     headers,
//     data,
//     styles
// }).then(blob => {
//     ExcelHelper.downloadExcel(blob, 'example');
// });