async function testCheckout() {
  console.log('Testing checkout endpoint...');
  
  const payload = {
    listing_id: 'lst_001',
    shipping_address: 'KN 5 Rd, Remera',
    district: 'Kigali'
  };

  try {
    const res = await fetch('http://127.0.0.1:3000/v1/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(`Checkout Failed! Status: ${res.status}`);
      const text = await res.text();
      console.error(text);
      process.exit(1);
    }

    const json = await res.json();
    console.log('Checkout Success! Response:', JSON.stringify(json, null, 2));

    // Verify listing status is 'sold'
    const listingRes = await fetch('http://127.0.0.1:3000/v1/listings/lst_001');
    const listingJson = await listingRes.json();
    
    if (listingJson.data.status === 'sold') {
      console.log('✅ Listing status successfully updated to "sold"!');
      process.exit(0);
    } else {
      console.error(`❌ Listing status is ${listingJson.data.status}, expected "sold".`);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Error during test:', err.message);
    process.exit(1);
  }
}

testCheckout();
