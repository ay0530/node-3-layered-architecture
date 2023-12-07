const express = require('express'); // express 라이브러리를 변수에 할당
const routes = require('./routes');
const app = express(); // express를 실행해서 app 객체 생성
const port = 5608; // 서버 포트
const cookieParser = require('cookie-parser');
const { CustomErrorHandler } = require('./error-handlers/custom.error.handlers');
const { ValidationErrorHandler } = require('./error-handlers/validation.error.handler');

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);
app.use(CustomErrorHandler);
app.use(ValidationErrorHandler);


// listen 메서드로 서버 실행
app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
}); 
