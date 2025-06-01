const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const SugarReading = require('../models/sugarModel');
const yup = require('yup');

const identifierSchema = yup.object({
  identifier: yup.string().required('Логин или ID пользователя обязательны')
});

const changePasswordSchema = yup.object({
  identifier: yup.string().required('Логин или ID пользователя обязательны'),
  newPassword: yup.string().min(6, 'Новый пароль должен быть не короче 6 символов').required('Новый пароль обязателен')
});

const adminController = {
  getAllReadings: async (req, res) => {
    try {
      const readings = await SugarReading.findAll();
      res.status(200).json(readings);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getUserReadings: async (req, res) => {
    try {
      await identifierSchema.validate(req.body, { abortEarly: false });
      const { identifier } = req.body;

      const user = await User.findByLoginOrId(identifier);
      if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

      const readings = await SugarReading.findByUserId(user.id);
      res.status(200).json({ user: { id: user.id, login: user.login, email: user.email }, readings });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  },
  changeUserPassword: async (req, res) => {
    try {
      await changePasswordSchema.validate(req.body, { abortEarly: false });
      const { identifier, newPassword } = req.body;

      const user = await User.findByLoginOrId(identifier);
      if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(user.id, hashedPassword);
      res.status(200).json({ message: 'Пароль пользователя успешно изменен' });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  }
};

module.exports = adminController;