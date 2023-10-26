import { useState } from "react";
import { ref, get } from "firebase/database";
import { realtimeDB } from "../../database/firebaseConfig";
import { getMetroIPAddress } from "../getMetroIPAdress";
import { useAuthListener } from "../../components/authenticate/RealTime";
import { updateUserInfo } from "../../utilities/firebase/realtime/updateUserInfo";

//DEVELOPMENT MODE
const metroIP = getMetroIPAddress();
const SERVER_URL = `http://${metroIP}:5001`;
//DEVELOPMENT MODE

export const createStripeCustomer = async (user) => {
  const userRef = ref(realtimeDB, `users/${user.uid}`);
  const snapshot = await get(userRef);
  const userData = await snapshot.val();

  try {
    if (!userData.stripeId) {
      console.log("Creating stripe customer");
      const response = await fetch(`${SERVER_URL}/customers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: userData.displayName,
        }),
      });

      const stripeId = await response.json();

      await updateUserInfo(user.uid, { stripeId: stripeId.customer.id });
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};
