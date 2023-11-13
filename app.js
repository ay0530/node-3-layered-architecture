const express = require('express'); // express 라이브러리를 변수에 할당
const app = express(); // express를 실행해서 app 객체 생성
const port = 5608; // 서버 포트
app.use(express.json());

const membersRouter = require('./routes/members/index');
const productsRouter = require('./routes/products/index');

// use 메서드로 실행 순서 설정 (app.use가 실행된 후 다음 메서드들이 실행됨)
// app.use : 미들웨어

app.use("/members", membersRouter);
app.use("/products", productsRouter);

// listen 메서드로 서버 실행
app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
}); 
