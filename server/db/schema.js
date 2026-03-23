import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  status: text('status'), // 'Hadir', 'Tidak Hadir', dll
  guestsCount: integer('guestsCount').default(0),
  message: text('message'),
  timestamp: text('timestamp'), // ISO string
});

export const config = sqliteTable('config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull()
});

export const galleries = sqliteTable('galleries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  imageUrl: text('imageUrl').notNull(),
  caption: text('caption'),
  orderIndex: integer('orderIndex').default(0)
});

export const loveStories = sqliteTable('love_stories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // text representation of date/year e.g "Desember 2021"
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('imageUrl'),
  orderIndex: integer('orderIndex').default(0)
});

export const digitalGifts = sqliteTable('digital_gifts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bankName: text('bankName').notNull(),
  accountNumber: text('accountNumber').notNull(),
  accountHolder: text('accountHolder').notNull(),
  qrCodeUrl: text('qrCodeUrl')
});
