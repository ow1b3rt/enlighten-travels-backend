import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcryptjs'
import { db } from "../config/db.js";
import { users, authors } from "../db/schema/index.js"

const args = process.argv.slice(2)

const email = args[0]
const password = args[1]

if (!email || !password) {
    console.log(
        'Usage: npm run newadmin email password'
    )

    process.exit(1)
}

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const [user] = await db.insert(users).values({
          name: 'admin',
          email: email,
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
        }).returning()

        console.log('Admin created successfully')
        console.log('Creating author ...')

        const [author] = await db.insert(authors).values({
          userId: user.id,
          bio: 'Admin user',
        }).returning()

        console.log('Author created successfully')

        process.exit(0)
    } catch (error) {
        console.log(error)

        process.exit(1)
    }
}

createAdmin()
