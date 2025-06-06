const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: "AIzaSyBiFHTcgZ-3LGUg_oFD0lsOX_nSp8bPgrQ",
    authDomain: "inventory-manager-3a6c5.firebaseapp.com",
    databaseURL: "https://inventory-manager-3a6c5-default-rtdb.firebaseio.com",
    projectId: "inventory-manager-3a6c5",
    storageBucket: "inventory-manager-3a6c5.firebasestorage.app",
    messagingSenderId: "781434446693",
    appId: "1:781434446693:web:f658434dab7be77e15b78c",
    measurementId: "G-GDPDJ4DFBF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function generateOrders() {
  const ordersRef = collection(db, 'orders');

  for (let i = 0; i < 20; i++) {
    const items = [
      {
        productId: 'prod1',
        productName: 'Item A',
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: 100,
        totalPrice: 0,
      },
      {
        productId: 'prod2',
        productName: 'Item B',
        quantity: Math.floor(Math.random() * 5) + 1,
        unitPrice: 150,
        totalPrice: 0,
      },
    ];

    items.forEach(item => {
      item.totalPrice = item.quantity * item.unitPrice;
    });

    const order = {
      userId: 'sampleUser',
      items,
      totalPrice: items.reduce((sum, item) => sum + item.totalPrice, 0),
      createdAt: Timestamp.fromDate(new Date(Date.now() - i * 86400000)), // Past N days
      status: 'Completed',
    };

    await addDoc(ordersRef, order);
    console.log(`Order ${i + 1} added`);
  }

  console.log('All fake orders generated.');
}

generateOrders();
