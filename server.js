const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const authRoutes = require('./src/routes/authRoutes');
const sugarRoutes = require('./src/routes/sugarRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

dotenv.config();

const app = express();

// Настройка CORS с явным разрешением предзапросов
app.use(cors({
  origin: '*', // Разрешаем все источники (для теста)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Добавляем OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Добавляем Accept
  preflightContinue: false, // Предзапросы обрабатываются автоматически
  optionsSuccessStatus: 204 // Статус для успешных предзапросов
}));

// Обработка предзапросов OPTIONS
app.options('*', cors());

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/sugar', sugarRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
