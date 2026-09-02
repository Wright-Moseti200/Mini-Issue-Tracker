const {pgTable,text,integer,timestamp,serial,boolean,numeric} = require("drizzle-orm/pg-core");
const { user } = require("./userSchema");

const Issues = pgTable("Issues",{
    id:serial("id").primaryKey(),
    user_id:integer("user_id").references(()=>user.id),
    title:text("title").notNull().unique(),
    description:text("description"),
    priority:text("priority").notNull(),
    status:text("status").notNull(),
    created_at:timestamp("created_at").defaultNow().notNull(),
    updated_at:timestamp("updated_at").defaultNow().notNull(),
});

module.exports={Issues};