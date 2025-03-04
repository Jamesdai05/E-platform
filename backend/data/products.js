const products = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: '/images/airpods.jpg',
    description:
      'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 11 Pro 256GB Memory',
    image: '/images/phone.jpg',
    description:
      'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
    brand: 'Apple',
    category: 'Electronics',
    price: 599.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: 'Cannon EOS 80D DSLR Camera',
    image: '/images/camera.jpg',
    description:
      'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
    brand: 'Cannon',
    category: 'Electronics',
    price: 929.99,
    countInStock: 5,
    rating: 3,
    numReviews: 12,
  },
  {
    name: 'Sony Playstation 4 Pro White Version',
    image: '/images/playstation.jpg',
    description:
      'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
    brand: 'Sony',
    category: 'Electronics',
    price: 399.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'Logitech G-Series Gaming Mouse',
    image: '/images/mouse.jpg',
    description:
      'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
    brand: 'Logitech',
    category: 'Electronics',
    price: 49.99,
    countInStock: 7,
    rating: 3.5,
    numReviews: 10,
  },
  {
    name: 'Amazon Echo Dot 3rd Generation',
    image: '/images/alexa.jpg',
    description:
      'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
    brand: 'Amazon',
    category: 'Electronics',
    price: 29.99,
    countInStock: 0,
    rating: 4,
    numReviews: 12,
  },
  {
    name: 'Xiaomi Redmi Pad Pro (8GB RAM + 256GB Storage)',
    image: '/images/xiaomi.jpg',
    description:
      'Xiaomi Redmi Pad Pro WiFi (8GB RAM + 256GB Storage)',
    brand: 'Xiao Mi',
    category: 'Electronics',
    price: 394.89,
    countInStock: 3,
    rating: 4.6,
    numReviews: 47,
  },
  {
    name: 'Logitech MX Master 3S - Wireless Performance Mouse',
    image: '/images/logi_mouse.jpg',
    description:
      'Logitech MX Master 3S - Wireless Performance Mouse with Ultra-Fast Scrolling, Ergo, 8K DPI, Track on Glass, Quiet Clicks, USB-C, Bluetooth, Windows, Linux, Chrome-Graphite',
    brand: 'Logitech',
    category: 'Electronics',
    price: 104.99,
    countInStock: 1,
    rating: 4.7,
    numReviews: 6371,
  },
  {
    name: 'Logitech M331 SILENT PLUS Wireless Mouse with Nano Receiver',
    image: '/images/logiMouse.jpg',
    description:
      'SPECS & DETAILS Dimensions Mouse (height x width x depth): 105.4 mm x 67.9 mm x 38.4 mm Weight: 91.0 g Nano Receiver (Height x Width x Depth): 14.4 x 18.7 x 6.1 mm Weight: 1.8 g System Requirements Windows 10 or later, Windows 8, Windows RT, Windows 7 Mac OS X 10.5 or later Chrome OS Linux Kernel 2.6+2 USB connection: available USB port required. Technical Specifications Connection Type: 2.4GHz wireless connection Wireless range: 10 meters Connect / Power: Yes, on/off switch Battery Details: 1 x AA Battery life: 24 months* *Battery life may vary based on user and computing DPI (Min/Max): 1000± Sensor technology: Logitech Advanced Optical Tracking Sensor resolution: 1000 dpi Scroll Wheel: Yes, 2D, optical Number of buttons: 3 Standard and Special Buttons: Middle click Package Contents Mouse Nano receiver 1 AA battery (pre-installed) User documentation',
    brand: 'Logitech',
    category: 'Electronics',
    price: 23.99,
    countInStock: 10,
    rating: 4.4,
    numReviews: 9736,
  },

  {
    name: 'Xbox Wireless Controller(Carbon Black)',
    image: '/images/console.jpg',
    description:
      'It offers powerful gaming with its latest models, Xbox Series X and Series S. It features high performance, backward compatibility, Xbox Game Pass, and online services like Xbox Live, providing a versatile and immersive gaming experience for all types of gamers.',
    brand: 'Microsoft',
    category: 'Electronics',
    price: 68.99,
    countInStock: 10,
    rating: 4.3,
    numReviews: 12546,
  },

  {
    name: 'UGREEN Revodok 105 USB C Hub 5 in 1 Multiport Adapter',
    image: '/images/ugreen.jpg',
    description:
      'USB C Hub 5 in 1 Multiport Adapter 4K HDMI, 100W Power Delivery, 3 USB A Data Ports, Type C Dongle for PC, Laptop, MacBook Air, iMac, iPad, iPhone 16/15 Pro Max, Galaxy S24',
    brand: 'Ugreen',
    category: 'Electronics',
    price: 17.99,
    countInStock: 10,
    rating: 4.6,
    numReviews: 1509,
  },

  {
    name: 'JBL Charge 5 Portable Bluetooth Speaker, Black',
    image: '/images/JBL_speaker.jpg',
    description:
      'Take the party with you no matter what the weather. The JBL Charge 5 speaker delivers bold JBL Original Pro Sound, with its optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators. Up to 20 hours of playtime and a handy powerbank to keep your devices charged to keep the party going all night. Rain? Spilled drinks? Beach sand? The IP67 waterproof and dustproof Charge 5 survives whatever comes its way. Thanks to PartyBoost, you can connect multiple JBL PartyBoost-enabled speakers for a sound big enough for any crowd. With all-new colors inspired by the latest street fashion trends, it looks as great as it sounds. Available in Black colour.',
    brand: 'JBL',
    category: 'Electronics',
    price: 185.99,
    countInStock: 10,
    rating: 4.7,
    numReviews: 16760,
  },
]

export default products