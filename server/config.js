const sql = require('mssql');
const {json} = require("express");
require('dotenv').config();

class Database {
    poolconnection = null;
    connected = false;

    async connect() {
        try {
            console.log(`Database connecting...${this.connected}`);
            if (this.connected === false) {
                this.poolconnection = await sql.connect(`Server=${process.env.DB_HOST},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PASS};`);
                this.connected = true;
                console.log('Database connection successful');
            } else {
                console.log('Database already connected');
            }
        } catch (error) {
            console.error(`Error connecting to database: ${JSON.stringify(error)}`);
        }
    }

    async disconnect() {
        try {
            this.poolconnection.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error(`Error closing database connection: ${error}`);
        }
    }

    async executeQuery(query) {
        await this.connect();
        const request = this.poolconnection.request();
        const result = await request.query(query);

        return result.rowsAffected[0];
    }

    async getServices() {
        await this.connect();
        const request = this.poolconnection.request();
        const result = await request.query(`SELECT * FROM services`);

        return result.recordset;
    }

    async getServicesByUserId(userId) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('user_id', sql.Int, userId);
        const result = await request.query(`SELECT * FROM services WHERE user_id = @user_id`);

        return result.recordset;
    }

    async updateDetailsServices(id, details) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('id', sql.Int, id);
        request.input('details', sql.NVarChar(2555), JSON.stringify(details));
        const result = await request.query(`UPDATE services SET details = @details WHERE id = @id`);
        return result.rowsAffected[0];
    }

    async deleteService(userId, id) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('id', sql.Int, id);
        request.input('user_id', sql.Int, userId);
        const result = await request.query(`DELETE FROM services WHERE id = @id AND user_id = @user_id`);
        return result.rowsAffected[0];
    }

    async switchStatus(userId, id) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('id', sql.Int, id);
        request.input('user_id', sql.Int, userId);
        const result = await request.query(`UPDATE services SET status = ~status WHERE id = @id AND user_id = @user_id`);
        return result.rowsAffected[0];
    }

    async createUser(data) {
        await this.connect();
        const request = this.poolconnection.request();

        request.input('firstname', sql.NVarChar(255), data.firstname);
        request.input('lastname', sql.NVarChar(255), data.lastname);
        request.input('username', sql.NVarChar(255), data.username);
        request.input('email', sql.NVarChar(255), data.email);
        request.input('password', sql.NVarChar(255), data.password);
        request.input('birthdate', sql.Date, data.birthdate);
        request.input('sex', sql.NVarChar(255), data.sex)

        const result = await request.query(
            `INSERT INTO users (firstname, lastname, username, email, password, birthdate, sex) VALUES (@firstname, @lastname, @username, @email, @password, @birthdate, @sex)`
        );

        return result.rowsAffected[0];
    }

    async updateUserDiscordId(id, discordId) {
        await this.connect();
        const request = this.poolconnection.request();

        request.input('id', sql.Int, id);
        request.input('discord_id', sql.NVarChar(255), discordId);

        const result = await request.query(
            `UPDATE users SET discord_id = @discord_id WHERE id = @id`
        );

        return result.rowsAffected[0];
    }

    async createDiscord(data) {
        await this.connect();
        const request = this.poolconnection.request();

        request.input('id', sql.NVarChar(255), data.id);
        request.input('user_id', sql.Int, data.user_id);
        request.input('access_token', sql.NVarChar(255), data.access_token);
        request.input('refresh_token', sql.NVarChar(255), data.refresh_token);
        request.input('guilds', sql.NVarChar(2555), JSON.stringify(data.guilds));
        request.input('joined_guilds', sql.NVarChar(2555), JSON.stringify(data.joined_guilds));

        const result = await request.query(
            `INSERT INTO discords (id, user_id, access_token, refresh_token, guilds, joined_guilds) VALUES (@id, @user_id, @access_token, @refresh_token, @guilds, @joined_guilds)`);
        return result.rowsAffected[0];
    }

    async updateDiscord(id, data) {
        await this.connect();
        const request = this.poolconnection.request();

        request.input('id', sql.NVarChar(255), id);
        request.input('user_id', sql.Int, data.user_id);
        request.input('access_token', sql.NVarChar(255), data.access_token);
        request.input('refresh_token', sql.NVarChar(255), data.refresh_token);
        request.input('guilds', sql.NVarChar(2555), JSON.stringify(data.guilds));
        request.input('joined_guilds', sql.NVarChar(2555), JSON.stringify(data.joined_guilds));

        const result = await request.query(
            `UPDATE discords SET user_id = @user_id, access_token = @access_token, refresh_token = @refresh_token, guilds = @guilds, joined_guilds = @joined_guilds WHERE id = @id`);
        return result.rowsAffected[0];
    }

    async isDiscordExist(id) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('id', sql.NVarChar(255), id);
        const result = await request.query(`SELECT * FROM discords WHERE id = @id`);
        return result.recordset[0];
    }

    async getDiscordByUserId(userId) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('user_id', sql.Int, userId);
        const result = await request.query(`SELECT * FROM discords WHERE user_id = @user_id`);
        return result.recordset[0];
    }

    async getUserByUsername(username) {
        await this.connect();
        const request = this.poolconnection.request();
        request.input('username', sql.NVarChar(255), username);
        const result = await request.query(`SELECT * FROM users WHERE username = @username`);
        return result.recordset[0];
    }

    async getAllUsers() {
        await this.connect();
        const request = this.poolconnection.request();
        const result = await request.query(`SELECT * FROM users`);

        return result.recordsets[0];
    }

    async getUser(id) {
        await this.connect();

        const request = this.poolconnection.request();
        const result = await request
            .input('id', sql.Int, +id)
            .query(`SELECT * FROM users WHERE id = @id`);

        return result.recordset[0];
    }

    async update(id, data) {
        await this.connect();

        const request = this.poolconnection.request();

        request.input('id', sql.Int, +id);
        request.input('firstname', sql.NVarChar(255), data.firstname);
        request.input('lastname', sql.NVarChar(255), data.lastname);
        request.input('username', sql.NVarChar(255), data.username);
        request.input('email', sql.NVarChar(255), data.email);
        request.input('password', sql.NVarChar(255), data.password);
        request.input('birthdate', sql.Date, data.birthdate);
        request.input('sex', sql.NVarChar(255), data.sex)

        const result = await request.query(
            `UPDATE Person SET firstName=@firstname, lastName=@lastname, username=@username, email=@email, password=@password, birthdate=@birtdate, sex=@sex WHERE id = @id`
        );

        return result.rowsAffected[0];
    }

    async delete(id) {
        await this.connect();

        const idAsNumber = Number(id);

        const request = this.poolconnection.request();
        const result = await request
            .input('id', sql.Int, idAsNumber)
            .query(`DELETE FROM users WHERE id = @id`);

        return result.rowsAffected[0];
    }

    async createService(data) {
        await this.connect();
        const request = this.poolconnection.request();

        request.input('user_id', sql.Int, data.user_id);
        request.input('action_name', sql.NVarChar(255), data.action_name);
        request.input('action_url', sql.NVarChar(255), data.action_url);
        request.input('reaction_name', sql.NVarChar(255), data.reaction_name);
        request.input('reaction_url', sql.NVarChar(255), data.reaction_url);
        request.input('details', sql.NVarChar(2555), JSON.stringify(data.details));
        request.input('status', sql.Bit, 1);

        const result = await request.query(
            `INSERT INTO services (user_id, action_name, action_url, reaction_name, reaction_url, details, status) VALUES (@user_id, @action_name, @action_url, @reaction_name, @reaction_url, @details, @status)`
        );

        return result.rowsAffected[0];
    }
}

const database = new Database();

module.exports = database;
