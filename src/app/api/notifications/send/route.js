import { NextResponse } from 'next/server';
import webpush from 'web-push';
import clientPromise from '../../../../../lib/mongodb';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@bharatai.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
}

export async function POST(req) {
  try {
    const { title, message, url } = await req.json();

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Title and message are required' },
        { status: 400 }
      );
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { success: false, message: 'Push notification service not configured' },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db('bharatAI');
    const subscriptions = await db.collection('push_subscriptions').find({ active: true }).toArray();

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscriptions found',
        total: 0,
        sent: 0,
        failed: 0
      });
    }

    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/logo.png',
      badge: '/logo.png',
      url: url || '/',
      timestamp: Date.now()
    });

    let sentCount = 0;
    let failedCount = 0;

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        sentCount++;
      } catch (error) {
        failedCount++;
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.collection('push_subscriptions').updateOne(
            { _id: sub._id },
            { $set: { active: false } }
          );
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${sentCount} out of ${subscriptions.length} subscribers`,
      total: subscriptions.length,
      sent: sentCount,
      failed: failedCount
    });

  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
