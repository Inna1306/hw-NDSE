export async function connectDB(url = process.env.MONGO_URL, retries = 5, delayMs = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(url, { serverSelectionTimeoutMS: 10000 });
            console.log(`MongoDB подключена: ${conn.connection.host}/${conn.connection.name}`);
            return conn;
        } catch (err) {
            console.error(`Ошибка подключения к MongoDB (попытка ${attempt}/${retries}): ${err.message}`);
            if (attempt === retries) process.exit(1);
            await new Promise((r) => setTimeout(r, delayMs));
        }
    }
}