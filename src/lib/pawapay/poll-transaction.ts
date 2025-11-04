// utils/pawapay.ts
export const pollTransactionStatus = async (
  depositId: string,
  intervalMs = 4000,
  maxAttempts = 10
): Promise<any> => {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    try {
      const response = await fetch(
        `https://pro-oasis-462211.oa.r.appspot.com/api/deposits/${depositId}`
      );
      const result = await response.json();

      console.log("PawaPay transaction status response:", result);

      // Stop polling if transaction is successful or completed
      if (result?.data?.status === "SUCCESSFUL" || result?.data?.status === "COMPLETED") {
        console.log(`✅ Transaction ${depositId} confirmed.`);
        return result;
      }

      // Stop polling if transaction failed or declined
      if (result?.data?.status === "FAILED" || result?.data?.status === "DECLINED") {
        console.log(`❌ Transaction ${depositId} failed or declined.`);
        return result; // Return the response body even if failed
      }

      console.log(`⏳ Transaction ${depositId} still pending... (Attempt ${attempt})`);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    } catch (error: any) {
      console.error("Error checking transaction status:", error);

      // Stop polling on network/fetch error and return the error info
      return { error: error.message || "Unknown error", attempt };
    }
  }

  // If polling exceeds maxAttempts
  return { error: "Transaction confirmation timed out. Please try again." };
};
