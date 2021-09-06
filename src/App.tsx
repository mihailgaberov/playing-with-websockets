import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import './App.css';

const WSS_FEED_URL: string = 'wss://www.cryptofacilities.com/ws/v1';

const productsMap: any = {
  "PI_XBTUSD": "PI_ETHUSD",
  "PI_ETHUSD": "PI_XBTUSD",
}

function App() {
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) =>  console.log(JSON.parse(event.data))
  });

  const [product, setProduct] =  useState('PI_XBTUSD')

  const toggle = () => {
    setProduct(productsMap[product]) 
  }


  useEffect(() => {
    function connect(product: string) {
      const unSubscribeMessage = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [productsMap[product]]
      };

      console.log("Unsubscribe: ", unSubscribeMessage.product_ids)
      
      sendJsonMessage(unSubscribeMessage);

      const subscribeMessage = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [product]
      };

      console.log("Subscribe: ", subscribeMessage.product_ids)

      sendJsonMessage(subscribeMessage);
    }

    connect(product)
  }, [sendJsonMessage, product]);

  return (
    <div className="App">
      Playing with WebSockets (look at the console)
      <aside>
        <button onClick={toggle}>TOGGLE</button>
      </aside>
    </div>
  );
}

export default App;
