import { Messaging } from 'firebase-admin/messaging';

import firebase from './firebase.js';

const Notification = new Messaging(firebase);

const send = async (token, { title, body, channel = "general" }) => {
  try {
    if (typeof token === "string") {
      token = [token];
    }
    const bodyRandom = [
      "Don't miss out on limited offers! Get our exclusive specialty coffee packs, including a wide selection of coffee variants, at a special price.",
      "Good morning, coffee lovers! Enjoy your favorite coffee at a special price for the first purchase every day. Starting today, your life is blessed with delicious coffee.",
      "Are you a coffee lover? Don't miss our free coffee workshop this Saturday. Learn the art of brewing the perfect cup and taste the difference!",
      "Coffee enthusiasts, we've got good news for you! Starting today, all our new flavored coffee drinks are available in-store. Don't miss out!",
      "Don't miss out on limited-time offers! Get our exclusive coffee package, featuring a selection of premium coffee varieties, at a special price.",
      "Want to kickstart your day with a boost? Get an extra espresso shot for free with any coffee purchase. Visit our store now!",
    ];
    const notification = {
      title: title || "Hey Coffeeholic!",
      body: body || bodyRandom[Math.floor(Math.random() * bodyRandom.length)],
    };
    await Notification.sendEachForMulticast({
      tokens: token,
      notification,
      data: {
        channel,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

function verifyFCMToken(fcmToken) {
  return firebase.messaging().send(
    {
      token: fcmToken,
    },
    true
  );
}

export default {
  send,
  verifyFCMToken,
};
