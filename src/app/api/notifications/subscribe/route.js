import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '../../../../../lib/mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { subscription } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ success: false, message: 'Invalid subscription' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('bharatAI');
    
    await db.collection('push_subscriptions').updateOne(
      { 'subscription.endpoint': subscription.endpoint },
      {
        $set: {
          subscription,
          userId: session.user.email,
          active: true,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Subscription saved' });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save subscription' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await req.json();
    const client = await clientPromise;
    const db = client.db('bharatAI');
    
    await db.collection('push_subscriptions').updateOne(
      { 'subscription.endpoint': endpoint },
      { $set: { active: false, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: 'Subscription removed' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove subscription' }, { status: 500 });
  }
}
