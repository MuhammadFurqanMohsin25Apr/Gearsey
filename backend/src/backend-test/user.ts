import { auth } from "@/lib/auth.js";

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: string,
  address: string,
  phone: string
) {
  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
      address,
      phone,
      rating: 0,
      total_reviews: 0,
    },
  });

  console.log("User created:", email);
}
