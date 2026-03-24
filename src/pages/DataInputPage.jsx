import { useState } from 'react';
import { useChartStore } from '../store/chartStore';
import { FileExcel, Edit, Delete, Add, ArrowLeft, ArrowRight } from '@icon-park/react';
import * as XLSX from 'xlsx';
import './DataInputPage.css';

function DataInputPage() {
  const setPage = useChartStore((state) => state.setPage);
  const setChartData = useChartStore((state) => state.setChartData);
  
  const [inputMethod, setInputMethod] = useState('upload');
  const [data, setData] = useState([
    { name: '第一季度', value: 120 },
    { name: '第二季度', value: 180 },
    { name: '第三季度', value: 150 },
    { name: '第四季度', value: 220 }
  ]);

  const handleMethodChange = (method) => {
    setInputMethod(method);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        if (jsonData.length > 1) {
          const parsedData = jsonData.slice(1).map(row => ({
            name: row[0]?.toString() || '',
            value: parseFloat(row[1]) || 0
          })).filter(row => row.name);
          
          if (parsedData.length > 0) {
            setData(parsedData);
          }
        }
      } catch (error) {
        alert('文件解析失败，请确保格式正确');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls,.csv';
      input.onchange = (e) => handleFileUpload(e);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileUpload({ target: { files: dataTransfer.files } });
    }
  };

  const handleDataChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const addRow = () => {
    setData([...data, { name: '', value: 0 }]);
  };

  const deleteRow = (index) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const handleContinue = () => {
    const validData = data.filter(d => d.name && !isNaN(d.value));
    if (validData.length === 0) {
      alert('请至少输入一组有效数据');
      return;
    }
    
    setChartData({
      categories: validData.map(d => d.name),
      values: validData.map(d => d.value)
    });
    setPage('editor');
  };

  return (
    <div className="page data-input-page active">
      <div className="page-header">
        <button className="back-btn" onClick={() => setPage('home')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
        <h2 className="page-title">导入数据</h2>
        <div style={{ width: 60 }}></div>
      </div>

      <div className="input-methods">
        <div 
          className={`method-card ${inputMethod === 'upload' ? 'selected' : ''}`}
          onClick={() => handleMethodChange('upload')}
        >
          <div className="method-icon">
            <FileExcel size={42} />
          </div>
          <h3>上传文件</h3>
          <p>支持 Excel (.xlsx) 和 CSV 文件</p>
        </div>
        <div 
          className={`method-card ${inputMethod === 'manual' ? 'selected' : ''}`}
          onClick={() => handleMethodChange('manual')}
        >
          <div className="method-icon">
            <Edit size={42} />
          </div>
          <h3>手动输入</h3>
          <p>在表格中直接填写数据</p>
        </div>
      </div>

      {inputMethod === 'upload' ? (
        <div 
          className="upload-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input 
            type="file" 
            id="file-input"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <div className="upload-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h3>拖拽文件到此处，或点击上传</h3>
          <p>支持 .xlsx 和 .csv 格式</p>
          <div className="upload-formats">
            <span className="format-tag">.xlsx</span>
            <span className="format-tag">.csv</span>
          </div>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>数值</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="text" 
                      value={row.name}
                      onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                      placeholder="输入名称"
                    />
                  </td>
                  <td>
                    <input 
                      type="number"
                      value={row.value}
                      onChange={(e) => handleDataChange(index, 'value', parseFloat(e.target.value) || 0)}
                      placeholder="输入数值"
                    />
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteRow(index)}
                      disabled={data.length <= 1}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-row-btn" onClick={addRow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            添加一行
          </button>
        </div>
      )}

      <div className="continue-btn">
        <button className="btn btn-primary" onClick={handleContinue}>
          继续
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DataInputPage;