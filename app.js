const express = require('express'); // express 라이브러리를 변수에 할당
const app = express(); // express를 실행해서 app 객체 생성
const port = 5608; // 서버 포트
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const routes = require('./routes');

app.use("/", routes);

// listen 메서드로 서버 실행
app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
}); 
