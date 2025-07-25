import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// collection references
const ordersCol = db.collection('orders');
const swapsCol = db.collection('swaps');

interface Order {
  orderId: string;
  ownerUid: string;
  amount: number;
  currencyFrom: string;
  currencyTo: string;
  countryTo: string;
  status: 'OPEN' | 'MATCHED' | 'CLOSED';
  createdAt: FirebaseFirestore.Timestamp;
}

interface Swap {
  swapId: string;
  orderAId: string;
  orderBId: string;
  status: 'AWAIT_PAYMENT' | 'ONE_CONFIRMED' | 'DONE';
  confirmations: { [uid: string]: FirebaseFirestore.Timestamp };
}

export const createOrder = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const { ownerUid, amount, currencyFrom, currencyTo, countryTo } = req.body;
  const orderRef = ordersCol.doc();
  const order: Order = {
    orderId: orderRef.id,
    ownerUid,
    amount,
    currencyFrom,
    currencyTo,
    countryTo,
    status: 'OPEN',
    createdAt: admin.firestore.Timestamp.now(),
  };
  await orderRef.set(order);

  // try immediate match
  const snapshot = await ordersCol
    .where('status', '==', 'OPEN')
    .where('currencyFrom', '==', currencyTo)
    .where('currencyTo', '==', currencyFrom)
    .limit(1)
    .get();
  if (!snapshot.empty) {
    const matchDoc = snapshot.docs[0];
    await ordersCol.doc(order.orderId).update({ status: 'MATCHED' });
    await matchDoc.ref.update({ status: 'MATCHED' });
    const swapRef = swapsCol.doc();
    const swap: Swap = {
      swapId: swapRef.id,
      orderAId: order.orderId,
      orderBId: matchDoc.id,
      status: 'AWAIT_PAYMENT',
      confirmations: {},
    };
    await swapRef.set(swap);
  }

  res.json(order);
});

export const confirmPayment = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const { swapId, uid } = req.body;
  const swapRef = swapsCol.doc(swapId);
  const swapSnap = await swapRef.get();
  if (!swapSnap.exists) {
    res.status(404).send('Swap not found');
    return;
  }
  const data = swapSnap.data() as Swap;
  if (!data.confirmations) data.confirmations = {};
  data.confirmations[uid] = admin.firestore.Timestamp.now();
  let status: Swap['status'] = 'ONE_CONFIRMED';
  if (Object.keys(data.confirmations).length >= 2) {
    status = 'DONE';
    // close related orders
    await ordersCol.doc(data.orderAId).update({ status: 'CLOSED' });
    await ordersCol.doc(data.orderBId).update({ status: 'CLOSED' });
  }
  data.status = status;
  await swapRef.set(data, { merge: true });
  res.json(data);
});

export const seedDemo = functions.https.onRequest(async (_req, res) => {
  const userA = db.collection('users').doc();
  const userB = db.collection('users').doc();
  await userA.set({ uid: userA.id, name: 'Alice', country: 'CA', kycStatus: 'OK', balanceSim: 1000 });
  await userB.set({ uid: userB.id, name: 'Bob', country: 'CM', kycStatus: 'OK', balanceSim: 1000 });
  const order1 = ordersCol.doc();
  const order2 = ordersCol.doc();
  await order1.set({
    orderId: order1.id,
    ownerUid: userA.id,
    amount: 10,
    currencyFrom: 'CAD',
    currencyTo: 'XAF',
    countryTo: 'CM',
    status: 'OPEN',
    createdAt: admin.firestore.Timestamp.now(),
  });
  await order2.set({
    orderId: order2.id,
    ownerUid: userB.id,
    amount: 10,
    currencyFrom: 'XAF',
    currencyTo: 'CAD',
    countryTo: 'CA',
    status: 'OPEN',
    createdAt: admin.firestore.Timestamp.now(),
  });
  res.json({ users: [userA.id, userB.id], orders: [order1.id, order2.id] });
});
