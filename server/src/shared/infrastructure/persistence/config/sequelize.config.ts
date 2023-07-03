import dotenv from "dotenv";
import { Dialect, Sequelize } from "sequelize";

import { ConversationInstance } from "../../../../Conversations/infrastructure/ConversationInstance";
import { MessageInstance } from "../../../../Messages/infrastructure/MessageInstance";
import { UserInstance } from "../../../../Users/infrastructure/persistences/sequelize/UserInstance";

dotenv.config();
const username = process.env.MYSQL_USER ?? "";
const password = process.env.MYSQL_PASSWORD ?? "";
const database = process.env.DATABASE_NAME ?? "";
export const logBuffer: string[] = [];
const dialect: Dialect = "mysql";
const options = { dialect, logging: true };
if (process.env.NODE_ENV !== "dev") {
	options.logging = false;
}
export const sequelize = new Sequelize(database, username, password, options);
function defineModels(sequelize: Sequelize) {
	const User = sequelize.define("User", UserInstance, { timestamps: false });
	const Conversation = sequelize.define("Conversation", ConversationInstance, {
		timestamps: false,
	});
	const Message = sequelize.define("Message", MessageInstance, {
		timestamps: true,
		updatedAt: false,
	});

	// Retornando los modelos para su uso posterior
	return { User, Conversation, Message };
}
export const { User, Conversation, Message } = defineModels(sequelize);
function defineRelations() {
	User.belongsToMany(Conversation, { through: "Users_Conversations", timestamps: false });
	Conversation.belongsToMany(User, { through: "Users_Conversations", timestamps: false });
	Message.belongsTo(User);
	User.hasMany(Message);
	Message.belongsTo(Conversation);
	Conversation.hasMany(Message);
}
defineRelations();
sequelize
	.authenticate()
	.then(() => console.log("Connection has been established successfully."))
	.catch((error) => console.error("Unable to connect to the database:", error));

sequelize
	.sync()
	.then(() => console.log("Database & tables created!"))
	.catch((error) => console.error("Unable to connect to the database:", error));
