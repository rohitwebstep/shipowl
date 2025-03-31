import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/utils/authUtils';
import { comparePassword } from '@/utils/hashUtils';
import bcrypt from 'bcryptjs';

// Dummy User Database (Replace with actual DB)
const users = [
    { id: '1', email: 'admin@example.com', password: '$2b$10$PZmGqk9pWg/yH6Z1zuhef.6OOkHLKVNKIFLJCO/AcarRtt0OC4o8O' }, // bcrypt-hashed password
];

export async function handleLogin(req: NextRequest) {
    const { email, password } = await req.json();

    const user = users.find((u) => u.email === email);
    if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`Hashed Password: ${hashedPassword}`); // Log the hashed password

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken(user.id);
    return NextResponse.json({ message: 'Login successful', token });
}
