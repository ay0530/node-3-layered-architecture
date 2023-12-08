import express, { json } from 'express'; // express 라이브러리를 변수에 할당
import routes from './src/routes/index.js';
const app = express(); // express를 실행해서 app 객체 생성
const port = 5608; // 서버 포트
import cookieParser from 'cookie-parser';
import { CustomErrorHandler } from './src/error-handlers/custom.error.handlers.js';
import { ValidationErrorHandler } from './src/error-handlers/validation.error.handler.js';

app.use(json());
app.use(cookieParser());

app.use("/", routes);
app.use(CustomErrorHandler);
app.use(ValidationErrorHandler);


// listen 메서드로 서버 실행
app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
}); 
