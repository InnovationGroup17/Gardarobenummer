import { useState } from "react";
import { ref, get } from "firebase/database";
import { realtimeDB } from "../../database/firebaseConfig";
import { getMetroIPAddress } from "../getMetroIPAdress";
import { updateUserInfo } from "../../utilities/firebase/realtime/updateUserInfo";

// DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
// DEVELOPMENT MODE

// Function to create a Stripe customer
export const createStripeCustomer = async (user) => {
  const userRef = ref(realtimeDB, `users/${user.uid}`);
  const snapshot = await get(userRef);
  const userData = await snapshot.val();

  try {
    // Check if the user already has a Stripe ID
    if (!userData.stripeId) {
      console.log("Creating stripe customer");
      // Send a POST request to create a Stripe customer
      const response = await fetch(`${SERVER_URL}/customers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: userData.displayName,
        }),
      });

      // Parse the response to get the Stripe customer ID
      const stripeId = await response.json();

      // Update the user's information with the Stripe customer ID
      await updateUserInfo(user.uid, { stripeId: stripeId.customer.id });
      console.log("Success");
    }
  } catch (error) {
    console.error(error);
  }
};
