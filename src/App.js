import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [diffData, setDiffData] = useState(null);

  // 관리자 인증 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState('');

  // 검색 요청
  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://yunjelee.pythonanywhere.com/search?q=${keyword}`);
      setResults(res.data);
    } catch (e) {
      console.error(e);
      alert('검색 실패! 백엔드가 실행 중인지 확인하세요.');
    }
  };

  // 엔터키 검색 지원
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 파일 업로드 (관리자)
  const handleUpload = async () => {
    if (!file) {
      setUploadMsg('엑셀 파일을 선택하세요.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadMsg('업로드 중...');
      await axios.post('https://yunjelee.pythonanywhere.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadMsg('업로드 성공! 변경 사항을 확인하려면 아래 [변경사항 확인] 버튼을 누르세요.');
      setDiffData(null);
    } catch (e) {
      console.error(e);
      setUploadMsg(`업로드 실패: ${e.response?.data?.error || e.message}`);
    }
  };

  // 변경 사항 비교 (Compare)
  const handleCompare = async () => {
    try {
      const res = await axios.get('https://yunjelee.pythonanywhere.com/compare');
      console.log('Compare 응답:', res.data); // 디버깅용
      
      // 응답 데이터 유효성 검사
      if (!res.data || !res.data.added || !res.data.removed || !res.data.changed) {
        alert('비교 데이터 형식이 올바르지 않습니다. 콘솔을 확인하세요.');
        console.error('잘못된 응답:', res.data);
        return;
      }
      
      setDiffData(res.data);
    } catch (e) {
      console.error('비교 에러:', e);
      console.error('에러 응답:', e.response?.data);
      alert('비교 데이터를 가져오는데 실패했습니다. 먼저 파일을 업로드 해주세요.');
    }
  };

  // 변경사항 확정 (업로드된 데이터를 원본으로 이동)
  const handleConfirm = async () => {
    if (!window.confirm('업로드된 데이터를 원본 DB에 반영하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    
    try {
      await axios.post('https://yunjelee.pythonanywhere.com/confirm');
      alert('✅ 변경사항이 원본 DB에 반영되었습니다!');
      setDiffData(null);
      setUploadMsg('');
    } catch (e) {
      console.error(e);
      alert('확정 실패: ' + (e.response?.data?.error || e.message));
    }
  };

  // 관리자 로그인 처리
  const handleAdminLogin = () => {
    if (adminInput === '1234') {
      setIsAdmin(true);
      setAdminInput('');
    } else {
      alert('비밀번호가 틀렸습니다!');
    }
  };

  // 관리자 영역 로그아웃
  const handleLogout = () => {
    setIsAdmin(false);
    setUploadMsg('');
    setDiffData(null);
    setFile(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      
      {/* === 검색 섹션 === */}
      <h1 style={{ textAlign: 'center' }}>🔬 과학실 물품 검색</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          value={keyword}
          placeholder="품목명, 위치, 비고 등으로 검색..."
          onChange={e => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, padding: '10px', fontSize: 16 }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}>검색</button>
      </div>

      {/* 검색 결과 리스트 */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', minHeight: '100px' }}>
        {results.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>검색 결과가 여기에 표시됩니다.</p>
        ) : (
          <ul style={{ paddingLeft: 0 }}>
            {results.map((item, idx) => (
              <li key={idx} style={{ 
                listStyle: 'none', 
                background: 'white', 
                border: '1px solid #ddd', 
                marginBottom: '10px', 
                padding: '15px',
                borderRadius: '5px'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{item.품목명}</div>
                <div style={{ color: '#666', marginTop: '5px' }}>
                  📍 위치: {item.위치 || '-'} | 📦 수량: {item.수량 || '-'} | 👤 관리자: {item.관리자 || '-'}
                </div>
                {item.비고 && (
                  <div style={{ color: '#999', marginTop: '3px', fontSize: '14px' }}>
                    📝 비고: {item.비고}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr style={{ margin: '50px 0', border: 'none', borderTop: '2px dashed #ccc' }} />

      {/* === 관리자 로그인/업로드 섹션 === */}
      {!isAdmin ? (
        <div style={{ marginTop: 30 }}>
          <h2>관리자 전용 영역</h2>
          <input
            type="password"
            value={adminInput}
            onChange={e => setAdminInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAdminLogin()}
            placeholder="관리자 비밀번호 입력"
            style={{ padding: '8px', fontSize: 16, marginRight: 8 }}
          />
          <button onClick={handleAdminLogin} style={{ padding: '8px 16px', fontSize: 16 }}>입장</button>
        </div>
      ) : (
        <div style={{ background: '#eef', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🛠 관리자 모드 (엑셀 업로드)</h2>
            <button onClick={handleLogout} style={{ fontSize: 14, color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>로그아웃</button>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={e => setFile(e.target.files[0])}
              style={{ fontSize: 16 }}
            />
            <button 
              onClick={handleUpload} 
              style={{ 
                fontSize: 16, 
                marginLeft: 10, 
                padding: '8px 20px', 
                cursor: 'pointer',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              📤 업로드
            </button>
          </div>
          
          {/* 업로드 메시지 */}
          {uploadMsg && (
            <div style={{ 
              marginTop: 15, 
              padding: '10px', 
              background: uploadMsg.includes('실패') ? '#ffebee' : '#e3f2fd',
              color: uploadMsg.includes('실패') ? '#c62828' : '#1565c0',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {uploadMsg}
            </div>
          )}
          
          {/* 비교 버튼 */}
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleCompare} 
              style={{ 
                padding: '10px 20px', 
                cursor: 'pointer', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              📊 원본 vs 업로드 변경사항 확인
            </button>
          </div>

          {/* 비교 결과 표시 */}
          {diffData && (
            <div style={{ marginTop: '20px', background: 'white', padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>📋 변경 내역</h3>
              
              <h4 style={{ color: 'green', borderBottom: '2px solid green', paddingBottom: '5px' }}>
                ➕ 추가된 항목 ({diffData.added?.length || 0})
              </h4>
              {diffData.added && diffData.added.length > 0 ? (
                <ul style={{ background: '#f1f8e9', padding: '10px 30px', borderRadius: '4px' }}>
                  {diffData.added.map((it, i) => (
                    <li key={i}>
                      <b>{it.품목명}</b> - 수량: {it.수량}, 보관장소: {it.보관장소}, 선반: {it.선반}, 서랍: {it.서랍}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#999' }}>없음</p>
              )}
  
              <h4 style={{ color: 'red', borderBottom: '2px solid red', paddingBottom: '5px', marginTop: '20px' }}>
                ➖ 삭제된 항목 ({diffData.removed?.length || 0})
              </h4>
              {diffData.removed && diffData.removed.length > 0 ? (
                <ul style={{ background: '#ffebee', padding: '10px 30px', borderRadius: '4px' }}>
                  {diffData.removed.map((it, i) => (
                    <li key={i}>
                      <b>{it.품목명}</b> - 수량: {it.수량}, 보관장소: {it.보관장소}, 선반: {it.선반}, 서랍: {it.서랍}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#999' }}>없음</p>
              )}
  
              <h4 style={{ color: 'orange', borderBottom: '2px solid orange', paddingBottom: '5px', marginTop: '20px' }}>
                🔄 변경된 항목 ({diffData.changed?.length || 0})
              </h4>
              {diffData.changed && diffData.changed.length > 0 ? (
                <ul style={{ background: '#fff3e0', padding: '10px 30px', borderRadius: '4px' }}>
                  {diffData.changed.map((it, i) => (
                    <li key={i}>
                      <b>{it.품목명}</b>
                      <div style={{ marginLeft: '20px', fontSize: '14px' }}>
                        • 수량: {it.원본?.수량} → {it.업로드?.수량}<br/>
                        • 보관장소: {it.원본?.보관장소} → {it.업로드?.보관장소}<br/>
                        • 선반: {it.원본?.선반} → {it.업로드?.선반}<br/>
                        • 서랍: {it.원본?.서랍} → {it.업로드?.서랍}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#999' }}>없음</p>
              )}

              {/* 확정 버튼 */}
              <div style={{ marginTop: '25px', textAlign: 'center', paddingTop: '20px', borderTop: '2px dashed #ccc' }}>
                <button
                  onClick={handleConfirm}
                  style={{
                    padding: '12px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    background: '#ff5722',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  ✅ 변경사항 확정 (원본 DB에 반영)
                </button>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  ⚠️ 확정 후에는 되돌릴 수 없습니다
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default App;
