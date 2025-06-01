const SugarReading = require('../models/sugarModel');
const yup = require('yup');

const sugarSchema = yup.object({
  sugarLevel: yup.number().positive('Уровень сахара должен быть положительным').required('Уровень сахара обязателен'),
  readingDate: yup.date().required('Дата измерения обязательна'),
  description: yup.string().optional()
});

const sugarController = {
  create: async (req, res) => {
    try {
      await sugarSchema.validate(req.body, { abortEarly: false });
      const { sugarLevel, readingDate, description } = req.body;
      const userId = req.user.id;

      // Проверка ограничения по времени (5 минут = 300 секунд)
      const lastReadingTime = await SugarReading.getLastReadingTime(userId);
      if (lastReadingTime) {
        const now = new Date();
        const timeDiff = (now - new Date(lastReadingTime)) / 1000; // Разница в секундах
        if (timeDiff < 300) {
          const remainingTime = Math.ceil((300 - timeDiff) / 60); // Оставшееся время в минутах
          return res.status(429).json({ 
            message: `Слишком частые запросы. Пожалуйста, подождите ${remainingTime} минут(ы) перед добавлением новой записи.` 
          });
        }
      }

      const readingId = await SugarReading.create(userId, sugarLevel, readingDate, description);
      await SugarReading.updateLastReadingTime(userId);
      res.status(201).json({ message: 'Запись создана', readingId });
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await sugarSchema.validate(req.body, { abortEarly: false });
      const { id } = req.params;
      const { sugarLevel, readingDate, description } = req.body;
      const userId = req.user.id;

      const affectedRows = await SugarReading.update(id, userId, sugarLevel, readingDate, description);
      if (affectedRows === 0) return res.status(404).json({ message: 'Запись не найдена или доступ запрещен' });
      res.status(200).json({ message: 'Запись обновлена' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const affectedRows = await SugarReading.delete(id, userId);
      if (affectedRows === 0) return res.status(404).json({ message: 'Запись не найдена или доступ запрещен' });
      res.status(200).json({ message: 'Запись удалена' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getUserReadings: async (req, res) => {
    try {
      const userId = req.user.id;
      const readings = await SugarReading.findByUserId(userId);
      res.status(200).json(readings);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = sugarController;