const {pgTable,text,integer,timestamp,serial,boolean,numeric} = require("drizzle-orm/pg-core");

const user = pgTable("Users",{
    id:serial("id").primaryKey(),
    name:text("name").notNull(),
    email:text("email").notNull().unique(),
    password_hash:text("password_hash").notNull(),
    created_at:timestamp("created_at").notNull().defaultNow()
});

module.exports={user};