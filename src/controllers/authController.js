const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const yup = require('yup');

const registerSchema = yup.object({
  login: yup.string().min(3, 'Логин должен быть не короче 3 символов').required('Логин обязателен'),
  email: yup.string().email('Неверный формат email').required('Email обязателен'),
  password: yup.string().min(6, 'Пароль должен быть не короче 6 символов').required('Пароль обязателен')
});

const loginSchema = yup.object({
  login: yup.string().required('Логин обязателен'),
  password: yup.string().required('Пароль обязателен')
});

const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required('Текущий пароль обязателен'),
  newPassword: yup.string().min(6, 'Новый пароль должен быть не короче 6 символов').required('Новый пароль обязателен')
});

const updateEmailSchema = yup.object({
  email: yup.string().email('Неверный формат email').required('Email обязателен')
});

const updateLoginSchema = yup.object({
  login: yup.string().min(3, 'Логин должен быть не короче 3 символов').required('Логин обязателен')
});

const authController = {
  register: async (req, res) => {
    try {
      await registerSchema.validate(req.body, { abortEarly: false });
      const { login, email, password } = req.body;

      const existingLogin = await User.findByLogin(login);
      if (existingLogin) return res.status(400).json({ message: 'Логин уже занят' });

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) return res.status(400).json({ message: 'Email уже занят' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create(login, email, hashedPassword);
      res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  },
  login: async (req, res) => {
    try {
      await loginSchema.validate(req.body, { abortEarly: false });
      const { login, password } = req.body;

      const user = await User.findByLogin(login);
      if (!user) return res.status(400).json({ message: 'Неверный логин или пароль' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Неверный логин или пароль' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      await updatePasswordSchema.validate(req.body, { abortEarly: false });
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Неверный текущий пароль' });

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(userId, hashedNewPassword);
      res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  },
  changeEmail: async (req, res) => {
    try {
      await updateEmailSchema.validate(req.body, { abortEarly: false });
      const { email } = req.body;
      const userId = req.user.id;

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) return res.status(400).json({ message: 'Email уже занят' });

      await User.updateEmail(userId, email);
      res.json({ message: 'Email успешно изменен' });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  },
  changeLogin: async (req, res) => {
    try {
      await updateLoginSchema.validate(req.body, { abortEarly: false });
      const { login } = req.body;
      const userId = req.user.id;

      const existingLogin = await User.findByLogin(login);
      if (existingLogin) return res.status(400).json({ message: 'Логин уже занят' });

      await User.updateLogin(userId, login);
      res.json({ message: 'Логин успешно изменен' });
    } catch (error) {
      res.status(400).json({ message: error.errors || error.message });
    }
  }
};

module.exports = authController;