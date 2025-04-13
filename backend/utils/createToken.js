import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  try {
    console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    console.log('userId:', userId);

    // Ensure we have a valid secret
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing from environment variables');
      throw new Error('JWT_SECRET is missing');
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log('Token generated successfully');

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    console.log('Cookie set successfully');

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

export default generateToken;
