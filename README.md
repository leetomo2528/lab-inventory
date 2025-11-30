```markdown
# 🔬 과학실 물품 검색 시스템

과학실의 실험 기자재를 효율적으로 관리하고 검색할 수 있는 웹 애플리케이션입니다.

## 🌐 데모

- **프론트엔드**: [https://leetomo2528.github.io/lab-inventory/](https://leetomo2528.github.io/lab-inventory/)
- **백엔드 API**: [https://yunjelee.pythonanywhere.com](https://yunjelee.pythonanywhere.com)

## ✨ 주요 기능

### 일반 사용자
- 🔍 **실시간 검색**: 품목명, 위치, 비고 등으로 물품 검색
- 📍 **위치 정보**: 보관장소, 선반, 서랍 정보 표시
- 📦 **수량 확인**: 실시간 재고 수량 조회

### 관리자
- 📤 **엑셀 업로드**: 물품 목록을 엑셀 파일로 일괄 업로드
- 📊 **변경사항 비교**: 업로드 전 원본과 비교하여 추가/삭제/변경 항목 확인
- ✅ **안전한 반영**: 변경사항 확인 후 원본 데이터베이스에 반영
- 🔐 **비밀번호 보호**: 관리자 기능은 비밀번호로 보호

## 🛠️ 기술 스택

### Frontend
- **React** - 사용자 인터페이스
- **Axios** - HTTP 통신
- **GitHub Pages** - 정적 호스팅

### Backend
- **Flask** - REST API 서버
- **SQLite** - 데이터베이스
- **Pandas** - 엑셀 파일 처리
- **RapidFuzz** - 퍼지 검색 (유사도 기반 검색)
- **PythonAnywhere** - 서버 호스팅

## 📋 데이터 구조

엑셀 파일은 다음 6개 컬럼을 포함해야 합니다:

| 품목명 | 비고 | 보관장소 | 선반 | 서랍 | 수량 |
|--------|------|----------|------|------|------|
| 비커 | 500ml | 1 | 3 | 15 | 10 |
| 플라스크 | 250ml | 1 | 4 | 3 | 5 |

## 🚀 로컬 개발 환경 설정

### Prerequisites
- Node.js 14+
- Python 3.9+
- npm or yarn

### Frontend 설치 및 실행

```
# 저장소 클론
git clone https://github.com/leetomo2528/lab-inventory.git
cd lab-inventory

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

브라우저에서 `http://localhost:3000` 접속

### Backend 로컬 실행 (선택사항)

```
# 백엔드 폴더로 이동
cd backend

# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate  # Windows

# 의존성 설치
pip install flask flask-cors pandas openpyxl rapidfuzz

# 서버 실행
python3 backend.py
```

백엔드가 `http://localhost:5001`에서 실행됩니다.

## 📦 배포

### GitHub Pages 배포

```
# 프로젝트 빌드
npm run build

# GitHub Pages에 배포
npm run deploy
```

### PythonAnywhere 백엔드 배포

1. [PythonAnywhere](https://www.pythonanywhere.com) 계정 생성
2. Files 탭에서 `backend.py` 업로드
3. Console에서 패키지 설치:
   ```
   pip3 install --user flask flask-cors pandas openpyxl rapidfuzz
   ```
4. Web 탭에서 WSGI 설정
5. Reload 버튼 클릭

## 🔐 관리자 기능 사용법

1. 메인 페이지 하단 "관리자 전용 영역"으로 이동
2. 비밀번호 입력 (기본값: `1234`)
3. 엑셀 파일 선택 후 "업로드" 클릭
4. "변경사항 확인" 버튼으로 비교 확인
5. "변경사항 확정" 버튼으로 원본 DB에 반영

## 📊 API 엔드포인트

### GET `/search`
물품 검색

**파라미터:**
- `q`: 검색 키워드

**응답 예시:**
```
[
  {
    "품목명": "비커",
    "비고": "500ml",
    "보관장소": "1",
    "선반": "3",
    "서랍": "15",
    "수량": "10",
    "위치": "보관장소 1 / 선반 3 / 서랍 15"
  }
]
```

### POST `/upload`
엑셀 파일 업로드

**요청:**
- FormData with `file` field

**응답:**
```
{
  "message": "15개 항목이 업로드되었습니다",
  "count": 15,
  "skipped": 0
}
```

### GET `/compare`
원본과 업로드 데이터 비교

**응답:**
```
{
  "added": [...],
  "removed": [...],
  "changed": [...]
}
```

### POST `/confirm`
변경사항을 원본 DB에 반영

**응답:**
```
{
  "message": "15개 항목이 반영되었습니다"
}
```

## 🔧 설정

### 관리자 비밀번호 변경

`src/App.js`에서 다음 부분 수정:

```
const handleAdminLogin = () => {
  if (adminInput === '1234') {  // 여기서 비밀번호 변경
    setIsAdmin(true);
    setAdminInput('');
  } else {
    alert('비밀번호가 틀렸습니다!');
  }
};
```

### API URL 변경

`src/App.js`의 모든 API 호출에서 URL 수정:

```
axios.get('https://YOUR-DOMAIN.pythonanywhere.com/search?q=' + keyword)
```

## 🐛 문제 해결

### 검색이 작동하지 않음
- 백엔드 API가 실행 중인지 확인
- CORS 설정 확인
- 브라우저 개발자 도구(F12)에서 네트워크 오류 확인

### 업로드 실패
- 엑셀 파일이 6개 컬럼(품목명, 비고, 보관장소, 선반, 서랍, 수량)을 포함하는지 확인
- 파일 확장자가 `.xlsx` 또는 `.xls`인지 확인

### GitHub Pages에서 빈 페이지
- `package.json`의 `homepage` 설정 확인
- `npm run build && npm run deploy` 재실행
- 5-10분 후 다시 시도

## 📝 주의사항

- PythonAnywhere 무료 계정은 3개월마다 로그인 필요
- SQLite 데이터베이스는 정기적으로 백업 권장
- 관리자 비밀번호는 실제 서비스에서 반드시 변경 필요
- 프로덕션 환경에서는 CORS 설정을 특정 도메인으로 제한

## 🤝 기여

이슈 제보 및 Pull Request는 언제나 환영합니다!


## 👤 개발자

**이윤제**
- GitHub: [@leetomo2528](https://github.com/leetomo2528)
- Email: 1100jaden@gmail.com
- 프로젝트: 과학실 물품 검색 시스템

## 📅 버전 히스토리

### v1.0.0 (2025-11-30)
- 초기 릴리스
- 기본 검색 기능
- 엑셀 업로드 기능
- 변경사항 비교 및 반영
- GitHub Pages + PythonAnywhere 배포

---

⭐ 이 프로젝트가 유용하다면 Star를 눌러주세요!
