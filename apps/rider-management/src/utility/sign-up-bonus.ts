/**
 * Determines the signup bonus amount based on signup position.
 * @param signupPosition - The user's signup position (1-based index).
 * @returns The bonus amount for the user.
 */
export function getSignupBonusAmount(signupPosition: number): number {
  if (signupPosition <= 100) {
    return 2000; // First 100 users get 2000
  } else if (signupPosition <= 300) {
    return 2000; // Next 200 users (101-300) get 2000
  } else if (signupPosition <= 500) {
    return 1000; // Next 200 users (301-500) get 1000
  }

  return 0; // No bonus for users beyond 500
}
