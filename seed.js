
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Note = require('./src/models/noteModel');

const prisma = new PrismaClient();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curso-app');
    console.log('MongoDB conectado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    return false;
  }
};

const initializeDatabase = async () => {
  try {

    const mongoConnected = await connectMongo();
    if (!mongoConnected) {
      console.error('Falha ao conectar ao MongoDB. Abortando inicialização.');
      return;
    }

    console.log('Iniciando a criação de dados iniciais...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('aluno123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });
    console.log('Usuário administrador criado:', admin.name);

    const student = await prisma.user.upsert({
      where: { email: 'aluno@example.com' },
      update: {},
      create: {
        name: 'Aluno Teste',
        email: 'aluno@example.com',
        password: studentPassword,
        role: 'STUDENT'
      }
    });
    console.log('Usuário aluno criado:', student.name);

    const courses = [
      {
        title: 'Introdução à Programação',
        description: 'Um curso introdutório sobre os fundamentos da programação, incluindo lógica, algoritmos e estruturas de dados básicas.',
        duration: 40,
        category: 'Programação',
        instructor: 'Prof. Carlos Silva',
        status: 'ACTIVE'
      },
      {
        title: 'Desenvolvimento Web Fullstack',
        description: 'Aprenda a desenvolver aplicações web completas, do frontend ao backend, utilizando tecnologias modernas como React, Node.js e bancos de dados relacionais e não-relacionais.',
        duration: 80,
        category: 'Desenvolvimento Web',
        instructor: 'Profa. Ana Oliveira',
        status: 'ACTIVE'
      },
      {
        title: 'Ciência de Dados com Python',
        description: 'Explore o mundo da análise de dados utilizando Python e suas principais bibliotecas como Pandas, NumPy e Matplotlib.',
        duration: 60,
        category: 'Ciência de Dados',
        instructor: 'Prof. Marcos Santos',
        status: 'ACTIVE'
      }
    ];

    for (const courseData of courses) {
      const course = await prisma.course.upsert({
        where: { 
          title: courseData.title 
        },
        update: {},
        create: courseData
      });
      console.log('Curso criado:', course.title);
    }

    const allCourses = await prisma.course.findMany();
    
    for (const course of allCourses) {
      const enrollment = await prisma.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: student.id,
            courseId: course.id
          }
        },
        update: {},
        create: {
          userId: student.id,
          courseId: course.id
        }
      });
      console.log(`Aluno matriculado no curso: ${course.title}`);
    }

    await Note.deleteMany({}); // Limpar anotações existentes

    const notes = [
      {
        content: 'Algoritmos são sequências finitas de passos lógicos para resolver um problema. Importante lembrar das estruturas de controle: sequência, seleção e repetição.',
        userId: student.id,
        courseId: allCourses[0].id,
        tags: ['algoritmos', 'fundamentos', 'importante']
      },
      {
        content: 'React utiliza o conceito de componentes para construir interfaces. Os hooks como useState e useEffect são fundamentais para gerenciar estado e efeitos colaterais.',
        userId: student.id,
        courseId: allCourses[1].id,
        tags: ['react', 'frontend', 'hooks']
      },
      {
        content: 'Pandas é uma biblioteca poderosa para manipulação e análise de dados em Python. O DataFrame é a estrutura principal e permite operações como filtragem, agrupamento e agregação.',
        userId: student.id,
        courseId: allCourses[2].id,
        tags: ['python', 'pandas', 'dataframe']
      }
    ];

    for (const noteData of notes) {
      const note = await Note.create(noteData);
      console.log('Anotação criada para o curso:', noteData.courseId);
    }

    console.log('Inicialização do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a inicialização do banco de dados:', error);
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
  }
};

initializeDatabase();
