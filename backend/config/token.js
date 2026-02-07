import jwt from "jsonwebtoken"; 


export const genToken = (userid) => {
  try {
    return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: '30d' });
  } catch (error) {
    console.error("Token generation error:", error);
  }
};
