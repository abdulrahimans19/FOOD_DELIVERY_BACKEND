import axios from 'axios';

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
) {
  console.log(fcmToken);

  const serverKey = process.env.FIREBASE_SERVER_KEY;
  const url = 'https://fcm.googleapis.com/fcm/send';

  const data = {
    to: fcmToken,
    notification: {
      image: 'https://m.media-amazon.com/images/I/61eErIrzHzL._SY879_.jpg',
      title: title,
      body: body,
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `key=${serverKey}`,
  };

  try {
    const response = await axios.post(url, data, { headers });

    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
}


export function getTodayDateWithoutTime() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
  // return '2023-08-09'
}

export function getOneWeekAgoDateWithoutTime() {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const year = oneWeekAgo.getFullYear();
  const month = String(oneWeekAgo.getMonth() + 1).padStart(2, '0');
  const day = String(oneWeekAgo.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
