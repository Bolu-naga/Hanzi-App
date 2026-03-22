import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Ini yang dicari sama error terminal lo
    url: process.env.DATABASE_URL! 
  }
});