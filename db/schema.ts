import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const portfolioContent = sqliteTable("portfolio_content", {
  id: integer("id").primaryKey(),
  draft: text("draft").notNull(),
  published: text("published").notNull(),
  revision: integer("revision").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
  publishedAt: text("published_at")
});
